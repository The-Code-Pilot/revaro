"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDashboardClient } from "@/lib/supabase/client";

type UserTier = "starter" | "growth" | "enterprise";

type SurveyOption = {
  id: string;
  label: string;
  active: boolean;
  required: boolean;
};

// Explicit structure tracking discrete mitigation actions per survey entry path
type MitigationFlow = {
  action_type: "discount" | "feature_pitch" | "feedback_form";
  offer_value: number;
  duration_window: string;
  pitch_headline: string;
  pitch_text: string;
};

const DEFAULT_OPTIONS: SurveyOption[] = [
  { id: "too_expensive", label: "Too expensive", active: true, required: true },
  { id: "missing_feature", label: "Missing a feature", active: true, required: false },
  { id: "other", label: "Other", active: true, required: true },
  { id: "not_using_enough", label: "Not using it enough", active: false, required: false },
  { id: "switching_competitor", label: "Switching to competitor", active: false, required: false },
];

const INITIAL_MITIGATION_FLOWS: Record<string, MitigationFlow> = {
  too_expensive: { action_type: "discount", offer_value: 20, duration_window: "3 months", pitch_headline: "", pitch_text: "" },
  missing_feature: { action_type: "feature_pitch", offer_value: 0, duration_window: "", pitch_headline: "Need a custom feature?", pitch_text: "Let's build it together. Hop on a direct priority call with our engineering team." },
  other: { action_type: "feedback_form", offer_value: 0, duration_window: "", pitch_headline: "Tell us more", pitch_text: "What could we have done better to support your team?" }
};

const DURATION_OPTIONS = [
  { id: "1_month", label: "1 Month", value: "1 month" },
  { id: "3_months", label: "3 Months", value: "3 months" },
  { id: "6_months", label: "6 Months", value: "6 months" }
];

