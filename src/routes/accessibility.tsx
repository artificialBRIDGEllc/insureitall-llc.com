import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/accessibility")({
  component: AccessibilityPage,
  head: () =>
    pageHead({
      title: "Accessibility",
      description:
        "INSUREitALL accessibility commitment — WCAG-oriented design for seniors and assistive technology.",
      path: "/accessibility",
    }),
});

function AccessibilityPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal"
        title="Accessibility Statement"
        lede="Built for clarity — including larger type, contrast, and keyboard use."
      />
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-12 text-sm leading-relaxed text-ink sm:px-6">
        <section>
          <h2 className="font-display text-2xl text-navy">Commitment</h2>
          <p className="mt-3">
            INSUREitALL LLC works to keep this website usable by people with
            disabilities and age-related vision or motor changes. We aim for WCAG
            2.1/2.2 Level AA and use stronger contrast on body text where we can.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">What we build in</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Semantic structure and labeled controls</li>
            <li>Large touch targets and readable body type</li>
            <li>Keyboard focus that stays visible</li>
            <li>Respect for prefers-reduced-motion</li>
            <li>Phone-first paths that do not depend on a mouse</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Report a barrier</h2>
          <p className="mt-3">
            Email{" "}
            <a className="text-blue" href="mailto:info@team-iia.com">
              info@team-iia.com
            </a>{" "}
            or call{" "}
            <a className="text-blue" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
            . Include the page URL, your browser, and any assistive technology if
            you can.
          </p>
        </section>
        <p className="text-xs text-muted">Last updated August 25, 2026.</p>
      </main>
    </SiteShell>
  );
}
