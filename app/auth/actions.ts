"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

export async function loginUser(
  currentState: { message: string },
  formData: FormData
) {
  const supabase = await createServerAuthClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

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