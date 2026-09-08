import { NextResponse } from "next/server";
import { createDashboardClient } from "@/lib/supabase/server";

// CRITICAL EXTENSION EXPORT: Must be exactly uppercase GET to resolve Next.js 405 Router blockades
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", requestUrl.origin)
    );
  }

  const supabase = await createDashboardClient();
  
  // Exchange temporary crypto code parameter securely for active Postgres JWT session cookies
  const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !sessionData?.user) {
    console.error("OAuth token code session handshake failed:", exchangeError);
    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", requestUrl.origin)
    );
  }

  const userId = sessionData.user.id;

  // Scan our fresh Core Schema v1.1 table to see if an organization row link exists for this user
  const { data: membershipCheck, error: schemaError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .maybeSingle(); // Prevents PGRST116 exceptions on un-onboarded profile lookups

  if (schemaError) {
    console.error("Core Schema database traffic lookups failed:", schemaError);
  }

  // Funnel routing loops based on validation checks
  if (!membershipCheck) {
    /* NEW USER PATHWAY: Forward straight into the interactive onboarding form wizard layout */
    return NextResponse.redirect(
      new URL("/onboarding", requestUrl.origin)
    );
  }

  /* RETURNING USER PATHWAY: Bypass setup cards entirely and land right inside the system dashboard */
  return NextResponse.redirect(
    new URL("/dashboard", requestUrl.origin)
  );
}