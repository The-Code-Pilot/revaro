import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
        >
          Revaro
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a
            href="#features"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>

          <a
            href="#pricing"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost">
            Sign In
          </Button>

          <Button>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}