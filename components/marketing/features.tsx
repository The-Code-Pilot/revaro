import {
  BarChart3,
  ClipboardList,
  Gift,
  Workflow,
  Zap,
  ArrowRightLeft,
} from "lucide-react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";

const features = [
  {
    icon: Workflow,
    title: "Personalized Rescue Journeys",
    description:
      "Show a different experience for every cancellation reason. Discounts, pauses, feature waitlists, competitor responses, or custom journeys—tailored to why the customer wants to leave.",
  },
  {
    icon: Gift,
    title: "Retention Offers That Fit",
    description:
      "Present the right offer at the right moment. Encourage customers to stay with discounts, plan changes, pauses, or other personalized retention experiences.",
  },
  {
    icon: ArrowRightLeft,
    title: "Native Stripe Integration",
    description:
      "Connect directly with Stripe so subscriptions and billing stay where they already belong. No duplicate subscription management or billing migration.",
  },
  {
    icon: ClipboardList,
    title: "Understand Why Customers Leave",
    description:
      "Collect structured cancellation feedback and discover the patterns behind churn so your team can improve the product with confidence.",
  },
  {
    icon: BarChart3,
    title: "Measure Revenue You Saved",
    description:
      "Track recovered revenue, save rates, cancellation reasons, and journey performance in one dashboard designed for subscription businesses.",
  },
  {
    icon: Zap,
    title: "Flexible Flow Builder",
    description:
      "Create multiple retention journeys without rebuilding your cancellation experience. Adapt your flows as your product and customers evolve.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Capabilities"
          title="The retention platform built for subscription businesses."
          description="Revora combines personalized rescue journeys, retention offers, customer insights, and revenue analytics into one Stripe-native platform."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal key={feature.title} delay={index * 60}>
                <div className="group flex h-full flex-col bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-surface hover:shadow-lg">
                  <div className="mb-6 flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/5">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          From your first retention journey to enterprise-scale customer
          recovery, Revora grows alongside your subscription business.
        </p>
      </Container>
    </section>
  );
}