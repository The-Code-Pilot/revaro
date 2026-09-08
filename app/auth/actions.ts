"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

// FIXED TRAFFIC COP VECTOR: Intercepts email logins to check onboarding completion flags
export async function loginUser(
  currentState: { message: string },
  formData: FormData
) {
  const supabase = await createServerAuthClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Authenticate password credentials directly with Supabase secure core engines
  const { data: authSession, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authSession?.user) {
    return { message: error?.message || "Invalid account credentials entered." };
  }

  const userId = authSession.user.id;

  // 2. CORE SCHEMA v1.1 TRAFFIC CHECK: Inspect workspace memberships directly from the bridge table
  const { data: membershipCheck, error: schemaError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .maybeSingle(); // Yields null cleanly if they haven't run through the setup wizard cards yet

  if (schemaError) {
    console.error("Core Schema login membership check tracer failed:", schemaError);
  }

  // 3. SECURE REDIRECTION Funnel: Separate new versus returning email sessions cleanly
  if (!membershipCheck) {
    /* INCOMPLETE ACQUISITION FUNNEL: Bounces un-onboarded founders straight to the setup wizard */
    redirect("/onboarding");
  }

  /* RETURNING MERCHANTS PATHWAY: Forward directly to dashboard metrics engine screens */
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createServerAuthClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithGithub() {
  const supabase = await createServerAuthClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("GitHub OAuth error:", error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createServerAuthClient();

  await supabase.auth.signOut();

  redirect("/login");
}