export default function NewFlowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>("starter");

  const [flowName, setFlowName] = useState("Primary Customer Churn Protection Flow");
  const [activeReasonTab, setActiveReasonTab] = useState<string>("too_expensive");
  const [options, setOptions] = useState<SurveyOption[]>(DEFAULT_OPTIONS);

  // Dedicated multi-flow matrix tracking separate states concurrently
  const [mitigationFlows, setMitigationFlows] = useState<Record<string, MitigationFlow>>(INITIAL_MITIGATION_FLOWS);

  const [discountValue, setDiscountValue] = useState(20);
  const [discountDuration, setDiscountDuration] = useState("3 months");
  const [waitlistPlaceholder, setWaitlistPlaceholder] = useState("Which specific feature do you need to stay?");
  const [pauseMonths, setPauseMonths] = useState(3);
  const [customCompetitors, setCustomCompetitors] = useState("ChurnZero, Chargebee Retention, Baremetrics");

  useEffect(() => {
    async function getWorkspaceDetails() {
      try {
        const supabase = createDashboardClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: membership, error: membershipError } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError || !membership) return;

        const { data: org } = await supabase
          .from("organizations")
          .select("tier")
          .eq("id", membership.organization_id)
          .single();

        const fetchedTier = (org?.tier || "starter") as UserTier;
        setUserTier(fetchedTier);

        if (fetchedTier === "growth" || fetchedTier === "enterprise") {
          setOptions((previous) => previous.map((option) => ({ ...option, active: true })));
          setMitigationFlows(prev => ({
            ...prev,
            not_using_enough: { action_type: "discount", offer_value: 30, duration_window: "1 month", pitch_headline: "", pitch_text: "" },
            switching_competitor: { action_type: "feature_pitch", offer_value: 0, duration_window: "", pitch_headline: "Why swap?", pitch_text: "We will price-match any direct competitor feature layout." }
          }));
        }
      } catch (err) {
        console.error("Failed to resolve workspace operational constraints:", err);
      }
    }
    getWorkspaceDetails();
  }, []);

  const activeOptions = options.filter((option) => option.active);

  // Helper utility to safely update individual nested dictionary flow parameters
  const updateCurrentFlow = (key: keyof MitigationFlow, value: any) => {
    setMitigationFlows(prev => ({
      ...prev,
      [activeReasonTab]: { ...prev[activeReasonTab], [key]: value }
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createDashboardClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session state expired.");

      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!membership) throw new Error("Workspace boundary missing.");

      // Atomic offer creation step for the explicit discount flow parameter path
      const { data: offerData } = await supabase
        .from("offers")
        .insert({
          organization_id: membership.organization_id,
          name: `${flowName.trim()} - Too Expensive Discount`,
          type: "discount",
          value: mitigationFlows.too_expensive.offer_value,
          duration: mitigationFlows.too_expensive.duration_window,
          conditions: { target_reason: "too_expensive" },
          active: true
        })
        .select("id")
        .single();

      // Compile multi-step execution steps dictionary arrays mapping individual choices to separate results
      const triggerConfig = {
        mode: "sdk_intercept",
        survey: {
          headline: "Before you go...",
          subheadline: "Why are you cancelling your subscription?",
          options: activeOptions.map(o => o.id),
          option_labels: activeOptions.map(o => o.label),
          show_attribution_badge: userTier === "starter"
        },
        flows: mitigationFlows, // Secure mapping containing individual target mitigation pathways
        associated_discount_offer_id: offerData?.id
      };

      const { error: flowError } = await supabase
        .from("cancellation_flows")
        .insert({
          organization_id: membership.organization_id,
          name: flowName.trim(),
          status: "active",
          priority: 10,
          trigger_config: triggerConfig
        });

      if (flowError) throw new Error(flowError.message);

      router.push("/dashboard?flow=success");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Friction detected while attempting configuration saves.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <main className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans antialiased p-6 flex flex-col lg:flex-row gap-6">

    {/* LEFT COLUMN: THE PREMIUM RETENTION INPUT WORKSPACE CONTROLLER */}
    <div className="w-full lg:w-7/12 bg-[#0b0f19] border border-[#1e293b]/50 rounded-2xl p-8 flex flex-col justify-between shadow-2xl">
      <div className="space-y-8">

        {/* Header Progress Dashboard Tracking Component */}
        <div className="border-b border-[#1e293b]/60 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Strategy Matrix Studio</p>
          <div className="mt-1 flex items-center justify-between gap-4">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-100">Configure Mitigation Rules</h1>
            <div className="rounded-xl border border-[#1e293b] bg-[#020617] px-3.5 py-1 text-[11px] flex items-center gap-1.5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-slate-400 font-medium">Plan:</span>
              <span className="font-bold text-indigo-400 capitalize">{userTier}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 flex items-center gap-2">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Input Element 1: Flow Descriptive Label */}
          <div className="space-y-2">
            <label htmlFor="flowName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Flow Profile Name</label>
            <input
              id="flowName"
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#1e293b] bg-[#020617]/60 px-4 text-xs text-slate-200 outline-none transition focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/5"
              required
              disabled={loading}
            />
          </div>

          {/* Input Element 2: Reason-Tab Row Controllers (Replaces native select selectors) */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Exit Reason to Edit Flow Rule</label>
            <div className="flex flex-wrap gap-1.5 bg-[#020617] p-1.5 border border-[#1e293b]/60 rounded-xl">
              {activeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveReasonTab(opt.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition ${activeReasonTab === opt.id
                      ? "bg-[#1e293b] text-slate-100 shadow-md border border-[#334155]"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. DYNAMIC VARIABLE STRATEGY SELECTION OVERLAY PANELS */}
          <div className="bg-[#020617]/40 border border-[#1e293b]/40 rounded-2xl p-6 shadow-inner min-h-[180px]">

            {/* TARGET 1: TOO EXPENSIVE -> COUPON SLIDER */}
            {activeReasonTab === "too_expensive" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Target Retention Discount</span>
                  <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">{discountValue}% Off</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="75"
                  step="5"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#020617] rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                />
                <div className="space-y-2 pt-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Discount Window Duration</span>
                  <div className="grid grid-cols-3 gap-2">
                    {DURATION_OPTIONS.map((dur) => (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => setDiscountDuration(dur.value)}
                        className={`h-8 border text-[11px] font-bold rounded-xl capitalize transition ${discountDuration === dur.value
                            ? "bg-slate-100 border-slate-100 text-slate-950"
                            : "bg-[#020617] border-[#1e293b] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TARGET 2: MISSING FEATURE -> AUTOMATED ROADMAP WAITLIST */}
            {activeReasonTab === "missing_feature" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300">Product Roadmap Waitlist Prompt</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">Prompt text to show inside the user feedback collection container block.</p>
                <input
                  type="text"
                  value={waitlistPlaceholder}
                  onChange={(e) => setWaitlistPlaceholder(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#1e293b] bg-[#020617]/80 px-4 text-xs text-slate-200 outline-none transition focus:border-indigo-500/60"
                />
              </div>
            )}

            {/* TARGET 3: NOT USING IT ENOUGH -> SUBSCRIPTION HOLD PAUSE */}
            {activeReasonTab === "not_using_enough" && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-300">Subscription Hold Parameters</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">Freeze recurring billing loops cleanly while preserving workspace data tables.</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 6].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPauseMonths(m)}
                      className={`h-9 border text-[11px] font-bold rounded-xl transition ${pauseMonths === m
                          ? "bg-slate-100 border-slate-100 text-slate-950"
                          : "bg-[#020617] border-[#1e293b] text-slate-400 hover:border-slate-700"
                        }`}
                    >
                      Pause {m} {m === 1 ? 'Month' : 'Months'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TARGET 4: SWITCHING COMPETITOR -> INTEL CAPTURE */}
            {activeReasonTab === "switching_competitor" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300">Competitor Intelligence Tracking Registry</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">Comma-separated alternative targets. Revora transforms these into custom dropdown options.</p>
                <input
                  type="text"
                  value={customCompetitors}
                  onChange={(e) => setCustomCompetitors(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#1e293b] bg-[#020617]/80 px-4 text-xs text-slate-200 outline-none transition focus:border-indigo-500/60"
                />
              </div>
            )}

            {/* TARGET 5: OTHER -> QUALITATIVE CHURN TEXT TEXT AREA */}
            {activeReasonTab === "other" && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Open Narrative Feedback Channel</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">Loads an expanded paragraph entry area inside the client viewport to catalog rich descriptive metrics.</p>
              </div>
            )}

          </div>

          {/* Global Workspace Action Confirmation Controllers */}
          <div className="border-t border-[#1e293b]/60 pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 rounded-xl bg-slate-100 px-5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={loading}
            >
              {loading ? "Processing..." : "Activate Flow"}
            </button>
          </div>

        </form>
      </div>
    </div>

    {/* RIGHT COLUMN: THE HIGH-FIDELITY LIVE INTERACTIVE MULTI-FLOW WIDGET CANVAS */}
    <div className="w-full lg:w-5/12 bg-[#020617] border border-[#1e293b]/40 rounded-2xl p-8 flex flex-col items-center justify-center relative min-h-[480px] shadow-inner select-none">
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
        Live Sandbox Mockup
      </div>

      {/* Central Shadow DOM Emulator Container Card */}
      <div className="w-full max-w-[340px] bg-[#0b0f19] border border-[#1e293b]/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-[360px]">
        <div>
          <div className="flex items-center justify-between border-b border-[#1e293b]/40 pb-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Preview: Step 1 (Survey)</span>
            <span className="w-2 h-2 rounded-full bg-[#1e293b]"></span>
          </div>

          <h3 className="text-sm font-bold text-slate-100 tracking-tight">Before you go...</h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Why are you cancelling your active account?</p>

          {/* Live-Updating Option List Mapping Tracks */}
          <div className="space-y-1.5 mt-4">
            {activeOptions.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-2 border text-[11px] font-medium px-3 py-2 rounded-xl transition ${activeReasonTab === opt.id
                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-200"
                    : "bg-[#020617]/40 border-[#1e293b]/60 text-slate-400"
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeReasonTab === opt.id ? "bg-indigo-400" : "bg-slate-800"}`}></span>
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* DYNAMIC RULE INTERCEPTION VISUAL DISPLAY MAP CANVAS */}
        <div className="mt-5 pt-3 border-t border-[#1e293b]/80 border-dashed bg-[#020617]/30 p-3.5 rounded-xl">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Mitigation Action Node:
          </h4>

          <div className="mt-2 text-[11px] text-slate-300 leading-relaxed font-medium">
            {activeReasonTab === "too_expensive" && (
              <p>Loads Step 2 showing a <span className="font-extrabold text-indigo-300">{discountValue}% discount</span> valid for <span className="font-extrabold text-indigo-300">{discountDuration}</span>.</p>
            )}
            {activeReasonTab === "missing_feature" && (
              <p>Loads dynamic roadmap waitlist with customer text placeholder: <span className="italic text-slate-400">"{waitlistPlaceholder}"</span>.</p>
            )}
            {activeReasonTab === "not_using_enough" && (
              <p>Intercepts cancellation request by offering to pause subscription billing for exactly <span className="font-extrabold text-indigo-300">{pauseMonths} months</span>.</p>
            )}
            {activeReasonTab === "switching_competitor" && (
              <p>Injects choice selection query listing alternatives: <span className="text-slate-400">{customCompetitors}</span>.</p>
            )}
            {activeReasonTab === "other" && (
              <p>Opens a clean qualitative text feedback input layout channel.</p>
            )}
          </div>
        </div>

        {/* ATTRIBUTION FOOTER MATRIX COMPACT WITH GRAPHIC WORDMARK FIXED VECTOR */}
        {userTier === "starter" && (
          <div className="mt-5 flex flex-col items-center justify-center gap-0.5 border-t border-[#1e293b]/40 pt-3">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Powered by</span>
            <div className="flex items-center gap-1 text-[11px] font-black text-slate-400 tracking-tighter">
              <svg className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-slate-200">Revora</span>
            </div>
          </div>
        )}
      </div>
    </div>

  </main>
  );
}