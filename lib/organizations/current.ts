import "server-only";

import { createDashboardClient } from "@/lib/supabase/server";

export async function getCurrentOrganization() {
  const supabase = await createDashboardClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("CURRENT USER:", user?.id ?? null);
  console.log("USER ERROR:", userError);

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase.rpc(
    "get_current_organization"
  );

  console.log("ORGANIZATION RPC DATA:", data);
  console.log("ORGANIZATION RPC ERROR:", error);

  if (error || !data || data.length === 0) {
    return null;
  }

  const current = data[0];

  return {
    organization: {
      id: current.organization_id,
      name: current.organization_name,
      slug: current.organization_slug,
    },
    role: current.member_role,
  };
}
