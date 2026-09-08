"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Wordmark from "@/components/brand/Wordmark";
import { 
  Sparkles, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle 
} from "lucide-react";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. EXTRACT PARAMS: Read the tier parameter value dynamically from the URL bar string (?tier=starter or ?tier=pro)
  const tierParam = searchParams.get("tier") || "starter";
  const isPro = tierParam.toLowerCase() === "pro";
  
  const selectedTier = isPro ? "Pro" : "Starter";
  const planPrice = isPro ? "$499" : "$99";

  // 2. SANDBOX URL MATRIX: Replace these strings down the road with your live Lemon Squeezy custom store variables
  const lemonSqueezyUrls = {
    starter: "https://lemonsqueezy.com",
    pro: "https://lemonsqueezy.com"
  };

  const targetCheckoutUrl = isPro ? lemonSqueezyUrls.pro : lemonSqueezyUrls.starter;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-12 relative font-sans antialiased text-slate-900">
      {/* Decorative Grid Mesh Subtle Background Graphic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f8f8303_1px,transparent_1px),linear-gradient(to_bottom,#0f8f8303_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200/80 shadow-xl p-8 rounded-2xl relative z-10 space-y-6">
        
        {/* Brand Architecture Identification Token */}
        <div className="flex justify-center select-none">
          <Wordmark className="h-6 text-slate-900" />
        </div>

        {/* SUMMARY HEADER BLOCK */}
        <div className="text-center space-y-1.5 pt-2">
          <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
            Activate Subscription
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
            Complete your onboarding configuration parameters by triggering your Lemon Squeezy checkout link nodes.
          </p>
        </div>

        {/* INVOICE SUMMARY PANEL STRIP */}
        <div className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-xl space-y-3.5 select-none">
          <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-2.5">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">Revora {selectedTier} License</span>
              <span className="text-[10px] text-slate-400 font-medium">Monthly recurring billing framework</span>
            </div>
            <span className="font-black text-slate-900 text-sm">{planPrice}<span className="text-[10px] font-bold text-slate-400">/mo</span></span>
          </div>

          {/* Core Feature Bullet Checkpoints */}
          <div className="space-y-2 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0F8F83] shrink-0" />
              <span>{isPro ? "10,000 cancellation sessions /mo" : "1,000 cancellation sessions /mo"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0F8F83] shrink-0" />
              <span>{isPro ? "100% White-label custom styles widget" : "Standard branded embed script block"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0F8F83] shrink-0" />
              <span>Zero-friction tax & invoice handling via Lemon Squeezy MoR</span>
            </div>
          </div>
        </div>

        {/* PRIMARY CALL-TO-ACTION BUTTON ROUTE ACTION */}
        <div className="space-y-3 pt-2">
          <a
            href={targetCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all duration-150 outline-none flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
          >
            <Wallet className="h-4 w-4 text-teal-400 stroke-[2]" />
            <span>Proceed to Lemon Squeezy Checkout</span>
          </a>

          {/* SIMULATED BYPASS FOR LOCAL DEVELOPMENT RUNS */}
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full h-11 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-xl font-bold text-xs transition-all duration-150 outline-none flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <span>Bypass Payment (Local Staging Test)</span>
            <ArrowRight className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Secure Provider Footer Notice Tag */}
        <p className="text-[10px] font-medium text-slate-400 text-center flex items-center justify-center gap-1 opacity-75">
          <HelpCircle className="h-3 w-3" />
          <span>Secured by Lemon Squeezy. Cancel or change plans anytime.</span>
        </p>

      </div>
    </main>
  );
}