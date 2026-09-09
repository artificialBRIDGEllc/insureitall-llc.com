import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { CallLink } from "@/components/call-link";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { HQ_CITY, HQ_LINE1, HQ_LINE2, HOURS, PHONE_DISPLAY, TTY } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    pageHead({
      title: "Contact a licensed Medicare agent",
      description: `Call INSUREitALL at ${PHONE_DISPLAY}. Licensed agents, Monday–Friday 9am–6pm ET, TTY 711. Tampa office. No scripts, no pressure.`,
      path: "/contact",
    }),
});

function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="A licensed agent answers the phone."
        lede="We are not a script mill. Call, email, or request a callback — same team either way."
      />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-elevated p-8 shadow-card">
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">Call now</p>
          <CallLink className="mt-2 block font-display text-3xl text-navy">
            {PHONE_DISPLAY}
          </CallLink>
          <p className="mt-2 text-sm text-muted">
            {HOURS} · {TTY}
          </p>
          <Button asChild className="mt-6 w-full" size="lg" variant="blue">
            <CallLink>Call an agent</CallLink>
          </Button>
          <p className="mt-6 text-sm text-ink">
            Email{" "}
            <a className="text-blue" href="mailto:info@team-iia.com">
              info@team-iia.com
            </a>
          </p>
          <p className="mt-2 text-sm text-muted">
            {HQ_LINE1}, {HQ_LINE2}
            <br />
            {HQ_CITY}
          </p>
        </div>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
