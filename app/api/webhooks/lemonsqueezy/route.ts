import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize a dedicated server-side Supabase client using administrative bypass keys
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  try {
    // 1. SECURITY CHECK: Verify the secret signing signature token matching Lemon Squeezy precisely
    const rawBody = await req.text();
    const hmacHeader = req.headers.get("x-signature") || "";
    
    // FIXME: Once you generate your secret signature passphrase token inside Lemon Squeezy Webhooks panel, paste it inside your .env file
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "your_local_dev_secret_fallback";
    
    const digest = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(hmacHeader), Buffer.from(digest))) {
      return new NextResponse("Invalid webhook signature token validation payload.", { status: 401 });
    }

    // 2. PARSE EVENT METRICS: Read incoming payload actions directly from Lemon Squeezy nodes
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const dataAttributes = payload.data.attributes;
    const customParams = payload.meta.custom_data || {};

    console.log(`[Lemon Squeezy Webhook Intercepted]: ${eventName}`);

    // 3. TRANSACTION LEDGER FILTER WRITER
    if (eventName === "order_created" || eventName === "subscription_created") {
      const customerEmail = dataAttributes.user_email || dataAttributes.customer_email;
      const planValue = dataAttributes.subtotal_usd ? (dataAttributes.subtotal_usd / 100) : 99.00;
      
      // Extract target workspace metrics passed cleanly during user checkout handshakes
      const targetOrganizationId = customParams.organization_id;
      const chosenTierName = customParams.tier_name || "starter";

      if (targetOrganizationId) {
        // Update the master organizations row to reflect an active paid ledger subscription state
        const { error: updateError } = await supabaseAdmin
          .from("organizations")
          .update({
            subscription_tier: chosenTierName,
            billing_framework: "lemonsqueezy"
          })
          .eq("id", targetOrganizationId);

        if (updateError) {
          console.error("Critical webhook metadata database update failed:", updateError.message);
          return new NextResponse("Database synchronization failure event.", { status: 500 });
        }
      }
    }

    return NextResponse.json({ processed: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook runtime processing logic boundary error caught:", err.message);
    return new NextResponse(`Internal handler routing error: ${err.message}`, { status: 500 });
  }
}