import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { AbLockup } from "@/components/ab-mark";
import { PortalEmailAuth } from "@/components/portal-email-auth";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AB_LEGAL, AB_ORIGIN, AB_PRODUCT, AB_TAGLINE } from "@/lib/ab";

const pillars = [
  { t: "yours, not the agent’s", d: "change who you talk to. keep the record." },
  { t: "yours, not the shop’s", d: "the file does not live at an agency." },
  { t: "consent-scoped", d: "an agency sees only the fields you grant. revoke anytime." },
];

export function PortalWelcome() {
  return (
    <div className="ab-portal min-h-dvh px-4 py-10 sm:px-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <a href={AB_ORIGIN} className="text-[inherit]">
          <AbLockup />
        </a>
        <p className="text-[0.65rem] tracking-[0.28em] text-[var(--ab-ink-3)]">{AB_TAGLINE}</p>
      </header>

      <main className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[0.7rem] tracking-[0.28em] text-[var(--ab-ink-3)]">{AB_PRODUCT}</p>
          <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl">
            <span className="ab-lo">file</span>
            <span className="ab-hi">BRIDGE</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--ab-ink-2)]">
            the file that spans agencies, end to end. owned and operated by{" "}
            {AB_LEGAL}. INSUREitALL is a partner you can grant — field by field.
          </p>
          <ul className="mt-10 space-y-4">
            {pillars.map((p) => (
              <li key={p.t}>
                <p className="font-extrabold tracking-tight text-[var(--ab-ink)]">{p.t}</p>
                <p className="text-sm text-[var(--ab-ink-3)]">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[14px] border border-[var(--ab-border)] bg-[var(--ab-surface)] p-6">
          <p className="text-sm text-[var(--ab-ink-2)]">create a no-cost account. this is not an enrollment.</p>
          <div className="mt-4 space-y-3">
            {authEnabled ? (
              <>
                <PortalEmailAuth />
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn(p.providerId, { callbackURL: "/portal" })}
                  >
                    continue with {p.label}
                  </Button>
                ))}
              </>
            ) : (
              <p className="text-sm text-[var(--ab-ink-3)]">sign-in is paused.</p>
            )}
          </div>
          <p className="mt-6 text-xs text-[var(--ab-ink-3)]">
            never a medicare number. never an ssn. owned and operated by {AB_LEGAL}.{" "}
            <Link className="text-[var(--ab-accent)]" to="/ab/privacy">
              privacy
            </Link>{" "}
            ·{" "}
            <Link className="text-[var(--ab-accent)]" to="/ab">
              entity
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
