"use server";

import { createDashboardClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateFlowPayload {
  name: string;
  trigger_config: Record<string, unknown>;
  priority?: number;
}

export async function createCancellationFlow(payload: CreateFlowPayload) {
  const supabase = await createDashboardClient();

  // 1. Resolve current tenant org via helper context
  const { data: member, error: memberErr } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .single();

  if (memberErr || !member) {
    throw new Error("Unauthorized or organization context missing.");
  }

  // 2. Insert into cancellation_flows (Enforces RLS)
  const { data: flow, error: flowErr } = await supabase
    .from("cancellation_flows")
    .insert({
      organization_id: member.organization_id,
      name: payload.name,
      trigger_config: payload.trigger_config,
      priority: payload.priority ?? 0,
      status: "active",
    })
    .select()
    .single();

  if (flowErr) {
    throw new Error(`Failed to save flow: ${flowErr.message}`);
  }

  revalidatePath("/dashboard/flows");
  return { success: true, flow };
}