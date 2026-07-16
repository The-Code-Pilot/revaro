import { Check } from "lucide-react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: 49,
    description: "For early-stage SaaS just getting started with retention.",
    roi: "Pays for itself with a single saved customer.",
    cta: "Get started",
    features: [
      "Up to 200 cancellation sessions/mo",
      "1 cancellation flow",
      "Exit surveys",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: 299,
    description:
      "For scaling subscription businesses recovering real revenue.",
    roi: "Pays for itself with your first save — every one after that is margin.",
    highlighted: true,
    cta: "Start free trial",
    features: [
      "Unlimited cancellation sessions",
      "Unlimited flows",
      "Retention offers engine",
      "Advanced analytics & reporting",
      "A/B testing on offers",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: 999,
    description: "For large-scale and multi-brand subscription businesses.",
    roi: "Built for teams where one lost account costs more than the plan.",
    cta: "Talk to sales",
    features: [
      "Everything in Growth",
      "Multiple Stripe accounts",
      "Custom integrations & API access",
      "Dedicated onboarding & CSM",
      "Custom contract & SLA",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Priced to be an obvious yes"
          description="Every plan recovers revenue from day one — the only real question is how much you're already losing by waiting."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-xl border p-8",
                  plan.highlighted
                    ? "border-accent/50 bg-surface shadow-2xl shadow-accent/10 lg:-translate-y-3"
                    : "border-border bg-surface/40"
                )}
              >
                {plan.highlighted && (
                  <Badge variant="accent" className="absolute -top-3 left-8">
                    Recommended
                  </Badge>
                )}
                <h3 className="text-lg font-medium text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-semibold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-xs text-accent">{plan.roi}</p>

                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="mt-6 w-full"
                  asChild
                >
                  <a href="#">{plan.cta}</a>
                </Button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-foreground/85"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Stripe-native — we never store card data &middot; Export your data
          anytime &middot; Built for 99.9% uptime
        </p>
      </Container>
    </section>
  );
}
