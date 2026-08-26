import { AB_NAME, AB_TAGLINE } from "@/lib/ab";
import { cn } from "@/lib/utils";

/** The Span — broken arch, playbook primary mark. */
export function AbSpan({ className }: { className?: string }) {
  return (
    <svg
      className={cn("ab-span", className)}
      viewBox="14 30 92 73"
      width="32"
      height="25"
      fill="none"
      aria-hidden
    >
      <path
        d="M22 95 C 22 55 41 39 57 38"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M98 95 C 98 55 79 39 63 38"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="60" cy="36" r="6" fill="currentColor" />
    </svg>
  );
}

export function AbWordmark({ className, tag = false }: { className?: string; tag?: boolean }) {
  return (
    <span className={cn("ab-word", className)}>
      <span className="ab-lo">artificial</span>
      <span className="ab-hi">BRIDGE</span>
      {tag ? <span className="ab-tag">{AB_TAGLINE}</span> : null}
    </span>
  );
}

export function AbLockup({ className }: { className?: string }) {
  return (
    <span className={cn("ab-lockup", className)} aria-label={AB_NAME}>
      <AbSpan />
      <AbWordmark />
    </span>
  );
}
