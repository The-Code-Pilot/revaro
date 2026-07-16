"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  Percent,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";

type DemoStep = "idle" | "offer" | "saved" | "declined";

function RescueDemo() {
  const [step, setStep] = useState<DemoStep>("idle");

  return (
    <div className="relative rounded-xl border border-border bg-surface/60 p-2 shadow-2xl shadow-black/40">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <span className="text-sm font-medium text-foreground">
            Your subscription
          </span>
          <span className="text-xs text-muted-foreground">
            acmeanalytics.com
          </span>
        </div>

        <div
          key={step}
          aria-live="polite"
          className="animate-fade-in flex min-h-[280px] items-center justify-center p-8 sm:min-h-[260px]"
        >
          {step === "idle" && (
            <div className="w-full max-w-sm text-center">
              <p className="text-sm text-muted-foreground">Pro plan</p>
              <p className="mt-1 font-mono text-3xl font-semibold text-foreground">
                $89
                <span className="text-base font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Active since Nov 2024
              </p>
              <button
                type="button"
                onClick={() => setStep("offer")}
                className="mt-8 text-sm text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground"
              >
                Cancel subscription
              </button>
            </div>
          )}

          {step === "offer" && (
            <div className="w-full max-w-sm">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
                <Sparkles className="size-3.5" />
                Before you go
              </div>
              <p className="mt-3 text-base font-medium text-foreground">
                You&apos;ve been with us 8 months — here&apos;s 25% off your
                next 3, on us.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Or switch to a lighter plan if Pro is more than you need
                right now.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("saved")}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-2"
                >
                  Keep my plan — 25% off
                </button>
                <button
                  type="button"
                  onClick={() => setStep("declined")}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  No thanks, cancel anyway
                </button>
              </div>
            </div>
          )}

          {step === "saved" && (
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Check className="size-5" />
              </div>
              <p className="mt-4 text-base font-medium text-foreground">
                Nice — you just saved a customer.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                $89/mo retained. Logged as a recovered subscription, no
                manual work.
              </p>
              <button
                type="button"
                onClick={() => setStep("idle")}
                className="mt-6 text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Replay
              </button>
            </div>
          )}

          {step === "declined" && (
            <div className="w-full max-w-sm text-center">
              <p className="text-base font-medium text-foreground">
                That&apos;s okay — this is what your customer sees either
                way.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                No dark patterns, no forced retention. When they do stay,
                it&apos;s because the offer was worth it.
              </p>
              <button
                type="button"
                onClick={() => setStep("idle")}
                className="mt-6 text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Replay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const stats = [
  {
    label: "Recovered revenue",
    value: "$48,210",
    delta: "+12.4%",
    icon: TrendingUp,
  },
  {
    label: "Cancellation sessions",
    value: "1,204",
    delta: "+6.8%",
    icon: Activity,
  },
  {
    label: "Offers accepted",
    value: "412",
    delta: "of 1,204 sessions",
    icon: Users,
  },
];

const reasons = [
  { label: "Too expensive", value: 34 },
  { label: "Missing features", value: 22 },
  { label: "Switched to competitor", value: 18 },
  { label: "Not using it enough", value: 15 },
  { label: "Other", value: 11 },
];

const activity = [
  { name: "M. Alvarez", action: "accepted 20% off for 3 months", time: "2m ago" },
  { name: "J. Okafor", action: "paused subscription for 30 days", time: "14m ago" },
  { name: "S. Novak", action: "completed exit survey", time: "26m ago" },
  { name: "R. Tanaka", action: "downgraded to Starter plan", time: "41m ago" },
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
const SAVE_RATE = 34.2;

export function ProductPreview() {
  const linePoints = chartPoints.map(([x, y]) => `${x},${y}`).join(" ");
  const areaPoints = `${linePoints} 500,200 20,200`;
  const ringCircumference = 2 * Math.PI * 20;
  const ringFilled = (SAVE_RATE / 100) * ringCircumference;

  return (
    <section id="product" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="The moment"
          title="Where churn turns around"
          description="This is what your customer sees the instant they try to leave. Try it yourself."
        />

        <div className="mx-auto mt-10 max-w-lg">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Interactive demo
          </p>
          <RescueDemo />
        </div>

        <p className="mt-16 text-center text-sm text-muted-foreground">
          Multiply that moment by every customer who tries to leave —
          here&apos;s what it adds up to.
        </p>

        <div className="relative mt-8 rounded-xl border border-border bg-surface/60 p-2 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-foreground">
                  Overview
                </span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  Flows
                </span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  Analytics
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Last 30 days
              </span>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-background p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {s.label}
                    </span>
                    <s.icon className="size-3.5 text-accent" />
                  </div>
                  <div className="mt-2">
                    <span className="font-mono text-2xl font-medium text-foreground">
                      {s.value}
                    </span>
                  </div>
                  <span className="mt-1 inline-block text-xs text-success">
                    {s.delta}
                  </span>
                </div>
              ))}

              <div className="bg-background p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Save rate
                  </span>
                  <Percent className="size-3.5 text-accent" />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative flex size-11 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 48 48" className="size-11 -rotate-90">
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
                      />
                    </svg>
                    <span className="absolute font-mono text-[11px] font-medium text-foreground">
                      {Math.round(SAVE_RATE)}%
                    </span>
                  </div>
                  <span className="text-xs text-success">+2.1pp</span>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-border lg:grid-cols-3">
              <div className="bg-background p-6 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Revenue recovered
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="size-3.5" />
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
                      <stop
                        offset="0%"
                        stopColor="var(--color-accent)"
                        stopOpacity="0.35"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-accent)"
                        stopOpacity="0"
                      />
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
                      r={3.5}
                      fill="var(--color-background)"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              <div className="bg-background p-6">
                <h3 className="mb-4 text-sm font-medium text-foreground">
                  Cancellation reasons
                </h3>
                <div className="space-y-3">
                  {reasons.map((r) => (
                    <div key={r.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {r.label}
                        </span>
                        <span className="font-mono text-foreground">
                          {r.value}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-accent/70"
                          style={{ width: `${r.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border p-6">
              <h3 className="mb-4 text-sm font-medium text-foreground">
                Recent activity
              </h3>
              <div className="space-y-3">
                {activity.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-foreground/90">
                      <span className="font-medium">{a.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {a.action}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
