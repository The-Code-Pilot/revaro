"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/brand/Wordmark";
import Lettermark from "@/components/brand/Lettermark";
import { 
  Home,
  Link2, 
  Sliders, 
  BarChart3, 
  Percent, 
  BrainCircuit, 
  HelpCircle, 
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // 6 Primary Application Views Core Mapping Array
  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Stripe Integration", href: "/dashboard/stripe", icon: Link2 },
    { label: "Widget Config", href: "/dashboard/config", icon: Sliders },
    { label: "Organised Graph", href: "/dashboard/graphs", icon: BarChart3 },
    { label: "Recovery Matrix", href: "/dashboard/matrix", icon: Percent },
    { label: "AI Feedback", href: "/dashboard/ai", icon: BrainCircuit }
  ];

  const handleCollapsedClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <aside 
      onClick={handleCollapsedClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // WORLD-CLASS TRACK: Tuned transition timing curve (cubic-bezier) for smooth fluid structural expansion sliding
      className={`border-r border-slate-200/80 bg-white h-screen sticky top-0 hidden md:flex flex-col justify-between p-4 select-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-40 ${
        isExpanded ? "w-64" : "w-20 cursor-pointer hover:bg-slate-50/60"
      }`}
    >
      <div>
        {/* ────────────────────────────────────────────────────────────────────────
            1. TOP BRANDING BRAND PERIMETER HEADER (OPTI-CENTERED ROW)
            ──────────────────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between min-h-[44px] mb-8 select-none px-1 relative">
          <div className="flex items-center transition-all duration-200 overflow-hidden w-full">
            {isExpanded ? (
              // EXPANDED PHASE: Clean, crisp text script wordmark geometry transitions cleanly
              <div className="animate-in fade-in slide-in-from-left-2 duration-300 ease-out pl-1">
                <Wordmark className="h-6 text-slate-900" />
              </div>
            ) : (
              // COLLAPSED PHASE: Lettermark emblem centers itself optically on the crosshair axis lines
              <div className="w-full flex justify-center animate-in fade-in duration-300">
                {isHovered ? (
                  <div className="h-8 w-8 rounded-xl border border-[#0F8F83]/20 bg-[#0f8f83]/5 text-[#0F8F83] flex items-center justify-center transition-all duration-200 transform scale-105 shadow-xs shadow-[#0f8f83]/5">
                    <PanelLeftOpen className="h-4 w-4 stroke-[2.25]" />
                  </div>
                ) : (
                  <div className="transform transition-transform duration-300 hover:scale-102">
                    <Lettermark className="h-8 w-8" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Premium Collapse Trigger Toggle Target Button Element */}
          {isExpanded && (
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation(); // Shield against layout expansion event trigger bubbling bubbles
                setIsExpanded(false);
              }}
              className="h-8 w-8 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.94] ml-2 animate-in fade-in zoom-in-95 duration-200"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4 stroke-[1.75]" />
            </button>
          )}
        </div>

        {/* ────────────────────────────────────────────────────────────────────────
            2. INTERIOR NAVIGATION PANEL NAVIGATION DOCK
            ──────────────────────────────────────────────────────────────────────── */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => !isExpanded && e.stopPropagation()}
                className={`flex items-center rounded-xl text-xs font-bold transition-all duration-200 group relative ${
                  isExpanded ? "px-3 py-2.5 gap-3" : "p-3 justify-center"
                } ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 opacity-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {/* Visual Icon Node Anchor */}
                <IconComponent className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-[#0F8F83] stroke-[2.25]" : "text-slate-400 group-hover:text-slate-600 stroke-[1.75]"
                }`} />
                
                {/* Smooth string character opacity slide fades */}
                {isExpanded && (
                  <span className="animate-in fade-in slide-in-from-left-1 duration-200 tracking-normal font-semibold">
                    {item.label}
                  </span>
                )}
                
                {/* Premium floating glassmorphic tooltip microbox configuration layout */}
                {!isExpanded && (
                  <div className="absolute left-16 bg-slate-950/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-50 border border-white/5">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          3. LOWER ACCOUNT SETTINGS & METRIC PROTECTION CHIPS ZONE
          ──────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1">
          {[
            { label: "Help", href: "/dashboard/help", icon: HelpCircle },
            { label: "Profile", href: "/dashboard/profile", icon: UserCircle }
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => !isExpanded && e.stopPropagation()}
                className={`flex items-center rounded-xl text-xs font-bold transition-all duration-200 group relative ${
                  isExpanded ? "px-3 py-2.5 gap-3" : "p-3 justify-center"
                } ${
                  isActive ? "bg-slate-100 text-[#0F8F83]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <IconComponent className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 transition duration-150 stroke-[1.75]" />
                {isExpanded && <span className="animate-in fade-in slide-in-from-left-1 duration-200 font-semibold">{item.label}</span>}
                
                {!isExpanded && (
                  <div className="absolute left-16 bg-slate-950/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-50 border border-white/5">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* WORLD-CLASS INTERCEPT CHIP: Floating lighting glow effects, zero clutter design semantics */}
        {isExpanded && (
          <div className="p-3.5 bg-gradient-to-b from-slate-50 to-slate-100/30 border border-slate-200/60 rounded-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xs relative overflow-hidden group/card">
            <div className="absolute -right-3 -bottom-3 text-slate-200/30 group-hover/card:text-slate-200/50 transition duration-300 pointer-events-none">
              <Sparkles className="h-12 w-12 stroke-[1]" />
            </div>
            <div className="flex items-center gap-1.5 text-[#0F8F83] font-bold text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3 w-3 fill-[#0f8f83]/10 stroke-[2]" />
              <span>Starter Tier</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
              Unlock native Groq intelligence vectors to diagnose real-time user checkout exit friction loops.
            </p>
            <button 
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="w-full h-8 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl transition duration-150 active:scale-[0.97] cursor-pointer shadow-sm"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}