import { ArrowRight } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-8 py-16 text-center md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.12] blur-[100px]"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="pointer-events-none absolute -right-16 -top-16 size-64 opacity-[0.07]"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray="420 150"
            />
          </svg>
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The next &ldquo;Cancel&rdquo; click is coming. Make sure it
              isn&apos;t final.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
              Set up your first retention flow in minutes. No credit card
              required.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild>
                <a href="#pricing">
                  Start free
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
