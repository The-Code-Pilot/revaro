import React from "react";
import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex text-slate-900 font-sans antialiased overflow-hidden">
      
      {/* PERSISTENT DYNAMIC SIDEBAR NAV DOCK: Handles expanded/collapsed phases natively */}
      <Sidebar />

      {/* ────────────────────────────────────────────────────────────────────────
          MAIN WORKSPACE LAYOUT CONTENT AREA (ZERO TOP-BAR CLUTTER GRID)
          ──────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-slate-50/50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      
    </div>
  );
}