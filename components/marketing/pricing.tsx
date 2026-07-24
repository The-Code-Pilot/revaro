import { Check } from "lucide-react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: number;
  description: string;
  cta: string;
  features: string[];
  highlighted?: boolean;
  roi?: string;
  includesNote?: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: 49,
    description:
      "For early-stage SaaS looking to recover more customers with minimal setup.",
    cta: "Start free trial",
    features: [
      "Up to 200 cancellation sessions/month",
      "Up to 2 personalized retention journeys",
      "Exit surveys",
      "Discount, pause & feedback offers",
      "Retention analytics",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: 299,
    description:
      "For SaaS teams turning customer retention into a growth strategy.",
    includesNote: "Everything in Starter, plus:",
    roi: "Pays for itself with your first recovered customer.",
    highlighted: true,
    cta: "Start free trial",
    features: [
      "Up to 2,500 cancellation sessions/month",
      "Up to 5 personalized retention journeys",
      "Conditional journey builder",
      "Competitor-specific journeys",
      "Feature waitlist journeys",
      "Advanced retention analytics",
      "Recovered MRR reporting",
      "A/B testing",
      "Up to 5 team members",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: 999,
    description:
      "For subscription businesses operating at scale.",
    includesNote: "Everything in Growth, plus:",
    cta: "Talk to sales",
    features: [
      "Unlimited cancellation sessions",
      "Unlimited personalized retention journeys",
      "Unlimited team members & roles",
      "Multiple workspaces",
      "Role-based permissions",
      "API & Webhooks",
      "CRM integrations",
      "White-label branding",
      "White-glove onboarding",
      "Priority SLA support",
      "Dedicated Customer Success Manager",
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
          description="Every plan helps recover revenue that would otherwise be lost—the only real question is how much churn is already costing you."
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
                    Best Value
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

                {plan.roi && (
                  <p className="mt-2 text-xs font-medium text-accent">
                    {plan.roi}
                  </p>
                )}

                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="mt-6 w-full"
                  asChild
                >
                  <a href="#">
                    {plan.cta}
                  </a>
                </Button>

                {plan.includesNote && (
                  <p className="mt-8 text-xs font-medium uppercase tracking-wide text-foreground">
                    {plan.includesNote}
                  </p>
                )}

                <ul
                  className={cn(
                    "space-y-3",
                    plan.includesNote ? "mt-3" : "mt-8"
                  )}
                >
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-foreground/85"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Built for subscription businesses &middot; Your billing stays under
          your control &middot; Export your data anytime &middot; No long-term
          contracts
        </p>
      </Container>
    </section>
  );
}