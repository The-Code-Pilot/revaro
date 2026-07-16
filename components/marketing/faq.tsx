import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does Revora connect to my Stripe account?",
    a: "You connect through a secure OAuth flow — no API keys to manage. Revora reads subscription and customer data in real time and writes cancellation, pause, and discount events back to Stripe automatically.",
  },
  {
    q: "Will this slow down my cancellation flow?",
    a: "No. The retention experience loads asynchronously and typically renders in under 200ms. If anything fails, customers fall back to your default cancellation flow automatically.",
  },
  {
    q: "Do I need to write any code?",
    a: "No. Most teams launch with the no-code flow builder in under an hour. If you want deeper customization, our SDK gives you full control over styling and logic.",
  },
  {
    q: "What happens to my data if I cancel Revora?",
    a: "Your data is yours. You can export everything at any time, and we permanently delete your data within 30 days of account closure.",
  },
  {
    q: "How is this different from just emailing a discount code?",
    a: "Timing and context. Revora intervenes at the exact moment of intent to leave, with an offer tailored to that customer's plan, tenure, and usage — not a generic blast.",
  },
  {
    q: "Does Revora work with Stripe Checkout and Billing?",
    a: "Yes. Revora is built natively on the Stripe Billing API and works with both Stripe Checkout and Customer Portal implementations.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — Starter and Growth both include a 14-day free trial, no credit card required. Enterprise is set up directly with our sales team.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
