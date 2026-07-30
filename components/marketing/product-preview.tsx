"use client";

import { useState, useCallback, useMemo, memo } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  ListTodo,
  MessageSquare,
  Pause,
  Percent,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Zap,
  BarChart3,
  ChevronRight,
  RotateCcw,
  Tag,
  CalendarDays,
  MousePointerClick,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { cn } from "@/lib/utils";

type DemoStep = "idle" | "reason" | "offer" | "saved" | "declined";

type CancelReason = (typeof CANCEL_REASONS)[number];

interface JourneyConfig {
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  headline: string;
  subheadline: string;
  primaryAction: string;
  secondaryAction: string;
  savedMessage: string;
  savedDetail: string;
  declinedMessage: string;
  declinedDetail: string;
  offerVisual: React.ReactNode;
}

const CANCEL_REASONS = [
  "Too expensive",
  "Missing feature",
  "Not using it enough",
  "Switching to another product",
  "Other",
] as const;

const JOURNEYS: Record<CancelReason, JourneyConfig> = {
  "Too expensive": {
    icon: Tag,
    badge: "Discount applied",
    badgeColor: "bg-emerald-500/15 text-emerald-700",
    headline: "25% off your next 3 months",
    subheadline: "You've been with us 8 months. This is our best offer — no strings attached.",
    primaryAction: "Apply discount & keep plan",
    secondaryAction: "Cancel anyway",
    savedMessage: "Offer accepted",
    savedDetail: "$89/mo retained. Discount auto-applied to next billing cycle.",
    declinedMessage: "No problem",
    declinedDetail: "They can still leave. No forced retention, no dark patterns.",
    offerVisual: (
      <div className="mb-5 rounded-lg border border-emerald-300/60 bg-emerald-50/80 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-950">Pro plan</span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">-25%</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold text-emerald-950">$66.75</span>
          <span className="text-sm font-medium text-emerald-700/80 line-through">$89.00</span>
          <span className="text-xs font-medium text-emerald-700/70">/mo</span>
        </div>
        <p className="mt-1.5 text-xs font-medium text-emerald-800/80">For 3 months, then $89/mo</p>
      </div>
    ),
  },
  "Missing feature": {
    icon: ListTodo,
    badge: "Early access",
    badgeColor: "bg-blue-500/15 text-blue-700",
    headline: "That feature ships next month",
    subheadline: "Join the waitlist and get it two weeks before everyone else. Plus direct access to the product team.",
    primaryAction: "Join waitlist & keep access",
    secondaryAction: "Cancel anyway",
    savedMessage: "Waitlist joined",
    savedDetail: "They'll get early access when the feature ships. No follow-up needed.",
    declinedMessage: "Fair enough",
    declinedDetail: "They'll share which features they need most. Your product team sees it instantly.",
    offerVisual: (
      <div className="mb-5 rounded-lg border border-blue-300/60 bg-blue-50/80 p-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-blue-700" />
          <span className="text-sm font-bold text-blue-950">Feature waitlist</span>
        </div>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-blue-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-blue-900/90">Early access 2 weeks before public</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-blue-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-blue-900/90">Direct line to product team</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-blue-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-blue-900/90">Ships estimated March 2025</span>
          </div>
        </div>
      </div>
    ),
  },
  "Not using it enough": {
    icon: Pause,
    badge: "Flexible option",
    badgeColor: "bg-amber-500/15 text-amber-800",
    headline: "Pause for 30 days, no charge",
    subheadline: "Your data stays exactly as you left it. Resume anytime with one click.",
    primaryAction: "Pause subscription",
    secondaryAction: "Cancel permanently",
    savedMessage: "Subscription paused",
    savedDetail: "Account frozen with full data retention. Easy reactivation when ready.",
    declinedMessage: "Understood",
    declinedDetail: "They'll complete a brief exit survey so you can learn and improve.",
    offerVisual: (
      <div className="mb-5 rounded-lg border border-amber-300/60 bg-amber-50/80 p-4">
        <div className="flex items-center gap-2">
          <Pause className="size-4 text-amber-700" />
          <span className="text-sm font-bold text-amber-950">30-day pause</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-md bg-white/80 p-2.5 border border-amber-200/50">
            <p className="text-xs font-bold text-amber-950/80">No charge</p>
            <p className="mt-0.5 text-xs font-semibold text-amber-800/70">$0 for 30 days</p>
          </div>
          <div className="rounded-md bg-white/80 p-2.5 border border-amber-200/50">
            <p className="text-xs font-bold text-amber-950/80">Data kept</p>
            <p className="mt-0.5 text-xs font-semibold text-amber-800/70">Everything saved</p>
          </div>
        </div>
      </div>
    ),
  },
  "Switching to another product": {
    icon: Phone,
    badge: "Quick call",
    badgeColor: "bg-violet-500/15 text-violet-700",
    headline: "See how we compare in 10 minutes",
    subheadline: "Schedule a quick call. We'll walk through the features that matter to your team — no sales pressure.",
    primaryAction: "Book comparison call",
    secondaryAction: "I'm set on switching",
    savedMessage: "Call scheduled",
    savedDetail: "Calendar invite sent. Sometimes a conversation is all it takes.",
    declinedMessage: "No pressure",
    declinedDetail: "They'll share which product they're moving to so your team can follow up.",
    offerVisual: (
      <div className="mb-5 rounded-lg border border-violet-300/60 bg-violet-50/80 p-4">
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-violet-700" />
          <span className="text-sm font-bold text-violet-950">10-minute comparison</span>
        </div>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-violet-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-violet-900/90">Feature-by-feature comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-violet-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-violet-900/90">Migration assistance if you switch</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-violet-600" strokeWidth={2.5} />
            <span className="text-xs font-semibold text-violet-900/90">No sales pressure, just facts</span>
          </div>
        </div>
      </div>
    ),
  },
  Other: {
    icon: MessageSquare,
    badge: "We hear you",
    badgeColor: "bg-slate-500/15 text-slate-700",
    headline: "Two minutes. Your honest take.",
    subheadline: "No required fields. Your feedback goes straight to the product team.",
    primaryAction: "Share feedback & stay",
    secondaryAction: "Cancel without feedback",
    savedMessage: "Feedback captured",
    savedDetail: "Their input is logged and routed to the product team automatically.",
    declinedMessage: "That's okay",
    declinedDetail: "They can still leave quickly. No friction, no guilt.",
    offerVisual: (
      <div className="mb-5 rounded-lg border border-slate-300/60 bg-slate-50/80 p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-slate-700" />
          <span className="text-sm font-bold text-slate-950">Quick feedback</span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-2.5 w-full rounded-full bg-slate-200/80" />
          <div className="h-2.5 w-4/5 rounded-full bg-slate-200/80" />
          <div className="h-2.5 w-3/5 rounded-full bg-slate-200/80" />
        </div>
        <p className="mt-2.5 text-xs font-semibold text-slate-700/80">Optional. Skip any question.</p>
      </div>
    ),
  },
};

