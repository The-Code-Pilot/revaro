import React from "react";
import { redirect } from "next/navigation";
import { createDashboardClient } from "@/lib/supabase/server";
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  ArrowUpRight,
  Filter
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createDashboardClient();

  // 1. IDENTITY GATEWAY: Resolve who is logged in securely from session cookies
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. TENANT CROSSOVER: Grab the organization this user owns or belongs to
  const { data: membership, error: memberError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (memberError || !membership) {
    // If they have no organization workspace yet, drop them back to the wizard cards
    redirect("/onboarding");
  }

  const orgId = membership.organization_id;

  // 3. LIVE AGGREGATED METRICS: Query the real database logs for this organization
  const { data: liveLogs, error: logError } = await supabase
    .from("cancellation_logs")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (logError) {
    console.error("Database logs compilation failed:", logError.message);
  }

  // 4. METRICS AGGREGATION CALCULATOR ENGINE
  const logs = liveLogs || [];
  const totalAttempts = logs.length;
  
  // Sum up value of logs where outcome is 'retained' or 'offer_accepted' (Saved status)
  const savedSessions = logs.filter(l => l.outcome === "retained" || l.outcome === "offer_accepted");
  const totalSavedMRR = savedSessions.reduce((sum, current) => sum + Number(current.plan_value), 0);
  
  // Calculate exact live percentage performance ratio safely
  const liveDeflectionRate = totalAttempts > 0 
    ? ((savedSessions.length / totalAttempts) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="space-y-6 animate-fade-in w-full">
      
      {/* HEADER CONTROLS BAR CONTAINER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Retention Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track real-time session captures, deflected churn entries, and saved metrics ledger rows.</p>
        </div>
      </div>

      {/* 1. EXECUTIVE SUMMARY CARDS MATRIX (REAL DATA PATHWAYS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* CARD A: LIVE REVENUE MRR RETAINED LEDGER COUNTER */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Retained Value</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">${totalSavedMRR.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400">MRR Retained</span>
          </div>
          <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>${(totalSavedMRR * 12).toLocaleString()} Live Estimated ARR Runway Saved</span>
          </div>
        </div>

        {/* CARD B: REAL-TIME TRAFFIC COUNTER */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Captured Sessions</span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{totalAttempts}</span>
            <span className="text-[10px] font-bold text-slate-400">Total Attempts</span>
          </div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">
            Active Script Embeds checking incoming traffic loops smoothly.
          </div>
        </div>

        {/* CARD C: DYNAMIC DEFLECTION PERFORMANCE ACCURACY PERCENTAGE */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[110px] sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deflection Rate</span>
            <div className="h-7 w-7 rounded-lg bg-[#0f8f83]/10 text-[#0F8F83] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{liveDeflectionRate}%</span>
            <span className="text-[10px] font-bold text-slate-400">Saved Ratio</span>
          </div>
          <div className="text-[10px] font-medium text-[#0F8F83] flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>Calculating live retention ratios across all connected apps.</span>
          </div>
        </div>

      </div>

      {/* 2. DYNAMIC RECOVERY MATRIX LEDGER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">Recovery Matrix Ledger</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Granular chronological audit trail documenting every recent individual account deflection event.</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          {totalAttempts === 0 ? (
            // EMPTY STATE BLUEPRINT: Renders cleanly when a brand new merchant has zero traffic records yet
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No cancellation sessions captured yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once you connect your billing data source and embed our checkout widget snippet, active subscriber metrics will map here automatically.
              </p>
            </div>
          ) : (
            // REAL TABULAR DATA LEDGER
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-3 px-5 font-bold">Customer Email Address</th>
                  <th className="py-3 px-4 font-bold">Plan Value</th>
                  <th className="py-3 px-4 font-bold">Selected Attrition Reason</th>
                  <th className="py-3 px-4 font-bold">Applied Antidote Offer</th>
                  <th className="py-3 px-4 font-bold">Resolution Status</th>
                  <th className="py-3 px-5 text-right font-bold">Timeline Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition duration-100">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{log.customer_email}</td>
                    <td className="py-3.5 px-4 font-semibold">${Number(log.plan_value).toFixed(2)}/mo</td>
                    <td className="py-3.5 px-4 text-slate-500">{log.attrition_reason}</td>
                    <td className="py-3.5 px-4 text-slate-700">{log.applied_antidote}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        log.outcome === "retained" || log.outcome === "offer_accepted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : log.outcome === "cancelled"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {log.outcome === "retained" || log.outcome === "offer_accepted" ? "🟢 Saved" : log.outcome === "cancelled" ? "🔴 Cancelled" : "🟡 Paused"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-400 text-[10px] font-normal">
                      {new Date(log.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}