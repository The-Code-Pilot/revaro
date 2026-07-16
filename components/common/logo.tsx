import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="8" fill="var(--color-accent)" />
        <circle
          cx="14"
          cy="14"
          r="7"
          fill="none"
          stroke="var(--color-accent-foreground)"
          strokeWidth="2.5"
          strokeDasharray="30 14"
          strokeLinecap="round"
          transform="rotate(-90 14 14)"
        />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">
        Revora
      </span>
    </div>
  );
}