interface DemoResult {
  reason: CancelReason;
  outcome: "saved" | "declined";
}

const MemoizedRescueDemo = memo(function RescueDemo({
  onComplete,
}: {
  onComplete?: (result: DemoResult) => void;
}) {
  const [step, setStep] = useState<DemoStep>("idle");
  const [reason, setReason] = useState<CancelReason>(CANCEL_REASONS[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const journey = useMemo(() => JOURNEYS[reason], [reason]);
  const JourneyIcon = journey.icon;

  const transitionTo = useCallback((nextStep: DemoStep) => {
    setIsAnimating(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setStep(nextStep);
        setIsAnimating(false);
      }, 120);
    });
  }, []);

  const handleContinue = useCallback(() => transitionTo("offer"), [transitionTo]);

  const handleSave = useCallback(() => {
    transitionTo("saved");
    onComplete?.({ reason, outcome: "saved" });
  }, [transitionTo, onComplete, reason]);

  const handleDecline = useCallback(() => {
    transitionTo("declined");
    onComplete?.({ reason, outcome: "declined" });
  }, [transitionTo, onComplete, reason]);

  const handleReplay = useCallback(() => {
    setStep("idle");
    setReason(CANCEL_REASONS[0]);
  }, []);

  const handleReasonSelect = useCallback((r: CancelReason) => {
    setReason(r);
  }, []);

  const stepIndex = useMemo(() => {
    const steps: DemoStep[] = ["idle", "reason", "offer", "saved", "declined"];
    return steps.indexOf(step);
  }, [step]);

  return (
    <div className="relative rounded-xl border border-border bg-surface/60 p-1.5 shadow-lg shadow-black/10 backdrop-blur-sm">
      <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-accent/15">
              <Zap className="size-3.5 text-accent" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-foreground">
              Subscription
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground/70">
            acmeanalytics.com
          </span>
        </div>

        {/* Content */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "flex min-h-[320px] items-center justify-center p-6 transition-opacity duration-150 ease-out sm:min-h-[300px] sm:p-8",
            isAnimating ? "opacity-0" : "opacity-100"
          )}
        >
          {step === "idle" && (
            <div className="w-full max-w-xs text-center">
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-surface-2">
                <BarChart3 className="size-7 text-muted-foreground/70" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-muted-foreground/80">Pro plan</p>
              <p className="mt-1.5 font-mono text-4xl font-bold tracking-tight text-foreground">
                $89
                <span className="text-lg font-normal text-muted-foreground/60">
                  /mo
                </span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/50 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                Active since Nov 2024
              </div>
              <button
                type="button"
                onClick={() => transitionTo("reason")}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                Cancel subscription
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {step === "reason" && (
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                  Why are you leaving?
                </span>
                <span className="hidden shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent sm:block">
                  5 flows
                </span>
              </div>
              <p className="mt-3 text-lg font-bold leading-snug text-foreground">
                What&apos;s the main reason?
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-muted-foreground/75">
                Each answer triggers a different retention flow.
              </p>
              <fieldset className="mt-6 space-y-2.5">
                <legend className="sr-only">Cancellation reason</legend>
                {CANCEL_REASONS.map((r) => (
                  <label
                    key={r}
                    className={cn(
                      "group flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-accent/50 focus-within:ring-offset-2 focus-within:ring-offset-background",
                      reason === r
                        ? "border-accent/50 bg-accent/[0.06] text-foreground shadow-sm"
                        : "border-border/70 text-muted-foreground/85 hover:border-border hover:bg-surface/30 hover:text-foreground"
                    )}
                  >
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => handleReasonSelect(r)}
                      className="sr-only"
                      aria-label={`Select: ${r}`}
                    />
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                        reason === r
                          ? "border-accent"
                          : "border-border group-hover:border-muted-foreground/70"
                      )}
                      aria-hidden="true"
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full bg-accent transition-transform duration-200",
                          reason === r ? "scale-100" : "scale-0"
                        )}
                      />
                    </span>
                    <span className="flex-1 font-semibold">{r}</span>
                    {reason === r && (
                      <ChevronRight className="size-3.5 text-accent/70" aria-hidden="true" />
                    )}
                  </label>
                ))}
              </fieldset>
              <button
                type="button"
                onClick={handleContinue}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-bold text-accent-foreground transition-all duration-200 hover:bg-accent-2 hover:shadow-md hover:shadow-accent/20 active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {step === "offer" && (
            <div className="w-full max-w-sm">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider", journey.badgeColor)}>
                <JourneyIcon className="size-3" aria-hidden="true" />
                {journey.badge}
              </div>

              {journey.offerVisual}

              <p className="text-lg font-bold leading-snug text-foreground">
                {journey.headline}
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground/75">
                {journey.subheadline}
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-bold text-accent-foreground transition-all duration-200 hover:bg-accent-2 hover:shadow-md hover:shadow-accent/20 active:scale-[0.98]"
                >
                  {journey.primaryAction}
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="text-xs font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
                >
                  {journey.secondaryAction}
                </button>
              </div>
            </div>
          )}

          {step === "saved" && (
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <p className="mt-5 text-lg font-bold text-foreground">
                {journey.savedMessage}
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground/75">
                {journey.savedDetail}
              </p>
              <button
                type="button"
                onClick={handleReplay}
                className="mt-7 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Try another reason
              </button>
            </div>
          )}

          {step === "declined" && (
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/60">
                <ShieldCheck className="size-6 text-muted-foreground/80" aria-hidden="true" />
              </div>
              <p className="mt-5 text-lg font-bold text-foreground">
                {journey.declinedMessage}
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground/75">
                {journey.declinedDetail}
              </p>
              <button
                type="button"
                onClick={handleReplay}
                className="mt-7 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Try another reason
              </button>
            </div>
          )}
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-1.5 border-t border-border/60 px-5 py-3">
          {[0, 1, 2, 3, 4].map((i) => {
            const isActive = i === stepIndex;
            const isPast = i < stepIndex;
            return (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  isActive ? "w-6 bg-accent" : isPast ? "w-2.5 bg-accent/50" : "w-2.5 bg-border"
                )}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Dashboard data with reactive states
interface DashboardData {
  recoveredRevenue: string;
  recoveredDelta: string;
  sessions: string;
  sessionsDelta: string;
  offersAccepted: string;
  offersTotal: string;
  saveRate: number;
  saveRateDelta: string;
  activity: Array<{
    name: string;
    action: string;
    time: string;
    avatar: string;
    color: string;
    icon: React.ElementType;
  }>;
}

const baseDashboard: DashboardData = {
  recoveredRevenue: "$48,210",
  recoveredDelta: "+12.4%",
  sessions: "1,204",
  sessionsDelta: "+6.8%",
  offersAccepted: "412",
  offersTotal: "of 1,204",
  saveRate: 34.2,
  saveRateDelta: "+2.1pp",
  activity: [
    {
      name: "M. Alvarez",
      action: "accepted 20% off for 3 months",
      time: "2m ago",
      avatar: "MA",
      color: "bg-emerald-500/15 text-emerald-700",
      icon: Tag,
    },
    {
      name: "J. Okafor",
      action: "paused subscription for 30 days",
      time: "14m ago",
      avatar: "JO",
      color: "bg-amber-500/15 text-amber-700",
      icon: Pause,
    },
    {
      name: "S. Novak",
      action: "completed exit survey",
      time: "26m ago",
      avatar: "SN",
      color: "bg-slate-500/15 text-slate-700",
      icon: MessageSquare,
    },
    {
      name: "R. Tanaka",
      action: "downgraded to Starter plan",
      time: "41m ago",
      avatar: "RT",
      color: "bg-blue-500/15 text-blue-700",
      icon: TrendingDown,
    },
  ],
};

const savedDashboard: DashboardData = {
  recoveredRevenue: "$48,299",
  recoveredDelta: "+12.5%",
  sessions: "1,204",
  sessionsDelta: "+6.8%",
  offersAccepted: "413",
  offersTotal: "of 1,204",
  saveRate: 34.3,
  saveRateDelta: "+2.2pp",
  activity: [
    {
      name: "You",
      action: "accepted 25% off for 3 months",
      time: "Just now",
      avatar: "YO",
      color: "bg-accent/15 text-accent",
      icon: MousePointerClick,
    },
    {
      name: "M. Alvarez",
      action: "accepted 20% off for 3 months",
      time: "2m ago",
      avatar: "MA",
      color: "bg-emerald-500/15 text-emerald-700",
      icon: Tag,
    },
    {
      name: "J. Okafor",
      action: "paused subscription for 30 days",
      time: "14m ago",
      avatar: "JO",
      color: "bg-amber-500/15 text-amber-700",
      icon: Pause,
    },
    {
      name: "S. Novak",
      action: "completed exit survey",
      time: "26m ago",
      avatar: "SN",
      color: "bg-slate-500/15 text-slate-700",
      icon: MessageSquare,
    },
  ],
};

const reasons = [
  { label: "Too expensive", value: 34 },
  { label: "Missing features", value: 22 },
  { label: "Switched to competitor", value: 18 },
  { label: "Not using it enough", value: 15 },
  { label: "Other", value: 11 },
];

const chartPoints = [
  [20, 160],
  [116, 140],
  [212, 118],
  [308, 96],
  [404, 64],
  [500, 20],
] as const;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const MemoizedDashboard = memo(function Dashboard({
  data,
  isHighlighted,
}: {
  data: DashboardData;
  isHighlighted: boolean;
}) {
  const linePoints = useMemo(() => chartPoints.map(([x, y]) => `${x},${y}`).join(" "), []);
  const areaPoints = useMemo(() => `${linePoints} 500,200 20,200`, [linePoints]);
  const ringCircumference = useMemo(() => 2 * Math.PI * 20, []);
  const ringFilled = useMemo(
    () => (data.saveRate / 100) * ringCircumference,
    [data.saveRate, ringCircumference]
  );

  return (
    <div className="relative rounded-xl border border-border bg-surface/60 p-1.5 shadow-lg shadow-black/10 backdrop-blur-sm">
      <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-accent/15">
                <BarChart3 className="size-3.5 text-accent" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-foreground">Overview</span>
            </div>
            <span className="hidden text-sm font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground sm:inline cursor-pointer">
              Flows
            </span>
            <span className="hidden text-sm font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground sm:inline cursor-pointer">
              Analytics
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-muted-foreground/50" aria-hidden="true" />
            <span className="text-xs font-bold text-muted-foreground/60">Last 30 days</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-4">
          {/* Recovered Revenue */}
          <div
            className={cn(
              "bg-background p-5 transition-all duration-500",
              isHighlighted && "ring-1 ring-inset ring-emerald-500/25 bg-emerald-50/[0.04]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                Recovered revenue
              </span>
              <div className="flex size-7 items-center justify-center rounded-md bg-accent/15">
                <TrendingUp className="size-3.5 text-accent" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {data.recoveredRevenue}
              </span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-success">
              <ArrowUpRight className="size-3" aria-hidden="true" />
              {data.recoveredDelta}
            </span>
          </div>

          {/* Cancellation Sessions */}
          <div
            className={cn(
              "bg-background p-5 transition-all duration-500",
              isHighlighted && "ring-1 ring-inset ring-emerald-500/25 bg-emerald-50/[0.04]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                Cancellation sessions
              </span>
              <div className="flex size-7 items-center justify-center rounded-md bg-accent/15">
                <Activity className="size-3.5 text-accent" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {data.sessions}
              </span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-success">
              <ArrowUpRight className="size-3" aria-hidden="true" />
              {data.sessionsDelta}
            </span>
          </div>

          {/* Offers Accepted */}
          <div
            className={cn(
              "bg-background p-5 transition-all duration-500",
              isHighlighted && "ring-1 ring-inset ring-emerald-500/25 bg-emerald-50/[0.04]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                Offers accepted
              </span>
              <div className="flex size-7 items-center justify-center rounded-md bg-accent/15">
                <Users className="size-3.5 text-accent" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {data.offersAccepted}
              </span>
            </div>
            <span className="mt-2 text-xs font-semibold text-muted-foreground/70">
              {data.offersTotal}
            </span>
          </div>

          {/* Save Rate */}
          <div
            className={cn(
              "bg-background p-5 transition-all duration-500",
              isHighlighted && "ring-1 ring-inset ring-emerald-500/25 bg-emerald-50/[0.04]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                Save rate
              </span>
              <div className="flex size-7 items-center justify-center rounded-md bg-accent/15">
                <Percent className="size-3.5 text-accent" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="relative flex size-12 shrink-0 items-center justify-center">
                <svg viewBox="0 0 48 48" className="size-12 -rotate-90" aria-hidden="true">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="var(--color-surface-2)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${ringFilled.toFixed(1)} ${ringCircumference.toFixed(1)}`}
                    className={cn("transition-all duration-700", isHighlighted && "stroke-emerald-600")}
                  />
                </svg>
                <span className="absolute font-mono text-xs font-bold text-foreground">
                  {Math.round(data.saveRate)}%
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                  {data.saveRateDelta}
                </span>
                <p className="mt-0.5 text-[10px] font-bold text-muted-foreground/50">
                  vs. last period
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-px bg-border/40 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="bg-background p-5 sm:p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Revenue recovered</h3>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground/60">
                  Monthly trend, last 6 months
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                12.4%
              </span>
            </div>
            <svg
              viewBox="0 0 520 200"
              className="w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#cf)" />
              <polyline
                points={linePoints}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chartPoints.map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="var(--color-background)"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            <div className="mt-3 flex justify-between text-xs font-bold text-muted-foreground/60">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          {/* Cancellation Reasons */}
          <div className="bg-background p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-foreground">Cancellation reasons</h3>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground/60">
                Distribution by category
              </p>
            </div>
            <div className="space-y-4">
              {reasons.map((r) => (
                <div key={r.label}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-semibold text-muted-foreground/85">{r.label}</span>
                    <span className="font-mono font-bold text-foreground">{r.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-accent/60 transition-all duration-700"
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="border-t border-border/60 p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-bold text-foreground">Recent activity</h3>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground/60">
              Live updates from your retention flows
            </p>
          </div>
          <div className="space-y-1">
            {data.activity.map((a) => (
              <div
                key={`${a.name}-${a.time}`}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-all duration-500",
                  a.name === "You" ? "bg-accent/[0.05]" : "hover:bg-surface/30"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      a.color
                    )}
                  >
                    {a.avatar}
                  </div>
                  <span className="text-sm truncate">
                    <span className="font-bold text-foreground/95">{a.name}</span>{" "}
                    <span className="text-muted-foreground/75">{a.action}</span>
                  </span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground/50">
                  <Clock className="size-3" aria-hidden="true" />
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export function ProductPreview() {
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);

  const dashboardData = useMemo(() => {
    if (demoResult?.outcome === "saved") {
      return savedDashboard;
    }
    return baseDashboard;
  }, [demoResult]);

  const isDashboardHighlighted = demoResult?.outcome === "saved";

  return (
    <section id="product" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="The moment"
          title="Where churn turns around"
          description="This is what your customer sees the instant they try to leave. Try it yourself."
        />

        <div className="mx-auto mt-12 max-w-lg">
          <div className="mb-5 flex items-center justify-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-accent/15">
              <MousePointerClick className="size-3.5 text-accent" aria-hidden="true" />
            </div>
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
              Interactive demo
            </p>
          </div>

          <MemoizedRescueDemo onComplete={setDemoResult} />

          <div className="mt-5 flex flex-col items-center gap-2">
            <p className="flex items-center justify-center gap-2 text-center text-xs font-semibold text-muted-foreground/75">
              <ShieldCheck className="size-3.5 shrink-0 text-accent/70" aria-hidden="true" />
              No dark patterns. No forced retention. Customers can always leave.
            </p>
            <p className="text-center text-xs font-semibold text-muted-foreground/55">
              Select any reason to see its unique retention flow.
            </p>
          </div>
        </div>

        <p className="mt-16 text-center text-sm font-bold text-muted-foreground/75">
          {demoResult?.outcome === "saved"
            ? "That recovery feeds directly into your numbers. Here's what it adds up to."
            : "Multiply that moment by every customer who tries to leave. Here's what it adds up to."}
        </p>

        <div className="mt-8">
          <MemoizedDashboard 
            data={dashboardData} 
            isHighlighted={isDashboardHighlighted} 
          />
        </div>
      </Container>
    </section>
  );
}