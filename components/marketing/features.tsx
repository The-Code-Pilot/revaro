import {
  BarChart3,
  ClipboardList,
  Gift,
  Rocket,
  Workflow,
  Zap,
} from "lucide-react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";

const features = [
  {
    icon: Workflow,
    title: "Custom cancellation flows",
    description:
      "Match the save to the customer — a discount for the price-sensitive, a pause for the seasonal. Higher acceptance than one generic offer for everyone.",
  },
  {
    icon: Gift,
    title: "Retention offers",
    description:
      "Surface the exact offer that keeps someone — a discount, a pause, a downgrade — the moment they try to leave, not a week later in an email they won't open.",
  },
  {
    icon: ClipboardList,
    title: "Exit surveys",
    description:
      "When someone does leave, know exactly why — so the next hundred cancellations don't repeat the same fixable mistake.",
  },
  {
    icon: Zap,
    title: "Stripe-native integration",
    description:
      "Live in your Stripe data in minutes. No migration, no duplicate billing logic, nothing to reconcile later.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Recovered revenue, save rate, and churn reasons in one place — the numbers your board actually asks about.",
  },
  {
    icon: Rocket,
    title: "Fast setup",
    description:
      "Ship your first retention flow this afternoon, not next quarter's roadmap item.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Everything that turns a cancellation into a save"
          description="Not another dashboard to check. A system that acts in the moment, automatically."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="h-full bg-background p-8 transition-colors hover:bg-surface">
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-accent">
                  <f.icon className="size-4" />
                </div>
                <h3 className="text-base font-medium text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
