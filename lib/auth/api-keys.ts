import { createHash } from "crypto";

import { createAdminServiceClient } from "@/lib/supabase/server";

export type AuthenticatedTenant = {
  organizationId: string;
  environment: string;
};

const DEV_TEST_API_KEY = "rev_test_12345";
const DEV_FALLBACK_ORG_ID = "00000000-0000-0000-0000-000000000001";

async function getDevBypassTenant(): Promise<AuthenticatedTenant> {
  try {
    const supabase = createAdminServiceClient();
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (orgError) {
      console.error("[API Key Debug] Dev bypass org lookup error:", orgError);
    }

    const organizationId = org?.id ?? DEV_FALLBACK_ORG_ID;
    console.log("[API Key Debug] Dev bypass tenant:", {
      organizationId,
      environment: "test",
    });

    return {
      organizationId,
      environment: "test",
    };
  } catch (err) {
    console.error(
      "[API Key Debug] Dev bypass failed, falling back to default org UUID:",
      err
    );
    return {
      organizationId: DEV_FALLBACK_ORG_ID,
      environment: "test",
    };
  }
}

export async function validateApiKey(
  authHeader: string | null
): Promise<AuthenticatedTenant | null> {
  console.log("[API Key Debug] Incoming authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[API Key Debug] Missing or invalid Authorization header");
    return null;
  }

  const rawKey = authHeader.replace("Bearer ", "").trim();
  if (!rawKey) {
    console.log("[API Key Debug] Empty API key after Bearer prefix");
    return null;
  }

  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  console.log("[API Key Debug] Computed SHA-256 hash:", keyHash);

  if (process.env.NODE_ENV === "development" && rawKey === DEV_TEST_API_KEY) {
    console.log("[API Key Debug] Development bypass active for rev_test_12345");
    return getDevBypassTenant();
  }

  const supabase = createAdminServiceClient();
  const { data: keyRecord, error } = await supabase
    .from("api_keys")
    .select("organization_id, environment, revoked_at")
    .eq("key_hash", keyHash)
    .single();

  if (error) {
    console.error("[API Key Debug] Supabase api_keys query error:", error);
    return null;
  }

  if (!keyRecord || keyRecord.revoked_at !== null) {
    console.log("[API Key Debug] Key record missing or revoked");
    return null;
  }

  return {
    organizationId: keyRecord.organization_id,
    environment: keyRecord.environment,
  };
}
