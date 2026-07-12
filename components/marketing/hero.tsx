import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/[0.14] blur-[120px]"
      />

      <Container className="relative flex flex-col items-center text-center">
        <Badge variant="accent">
          <Sparkles className="size-3.5" />
          Now live for Stripe Billing
        </Badge>

        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Turn &ldquo;Cancel&rdquo; into{" "}
          <span className="text-accent">
            &ldquo;actually, never mind.&rdquo;
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground md:text-xl">
          Revora meets your customers in the exact moment they try to leave —
          with an offer worth staying for. Recovered automatically, natively
          on Stripe.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#pricing">
              Start free
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#product">Watch the moment</a>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          No credit card required &middot; 5-minute Stripe setup &middot;
          Cancel anytime
        </p>
      </Container>
    </section>
  );
}