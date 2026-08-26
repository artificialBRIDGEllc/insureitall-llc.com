import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { CallLink } from "@/components/call-link";
import { Button } from "@/components/ui/button";
import {
  HIPAA_CONTROLS,
  HIPAA_MAY,
  HIPAA_NEVER,
  HIPAA_ORG,
  HIPAA_RIGHTS,
  HIPAA_SAFE_HARBOR,
} from "@/lib/hipaa";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY } from "@/lib/utils";

export const Route = createFileRoute("/hipaa")({
  component: HipaaPage,
  head: () =>
    pageHead({
      title: "HIPAA & PHI — how we handle health information",
      description:
        "INSUREitALL LLC public HIPAA control map. What PHI we hold, who can see it, what we refuse, and how to reach the Privacy Official.",
      path: "/hipaa",
    }),
});

function HipaaPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="HIPAA · PHI"
        title="How we handle health information."
        lede="There is no HIPAA certificate. This page is the public proof of the controls in this product — what we collect, who can see it, and what we refuse."
      />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <dl className="grid gap-4 rounded-3xl bg-navy p-6 text-elevated sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Privacy Official
            </dt>
            <dd className="mt-1 text-sm">
              <a className="underline underline-offset-2" href={`mailto:${HIPAA_ORG.email}`}>
                {HIPAA_ORG.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Entity
            </dt>
            <dd className="mt-1 text-sm">
              {HIPAA_ORG.entity} · NPN {HIPAA_ORG.npn}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Last reviewed
            </dt>
            <dd className="mt-1 text-sm">{HIPAA_ORG.reviewed}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Call
            </dt>
            <dd className="mt-1 text-sm">
              <CallLink>{PHONE_DISPLAY}</CallLink>
            </dd>
          </div>
        </dl>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Our role</h2>
          <p>
            INSUREitALL LLC is a licensed Medicare insurance agency. We are not
            Medicare, CMS, or a health plan. Optional doctor names and medication
            names you type so a licensed agent can prepare are treated as
            protected health information in this product. They stay with
            INSUREitALL (staff desk and your portal). They are not emailed in
            lead alerts. artificialBRIDGE does not receive identifiable health
            details for training — only de-identified or aggregated data. We
            never collect SSN or Medicare numbers on this site.
          </p>
          <p>
            We do not claim a HIPAA “certification” — none exists. We claim the
            controls below, which you can inspect on this site.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">
            Safe Harbor de-identification
          </h2>
          <p>
            If a BRIDGEt conversation is kept for product improvement, it is
            text only. Audio is never stored. Each turn is run through HIPAA
            Safe Harbor (45 CFR 164.514(b)(2)) before it is written. Expert
            determination and limited data sets are not used. We do not keep a
            key that could put the identifiers back.
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            {HIPAA_SAFE_HARBOR.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="card-elevated rounded-3xl bg-elevated p-6">
            <h2 className="font-display text-xl text-navy">You may share</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink">
              {HIPAA_MAY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card-elevated rounded-3xl bg-elevated p-6">
            <h2 className="font-display text-xl text-navy">Never on this site</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink">
              {HIPAA_NEVER.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Control map</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Each row is something this product actually does. If a row would be
            theater, it is not on this list.
          </p>
          <div className="mt-6 overflow-x-auto rounded-3xl bg-elevated shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[0.65rem] tracking-[0.14em] text-muted uppercase">
                  <th className="px-5 py-3 font-semibold">Control</th>
                  <th className="px-5 py-3 font-semibold">Where</th>
                  <th className="px-5 py-3 font-semibold">Proof</th>
                </tr>
              </thead>
              <tbody>
                {HIPAA_CONTROLS.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 align-top">
                      <p className="font-medium text-navy">{row.title}</p>
                      <p className="mt-1 text-xs text-muted">{row.cfr}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-ink">{row.where}</td>
                    <td className="px-5 py-4 align-top text-ink">{row.proof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Who can see it</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>You, in your portal file, after you sign in.</li>
            <li>
              Licensed INSUREitALL team members on the staff desk, so they can
              call you back.
            </li>
            <li>
              BRIDGEt and the site: health information used to train or improve
              the site moves only to a contracted service provider, as
              de-identified data, or with your authorization. Live chat still
              cannot open your file.
            </li>
            <li>
              A carrier, if you ask us to enroll or to work a claim — not because
              you typed a form.
            </li>
            <li>
              Vendors who process communications for us, under agreements that
              limit their use. We execute a Business Associate Agreement before a
              vendor creates, receives, maintains, or transmits PHI for us.
            </li>
          </ul>
          <p>
            BRIDGEt cannot open your file. Outside agents and agencies cannot
            open the staff desk.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Your rights</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {HIPAA_RIGHTS.map((item) => (
              <article key={item.t} className="card-elevated rounded-3xl bg-elevated p-5">
                <h3 className="font-sans text-base font-semibold text-navy">{item.t}</h3>
                <p className="mt-2 text-sm text-ink">{item.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">If something goes wrong</h2>
          <p>
            If unsecured PHI is breached, we will investigate and notify you and
            HHS as HIPAA requires — without unreasonable delay and no later than
            60 days after we discover it. Call or email the Privacy Official the
            same day you think something is wrong.
          </p>
          <p>
            Full legal terms for what we collect live in the{" "}
            <Link className="text-blue" to="/privacy">
              Privacy Policy
            </Link>
            . How we share nonpublic personal information lives in the{" "}
            <Link className="text-blue" to="/glba">
              GLBA Privacy Notice
            </Link>
            . How the advocate is walled off lives in the{" "}
            <Link className="text-blue" to="/ai-disclosure">
              AI Disclosure
            </Link>
            . The written security program and BAA policy live in{" "}
            <Link className="text-blue" to="/security">
              Information Security
            </Link>
            .
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <CallLink>Call {PHONE_DISPLAY}</CallLink>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${HIPAA_ORG.email}`}>Email the Privacy Official</a>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted">
          Last reviewed {HIPAA_ORG.reviewed}. {HIPAA_ORG.address}.
        </p>
      </main>
    </SiteShell>
  );
}
