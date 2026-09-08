import Link from "next/link";
import { Container } from "@/components/common/container";
import Lettermark from "@/components/brand/Lettermark";
import Wordmark from "@/components/brand/Wordmark";

const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Changelog", "Docs"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers"],
  },
  {
    title: "Resources",
    links: ["Help center", "API reference", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Lettermark className="h-7 w-7" />
              <Wordmark textSize="text-xl" />
            </Link>
            <p className="mt-4 max-w-[220px] text-sm text-muted-foreground">
              The Stripe-native retention platform.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">
                Twitter
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                GitHub
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                LinkedIn
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>&copy; 2026 Revora. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}