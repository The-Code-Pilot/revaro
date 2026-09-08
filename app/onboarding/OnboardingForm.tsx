"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface FormProps {
  serverAction: (formData: FormData) => Promise<void>;
}

export default function OnboardingFormClient({ serverAction }: FormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [buttonAlert, setButtonAlert] = useState<"lemon" | "paddle" | null>(null);
  const [showEnterpriseNotice, setShowEnterpriseNotice] = useState(false);

  // Core Data Collector Fields State Tree
  const [fullName, setFullName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [billingProvider, setBillingProvider] = useState("stripe");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro">("pro");

  // Step Validation Metrics
  const isStep1Valid = fullName.trim().length >= 2 && userRole !== "";
  const isStep2Valid = companyName.trim().length >= 2 && companyDomain.trim().length >= 3;

  // KEYBOARD MATRIX COGNITIVE NAVIGATION CONTROLLER
  const handleKeyDownNavigation = (e: React.KeyboardEvent<HTMLDivElement>, currentCard: number) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Defends against early multi-tenant HTML form submissions
      
      const target = e.target as HTMLElement;
      
      if (currentCard === 1) {
        if (target.id === "fullName") {
          // If role isn't picked yet, blur input to visually highlight the option matrix buttons
          target.blur();
        } else if (!target.closest("input") && isStep1Valid) {
          // If cursor is clear of input fields and data is valid, bounce to Step 2
          setCurrentStep(2);
        }
      } 
      
      else if (currentCard === 2) {
        if (target.id === "name") {
          // Step 2 Rule 1: Jump directly to the domain prefix box if Company Name is entered
          const nextInput = document.getElementById("slug") as HTMLInputElement | null;
          if (nextInput) nextInput.focus();
        } else if (target.id === "slug") {
          // Step 2 Rule 2: Blur out input box to shift user focus to billing providers block
          target.blur();
        } else if (!target.closest("input") && isStep2Valid && billingProvider === "stripe") {
          // Step 2 Rule 3: Advance card to Slide 3 if final validations check out smoothly
          setCurrentStep(3);
        }
      }
    }
  };

  const handleProviderToggle = (id: string) => {
    if (id !== "stripe") {
      setButtonAlert(id as "lemon" | "paddle");
      setBillingProvider("stripe");
      setTimeout(() => {
        setButtonAlert(null);
      }, 3500);
    } else {
      setBillingProvider("stripe");
      setButtonAlert(null);
    }
  };

  return (
    <div id="revora-onboarding-container">
      {/* LOCAL STYLING INJECTOR MATRIX: Guarantees immutable text colors on role button hovers */}
      <style dangerouslySetInnerHTML={{ __html: `
        #revora-onboarding-container button.r-role-btn-active:hover,
        #revora-onboarding-container button.r-role-btn-active:focus,
        #revora-onboarding-container button.r-role-btn-active:active,
        #revora-onboarding-container button.r-role-btn-active {
          background-color: #0F172A !important;
          color: #ffffff !important;
          border-color: #0F172A !important;
          opacity: 1 !important;
        }
        #revora-onboarding-container button.r-role-btn-inactive:hover {
          background-color: #F1F5F9 !important;
          color: #0F172A !important;
          border-color: #CBD5E1 !important;
        }
        #revora-onboarding-container button.r-submit-btn-active:hover {
          background-color: #0c776e !important;
          color: #ffffff !important;
        }
      `}} />

      <form action={serverAction} className="space-y-6">
        <input type="hidden" name="role" value={userRole} />
        <input type="hidden" name="billing_provider" value={billingProvider} />
        <input type="hidden" name="tier" value={selectedPlan} />

        {/* STEP DOTS PROGRESS HEADER MATRIX */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Step {currentStep} of 3</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((s: number) => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${s === currentStep ? "w-6 bg-primary" : "w-1.5 bg-slate-200"}`} />
            ))}
          </div>
        </div>

        {/* STEP 1 SLIDE CONTAINER: CHURN PROFILE MATRICES WITH ACCELERATORS */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in" onKeyDown={(e) => handleKeyDownNavigation(e, 1)}>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Tell us about yourself</h1>
              <p className="text-sm text-muted-foreground mt-1">Let's coordinate who is customizing this churn-mitigation deck.</p>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="fullName" className="block pb-0.05 text-sm font-medium text-foreground">Your Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="Alex Rivers" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="h-11" 
                required 
              />
            </div>

            <div className="space-y-3">
              <Label className="block pb-2.5 text-sm font-medium text-foreground">
                Your Operational Role
              </Label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Founder / CEO", "Product Manager", "Growth Marketer", "Customer Success", "Engineer", "Other"].map((role) => {
                  const isActive = userRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserRole(role)}
                      className={`h-11 px-3 font-bold text-xs rounded-xl border transition-all duration-150 cursor-pointer outline-none active:scale-[0.98] ${
                        isActive ? "r-role-btn-active bg-[#0F172A] text-white border-[#0F172A]" : "r-role-btn-inactive bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => setCurrentStep(2)}
              className={`w-full h-11 rounded-xl font-bold text-xs transition-all duration-200 outline-none mt-4 active:scale-[0.98] border ${
                isStep1Valid
                  ? "r-submit-btn-active bg-[#0F8F83] text-white border-[#0F8F83] cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200/40 cursor-not-allowed"
              }`}
            >
              Continue Setup
            </button>
          </div>
        )}

        {/* STEP 2 SLIDE CONTAINER: PLATFORM CONNECTION LAYOUT WITH JUMP FOCUSES */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in" onKeyDown={(e) => handleKeyDownNavigation(e, 2)}>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Connect your platform</h1>
              <p className="text-sm text-muted-foreground mt-1">Authorize your environment so our cancel widget triggers securely.</p>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="name" className="block pb-0.05 text-sm font-medium text-foreground">Company Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Acme Analytics" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                className="h-11" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug" className="block pb-0.05 text-sm font-medium text-foreground">SaaS Application or Website URL</Label>
              <div className="flex h-11 items-center rounded-lg border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                <span className="pl-3 text-sm text-muted-foreground select-none opacity-50">https://</span>
                <Input 
                  id="slug" 
                  name="slug" 
                  type="text"
                  placeholder="yourcompany.com" 
                  value={companyDomain} 
                  onChange={(e) => setCompanyDomain(e.target.value)} 
                  className="h-full border-0 focus-visible:ring-0 shadow-none px-1 text-sm placeholder:text-slate-300" 
                  required 
                />
              </div>
              <p className="text-[11px] text-muted-foreground/80 mt-1 leading-normal">
                The domain where your software is hosted. This acts as your allowed origins firewall for our script embed.
              </p>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label className="block pb-2.5 text-sm font-medium text-foreground">
                Active Billing Provider
              </Label>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "stripe", name: "Stripe", sub: "Live Sync" },
                  { id: "lemon", name: "Lemon Squeezy", sub: "Beta Queue" },
                  { id: "paddle", name: "Paddle", sub: "Beta Queue" }
                ].map((p) => {
                  const isActive = billingProvider === p.id && buttonAlert === null;
                  const isAlerting = buttonAlert === p.id;
                  
                  return (
                    <button 
                      key={p.id} 
                      type="button" 
                      onClick={() => handleProviderToggle(p.id)} 
                      className={`h-12 flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-150 cursor-pointer outline-none active:scale-[0.98] ${
                        isActive 
                          ? "r-role-btn-active bg-[#0F172A] text-white border-[#0F172A]" 
                          : isAlerting
                            ? "border-orange-500 text-orange-700 bg-orange-50"
                            : "r-role-btn-inactive bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      {isAlerting ? (
                        <span className="text-[9px] font-bold text-center px-1.5 leading-tight text-orange-700 animate-fade-in">
                          {p.id === "lemon" 
                            ? "Stripe only for now. Lemon Squeezy coming soon!" 
                            : "Stripe only for now. Paddle coming soon!"
                          }
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-bold">{p.name}</span>
                          <span className="text-[9px] font-medium opacity-60 mt-0.5">{p.sub}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(1)} 
                className="col-span-1 h-11 rounded-xl shadow-none font-bold"
              >
                Back
              </Button>
              <button 
                type="button" 
                disabled={!isStep2Valid || billingProvider !== "stripe"} 
                onClick={() => setCurrentStep(3)} 
                className={`col-span-3 h-11 rounded-xl font-bold text-xs transition-all duration-200 outline-none border ${
                  (isStep2Valid && billingProvider === "stripe")
                    ? "r-submit-btn-active bg-[#0F8F83] text-white border-[#0F8F83] cursor-pointer"
                    : "bg-slate-100 text-slate-400 border border-slate-200/40 cursor-not-allowed"
                }`}
              >
                Continue to Plans
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 SLIDE CONTAINER: HIGH-PERCEIVED-VALUE PRICING MATRIX */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in w-full">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Select your protection tier</h1>
              <p className="text-sm text-muted-foreground mt-1">Deploy your cancellation defense layer and start protecting your subscription revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-stretch">
              
              {/* CARD 1: STARTER PLAN - AFFORDABLE VALUE FOUNDATION */}
              <div 
                onClick={() => {
                  setSelectedPlan("starter");
                  setShowEnterpriseNotice(false);
                }} 
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-full relative ${
                  selectedPlan === "starter" && !showEnterpriseNotice
                    ? "border-[#0F8F83] bg-[#0f8f83]/5 shadow-sm ring-1 ring-[#0F8F83]/10" 
                    : "border-slate-200 bg-white hover:border-slate-300 opacity-75"
                }`}
              >
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div className="flex justify-between items-start min-h-[56px] w-full">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Starter Plan</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Essential Revenue Recovery</p>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-foreground font-black text-sm block whitespace-nowrap">$99</span>
                      <span className="text-[9px] font-medium opacity-60 block mt-0.5">/mo</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-[11px] font-medium text-slate-600 flex-grow">
                    <div>✓ 1,000 cancellation sessions/mo</div>
                    <div>✓ 1 active cancellation flow</div>
                    <div>✓ Standard offers: Pause, Discount</div>
                    <div>✓ Standard email support</div>
                    <div className="text-slate-400 font-normal text-[10px] italic border-t border-slate-50/50 pt-2 mt-2">
                      * Includes discreet "Powered by Revora" watermark
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: PRO PLAN - MASSIVE 5X+ PERCEIVED VALUE HUB */}
              <div 
                onClick={() => {
                  setSelectedPlan("pro");
                  setShowEnterpriseNotice(false);
                }} 
                className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-full relative ${
                  selectedPlan === "pro" && !showEnterpriseNotice
                    ? "border-[#0F8F83] bg-[#0f8f83]/5 shadow-md ring-2 ring-[#0F8F83]/20 z-10 md:scale-[1.02]" 
                    : "border-slate-200 bg-white hover:border-slate-300 opacity-90"
                }`}
              >
                <div className="absolute -top-2.5 right-4 bg-[#0F172A] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest shadow-sm">
                  Most Popular
                </div>
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div className="flex justify-between items-start min-h-[56px] w-full">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Pro Plan</h3>
                      <p className="text-[10px] text-[#0F8F83] font-bold mt-0.5">Automated Retention Engine</p>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-[#0F8F83] font-black text-sm block whitespace-nowrap">$499</span>
                      <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">/mo</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-[11px] font-medium text-slate-600 flex-grow">
                    <div className="font-bold text-foreground">✓ 10,000 cancellation sessions/mo</div>
                    <div>✓ Unlimited flows + A/B testing</div>
                    <div className="text-[#0F8F83] font-bold">✓ 100% White-label experience (No badge)</div>
                    <div>✓ Advanced offers, surveys, & webhooks</div>
                    <div className="space-y-1 pt-2 border-t border-slate-50/50 mt-2">
                      <div className="flex items-center gap-1.5 text-[#0F8F83] font-bold">
                        <Sparkles className="h-3.5 w-3.5 text-[#0F8F83] fill-[#0f8f83]/10" />
                        <span>Revora Intelligence platform</span>
                      </div>
                      <div className="pl-5 text-[10px] leading-tight text-slate-400 font-normal">
                        AI-powered analysis of your cancellation data reveals why customers leave and what you can do about it.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: ENTERPRISE PLAN - THE ASPIRATIONAL ROADMAP CEILING */}
              <div 
                onClick={() => setShowEnterpriseNotice(true)} 
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-full relative ${
                  showEnterpriseNotice
                    ? "border-amber-500 bg-amber-50/10 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 opacity-65 hover:opacity-90"
                }`}
              >
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div className="flex justify-between items-start min-h-[56px] w-full">
                    <div>
                      <h3 className="text-sm font-bold text-slate-400">Enterprise</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Scale Operations</p>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-slate-400 font-black text-sm block whitespace-nowrap">$1,999</span>
                      <span className="text-[9px] font-medium opacity-50 block mt-0.5">/mo</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-[11px] font-medium text-slate-400 leading-relaxed flex-grow">
                    <div>• Unlimited cancellation sessions/mo</div>
                    <div>• Fully Custom CSS & Layout Overrides</div>
                    <div>• Connect Your Own AI API Keys (BYO-AI)</div>
                    <div>• Planned custom data pipeline routings</div>
                    <div>• Upcoming SOC2 & PII masking frameworks</div>
                    <div>• Future SAML SSO & team audit logs</div>
                    <div>• Dedicated node server infrastructure</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC ROADMAP INTERCEPT EXPLICIT BANNER */}
            {showEnterpriseNotice && (
              <div className="p-4 rounded-xl border border-border/80 bg-muted/30 text-foreground animate-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <div className="text-xs leading-relaxed max-w-2xl">
                  <span className="font-bold text-foreground block mb-0.5">Enterprise is currently under development</span>
                  We are building advanced infrastructure layers for large-scale subscription companies. <span className="text-[#0F8F83] font-black">Pro</span> remains our most comprehensive tier active for deployment today.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan("pro");
                    setShowEnterpriseNotice(false);
                  }}
                  className="h-10 px-5 font-bold text-xs rounded-xl border-0 transition duration-150 active:scale-[0.98] whitespace-nowrap self-end sm:self-center cursor-pointer shadow-sm shadow-[#0F8F83]/10 r-submit-btn-active bg-[#0F8F83] text-white"
                >
                  Continue with Pro
                </button>
              </div>
            )}

            {/* NATIVE FORM BRIDGE: Securely exposes React fields to Next.js Server Action closures */}
            <input type="hidden" name="role" value={userRole} />
            <input type="hidden" name="name" value={companyName} />
            <input type="hidden" name="slug" value={companyDomain} />
            <input type="hidden" name="billing_provider" value={billingProvider} />
            <input type="hidden" name="tier" value={selectedPlan} />

            <div className="grid grid-cols-4 gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(2)} 
                className="col-span-1 h-11 rounded-xl shadow-none font-bold"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={showEnterpriseNotice}
                className="col-span-3 h-11 rounded-xl transition-all duration-200 active:scale-[0.98] font-bold r-submit-btn-active bg-[#0F8F83] text-white border-[#0F8F83] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* DARK PATTERN DEFENSE: Button dynamically renders active tier selection choice explicitly */}
                Complete Setup & Pay for {selectedPlan === "starter" ? "Starter" : "Pro"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}