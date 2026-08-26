import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/ai-disclosure")({
  component: AiDisclosurePage,
  head: () =>
    pageHead({
      title: "AI Disclosure",
      description:
        "How INSUREitALL uses BRIDGEt and other AI tools. Educational only. Not a licensed agent. No PHI in chat.",
      path: "/ai-disclosure",
    }),
});

function AiDisclosurePage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal"
        title="Artificial Intelligence Disclosure"
        lede="How we use AI — and the hard limits we keep."
      />
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-12 text-sm leading-relaxed text-ink sm:px-6">
        <section>
          <h2 className="font-display text-2xl text-navy">Overview</h2>
          <p className="mt-3">
            INSUREitALL LLC uses artificial intelligence in limited, transparent
            ways to help people understand Medicare coverage types. This page
            explains where AI appears and what it is not allowed to do.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">BRIDGEt</h2>
          <p className="mt-3">
            BRIDGEt is a Medicare <strong>advocate</strong> — a conversational
            guide. She is <strong>not</strong> a licensed insurance agent, not
            affiliated with Medicare or CMS, and never enrolls anyone in a plan.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Does not provide medical advice</li>
            <li>Does not collect or store SSN, Medicare numbers, or medical records in chat</li>
            <li>Does not recommend a specific plan or carrier as “the one”</li>
            <li>Always offers a path to a licensed INSUREitALL agent</li>
            <li>
              We may use conversations to train and improve BRIDGEt or this site.
              Health details from forms move only under a service-provider
              contract, as de-identified data, or with your authorization — see
              the GLBA notice
            </li>
          </ul>
          <p className="mt-3">
            How we treat health information you share on forms is on{" "}
            <Link className="text-blue" to="/hipaa">
              HIPAA & PHI
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">When to talk to a human</h2>
          <p className="mt-3">Speak with a licensed agent for:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Plan-specific pricing or network details</li>
            <li>Enrollment decisions</li>
            <li>Questions tied to your doctors, drugs, or conditions</li>
            <li>Appeals or disputes</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Limitations</h2>
          <p className="mt-3">
            AI can be incomplete or wrong. It does not have real-time access to
            every plan change. It should never replace a licensed agent for
            enrollment.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-navy">Questions</h2>
          <p className="mt-3">
            Email{" "}
            <a className="text-blue" href="mailto:info@team-iia.com">
              info@team-iia.com
            </a>{" "}
            or call{" "}
            <a className="text-blue" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </section>
        <p className="text-xs text-muted">Last updated August 25, 2026.</p>
      </main>
    </SiteShell>
  );
}
