"use client";

import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { createDashboardClient } from "@/lib/supabase/client";

export default function ProviderSigninBlock() {
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "github" | null
  >(null);

  async function signInWithProvider(provider: "google" | "github") {
    setPendingProvider(provider);

    const supabase = createDashboardClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(`${provider} OAuth error:`, error);
      setPendingProvider(null);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        type="button"
        /* FIXED TRACK: Injected explicit light-mode hover tints, subtle boundary highlights, and touch micro-actions */
        className="h-11 gap-2 border border-border/80 bg-background text-foreground font-semibold text-xs rounded-xl shadow-none transition-all duration-200 hover:bg-muted hover:border-slate-300 active:scale-[0.98] disabled:opacity-40"
        disabled={pendingProvider !== null}
        onClick={() => signInWithProvider("google")}
      >
        <FaGoogle className="size-4 text-slate-500" />
        <span>
          {pendingProvider === "google" ? "Connecting..." : "Google"}
        </span>
      </Button>

      <Button
        variant="outline"
        type="button"
        /* FIXED TRACK: Injected explicit light-mode hover tints, subtle boundary highlights, and touch micro-actions */
        className="h-11 gap-2 border border-border/80 bg-background text-foreground font-semibold text-xs rounded-xl shadow-none transition-all duration-200 hover:bg-muted hover:border-slate-300 active:scale-[0.98] disabled:opacity-40"
        disabled={pendingProvider !== null}
        onClick={() => signInWithProvider("github")}
      >
        <FaGithub className="size-4 text-slate-700" />
        <span>
          {pendingProvider === "github" ? "Connecting..." : "GitHub"}
        </span>
      </Button>
    </div>
  );
}