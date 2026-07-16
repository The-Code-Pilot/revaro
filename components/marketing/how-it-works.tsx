import { CreditCard, RefreshCcw, Sparkles } from "lucide-react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";

const steps = [
  {
    icon: CreditCard,
    title: "Connect your Stripe account",
    description:
      "OAuth, not API keys. Revora reads your subscription data in minutes and changes nothing about how you already bill.",
  },
  {
    icon: Sparkles,
    title: "Customers see this, not a dead end",
    description:
      "The exact moment from above — tailored automatically to their plan, tenure, and usage. No two customers see the same offer.",
  },
  {
    icon: RefreshCcw,
    title: "Saves sync back to Stripe",
    description:
      "Accepted offers apply instantly. No manual reconciliation — it just shows up in the dashboard below.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Live in an afternoon, not a sprint"
        />

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-border md:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 flex size-16 items-center justify-center rounded-full border border-border bg-background text-accent">
                  <s.icon className="size-6" />
                </div>
                <span className="mt-5 font-mono text-xs text-muted-foreground">
                  Step {i + 1}
                </span>
                <h3 className="mt-1.5 text-lg font-medium text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
