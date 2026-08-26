import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () =>
    pageHead({
      title: "Terms of Use",
      description: "Terms of use for the INSUREitALL LLC website and educational tools.",
      path: "/terms",
    }),
});

function TermsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        lede="Rules for using this website and our educational tools."
      />
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-12 text-sm leading-relaxed text-ink sm:px-6">
        <section>
          <h2 className="font-display text-2xl text-navy">1. Acceptance</h2>
          <p className="mt-3">
            By using this website you agree to these terms. If you do not agree,
            do not use the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">2. Educational purpose</h2>
          <p className="mt-3">This site helps you understand Medicare coverage types. We do not:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Endorse a specific plan or carrier as best for you</li>
            <li>Publish complete plan-by-plan pricing for every zip</li>
            <li>Enroll you without a licensed agent</li>
            <li>Provide medical advice</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">3. Licensed agents</h2>
          <p className="mt-3">
            Plan details, pricing, and enrollment require a licensed INSUREitALL
            agent. Submitting a form or requesting a call gives us permission to
            have an agent contact you as described on that form.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">4. Third-party sites</h2>
          <p className="mt-3">
            fileBRIDGE is owned and operated by artificialBRIDGE LLC. When you
            follow that link we tell you that you are leaving INSUREitALL LLC.
            We are not responsible for that site’s content, privacy practices, or
            availability. Using it is not an enrollment with us or with Medicare.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">5. BRIDGEt</h2>
          <p className="mt-3">
            BRIDGEt is an AI Medicare advocate, not a licensed agent. See the{" "}
            <Link className="text-blue" to="/ai-disclosure">
              AI Disclosure
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">6. Liability</h2>
          <p className="mt-3">
            The site is provided “as is.” To the fullest extent allowed by law,
            INSUREitALL LLC is not liable for indirect or consequential losses
            from use of the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">7. Governing law</h2>
          <p className="mt-3">
            These terms are governed by the laws of the State of Florida and the
            United States.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">8. Contact</h2>
          <p className="mt-3">
            <a className="text-blue" href="mailto:info@team-iia.com">
              info@team-iia.com
            </a>{" "}
            ·{" "}
            <a className="text-blue" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
            · 3550 Buschwood Park Dr, Ste 180, Tampa, FL 33618
          </p>
        </section>
        <p className="text-xs text-muted">Last updated August 25, 2026.</p>
      </main>
    </SiteShell>
  );
}
