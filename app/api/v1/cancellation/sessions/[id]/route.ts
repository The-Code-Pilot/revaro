import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth/api-keys";
import { createAdminServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenant = await validateApiKey(request.headers.get("authorization"));
  if (!tenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: sessionId } = await params;

  try {
    const body = await request.json();
    const { status, outcome, metadata, event_type, event_properties } = body;

    const supabase = createAdminServiceClient();

    // 1. Verify session belongs to authorized tenant
    const { data: existingSession, error: fetchError } = await supabase
      .from("cancellation_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("organization_id", tenant.organizationId)
      .single();

    if (fetchError || !existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Update session state
    const isTerminal = ["completed", "abandoned", "failed"].includes(status);
    const updatePayload: Record<string, unknown> = {
      ...(status && { status }),
      ...(outcome && { outcome }),
      ...(metadata && { metadata }),
      ...(isTerminal && { completed_at: new Date().toISOString() }),
    };

    const { data: updatedSession, error: updateError } = await supabase
      .from("cancellation_sessions")
      .update(updatePayload)
      .eq("id", sessionId)
      .select("id, status, outcome, completed_at")
      .single();

    if (updateError) throw updateError;

    // 3. Persist event log for dashboard metric aggregation
    if (event_type) {
      await supabase.from("events").insert({
        organization_id: tenant.organizationId,
        session_id: sessionId,
        event_type,
        properties: event_properties || {},
      });
    }

    return NextResponse.json({
      session: updatedSession,
      success: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
