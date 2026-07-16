import { CreditCard, Layers, Sparkles } from "lucide-react";

import { Container } from "@/components/common/container";

const points = [
  { icon: CreditCard, label: "Stripe-native retention platform" },
  { icon: Layers, label: "Built for subscription businesses" },
  { icon: Sparkles, label: "Designed for modern SaaS teams" },
];

export function SocialProof() {
  return (
    <section className="border-y border-border py-14">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {points.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2.5 text-muted-foreground"
            >
              <p.icon className="size-4 text-accent" />
              <span className="text-sm font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
