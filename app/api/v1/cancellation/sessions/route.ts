import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth/api-keys";
import { createAdminServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  console.log("================= [REVORA HANDSHAKE START] =================");
  console.log("Incoming Request URL:", request.url);
  
  const authHeader = request.headers.get("authorization");
  console.log("Auth Header Received:", authHeader);

  const tenant = await validateApiKey(authHeader);
  console.log("Validated Tenant Object Result:", tenant);

  if (!tenant) {
    console.warn("❌ [REVORA HANDSHAKE]: API Key Validation Failed. Returning 401.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Request Body Received:", body);

    const { external_customer_id, email, name, external_subscription_id } = body;

    if (!external_customer_id) {
      console.warn("❌ [REVORA HANDSHAKE]: Missing external_customer_id in request body.");
      return NextResponse.json(
        { error: "Missing required field: external_customer_id" },
        { status: 400 }
      );
    }

    console.log("Initializing Supabase Admin Service Client...");
    const supabase = createAdminServiceClient();

    // 1. Find or create customer
    console.log(`Looking up customer with external_id: ${external_customer_id} for Org: ${tenant.organizationId}`);
    const { data: existingCustomer, error: lookupError } = await supabase
      .from("customers")
      .select("id")
      .eq("organization_id", tenant.organizationId)
      .eq("external_customer_id", external_customer_id)
      .maybeSingle();

    if (lookupError) {
      console.error("❌ [REVORA CUSTOMER LOOKUP ERROR]:", lookupError);
      throw lookupError;
    }

    let customerId: string;

    if (existingCustomer) {
      console.log("Found existing customer ID:", existingCustomer.id);
      customerId = existingCustomer.id;
    } else {
      console.log("Customer not found. Seeding new customer record maps row...");
      const { data: newCustomer, error: insertError } = await supabase
        .from("customers")
        .insert({
          organization_id: tenant.organizationId,
          external_customer_id,
          email: email || null,
          name: name || null,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("❌ [REVORA CUSTOMER INSERT ERROR]:", insertError);
        throw insertError;
      }

      customerId = newCustomer.id;
      console.log("Successfully created new customer with ID:", customerId);
    }

    // 2. Select Highest Priority Active Cancellation Flow
    console.log(`Fetching active cancellation flow patterns for Org: ${tenant.organizationId}`);
    const { data: flow, error: flowError } = await supabase
      .from("cancellation_flows")
      .select("id, trigger_config")
      .eq("organization_id", tenant.organizationId)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (flowError) {
      console.error("❌ [REVORA FLOW LOOKUP ERROR]:", flowError);
    }
    console.log("Active Flow Match Found:", flow);

    // 3. Create Cancellation Session
    console.log("Instantiating track cancellation session row log record...");
    const { data: session, error: sessionError } = await supabase
      .from("cancellation_sessions")
      .insert({
        organization_id: tenant.organizationId,
        customer_id: customerId,
        flow_id: flow?.id || null,
        external_subscription_id: external_subscription_id || null,
        status: "started",
      })
      .select("id, status, created_at")
      .single();

    if (sessionError) {
      console.error("❌ [REVORA SESSION INSERT ERROR]:", sessionError);
      throw sessionError;
    }

    console.log("================= [REVORA HANDSHAKE SUCCESS] =================");
    console.log("Created Session Details:", session);

    return NextResponse.json(
      {
        session_id: session.id,
        status: session.status,
        flow: flow || null,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("================= [REVORA HANDSHAKE INTERNAL CRASH] =================");
    console.error("[Revora 500 Stack]:", err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json(
      { error: message, details: String(err) },
      { status: 500 }
    );
  }
}
