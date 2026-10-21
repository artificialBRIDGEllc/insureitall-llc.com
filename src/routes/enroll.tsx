import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { CallLink } from "@/components/call-link";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { Button } from "@/components/ui/button";
import { ENROLL_URL } from "@/lib/enroll";
import { pageHead } from "@/lib/seo";
import { track } from "@/lib/track";
import { HOURS, PHONE_DISPLAY, TTY } from "@/lib/utils";

export const Route = createFileRoute("/enroll")({
  component: EnrollPage,
  head: () =>
    pageHead({
      title: "Compare and enroll in a Medicare plan online",
      description: `Shop and enroll in Medicare plans online on your own schedule, with a licensed INSUREitALL agent behind you. Prefer to talk? Call ${PHONE_DISPLAY}.`,
      path: "/enroll",
    }),
});

function EnrollPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Enroll online"
        title="Shop and enroll on your own time."
        lede="Compare the plans we offer in your area and enroll online. A licensed agent is still yours afterward — questions, ID cards, next year's changes."
      />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-elevated p-8 shadow-card">
          {ENROLL_URL ? (
            <>
              <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
                Self-service enrollment
              </p>
              <h2 className="mt-2 font-display text-2xl text-navy">Before you start</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
                <li>
                  Have your red-white-and-blue Medicare card, your doctors, and your
                  prescriptions handy.
                </li>
                <li>
                  Enrollment happens on Sunfire, a secure Medicare shopping and enrollment
                  platform licensed agents use. It opens in a new tab and is not run by
                  INSUREitALL.
                </li>
                <li>
                  Your enrollment is linked to our agency, so we can help with your plan after
                  you enroll — at no cost to you.
                </li>
              </ul>
              <Button asChild className="mt-8 w-full" size="lg" variant="blue">
                <a
                  href={ENROLL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("enroll_purl_click")}
                >
                  Compare plans and enroll
                  <ExternalLink className="ml-2 size-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
              <p className="mt-6 text-center text-sm text-muted">
                Rather talk it through?{" "}
                <CallLink className="font-medium text-blue">Call {PHONE_DISPLAY}</CallLink>
                <br />
                {HOURS} · {TTY}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl text-navy">
                Online enrollment is coming soon.
              </h2>
              <p className="mt-3 text-sm text-ink">
                A licensed agent can compare plans and enroll you by phone today.
              </p>
              <Button asChild className="mt-6 w-full" size="lg" variant="blue">
                <CallLink>Call {PHONE_DISPLAY}</CallLink>
              </Button>
            </>
          )}
          <TpmoDisclaimer withNonAffiliation className="mt-8 border-t border-border pt-6 text-muted" />
        </div>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
