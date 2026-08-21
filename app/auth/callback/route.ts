import { NextResponse } from "next/server";

import { createDashboardClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", requestUrl.origin)
    );
  }

  const supabase = await createDashboardClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback failed:", error);

    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/dashboard", requestUrl.origin)
  );
}
