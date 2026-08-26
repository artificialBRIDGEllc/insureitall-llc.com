import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { CallLink } from "@/components/call-link";
import { Button } from "@/components/ui/button";
import { GLBA_ACCESS, GLBA_COLLECT, GLBA_HEALTH_FUNCTIONS, GLBA_HEALTH_IS, GLBA_ORG, GLBA_SHARE_ROWS, GLBA_WHO } from "@/lib/glba";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY } from "@/lib/utils";

export const Route = createFileRoute("/glba")({
  component: GlbaPage,
  head: () =>
    pageHead({
      title: "GLBA Privacy Notice",
      description:
        "INSUREitALL LLC Gramm-Leach-Bliley / NAIC privacy notice. What nonpublic personal information we collect, who we share it with, and what you can limit.",
      path: "/glba",
    }),
});

function GlbaPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="GLBA · NAIC 672"
        title="Privacy Notice."
        lede="What nonpublic personal information INSUREitALL LLC collects, who we share it with, and what you can limit. This is our GLBA notice, our NAIC 672 health-information notice, and our notice of insurance information practices."
      />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <dl className="grid gap-4 rounded-3xl bg-navy p-6 text-elevated sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Who we are
            </dt>
            <dd className="mt-1 text-sm">
              {GLBA_ORG.entity} · NPN {GLBA_ORG.npn}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Questions
            </dt>
            <dd className="mt-1 text-sm">
              <a className="underline underline-offset-2" href={`mailto:${GLBA_ORG.email}`}>
                {GLBA_ORG.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Last reviewed
            </dt>
            <dd className="mt-1 text-sm">{GLBA_ORG.reviewed}</dd>
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
          <h2 className="font-display text-2xl text-navy">Why you get this notice</h2>
          <p>
            Federal law (the Gramm-Leach-Bliley Act) and state insurance privacy
            rules (NAIC Model 672) require us to tell you how we collect, share,
            and protect nonpublic personal information. INSUREitALL LLC is a
            licensed Medicare insurance agency — a financial institution under
            those rules. We are not Medicare, CMS, or a health plan.
          </p>
          <p>
            Health details you choose to share are also PHI. The{" "}
            <Link className="text-blue" to="/hipaa">
              HIPAA & PHI
            </Link>{" "}
            page is the control map. This page is the sharing notice. The{" "}
            <Link className="text-blue" to="/privacy">
              Privacy Policy
            </Link>{" "}
            is the website policy. If they ever disagree on health information,
            HIPAA and this notice control.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">What we collect</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink">
            {GLBA_COLLECT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink">
            We never ask for a Social Security number or a Medicare number on
            this site. Free-text that looks like either is rejected.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Reasons we can share</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            The federal model form. “Share” means we disclose nonpublic personal
            information to someone who is not you.
          </p>
          <div className="mt-6 overflow-x-auto rounded-3xl bg-elevated shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[0.65rem] tracking-[0.14em] text-muted uppercase">
                  <th className="px-5 py-3 font-semibold">Reasons we can share your information</th>
                  <th className="px-5 py-3 font-semibold">Does INSUREitALL share?</th>
                  <th className="px-5 py-3 font-semibold">Can you limit this sharing?</th>
                </tr>
              </thead>
              <tbody>
                {GLBA_SHARE_ROWS.map((row) => (
                  <tr key={row.reason} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 align-top text-ink">{row.reason}</td>
                    <td className="px-5 py-4 align-top font-medium text-navy">{row.share}</td>
                    <td className="px-5 py-4 align-top text-ink">{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Who we share with</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {GLBA_WHO.map((item) => (
              <article key={item.t} className="card-elevated rounded-3xl bg-elevated p-5">
                <h3 className="font-sans text-base font-semibold text-navy">{item.t}</h3>
                <p className="mt-2 text-sm text-ink">{item.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">How we use it</h2>
          <p>
            We use financial information (name, phone, email, zip) to respond to
            you and to offer INSUREitALL Medicare services. Calls and texts still
            need your TCPA consent. We do not sell it. We do not share it with
            other TPMOs or lead buyers.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Health information (NAIC 672)</h2>
          <p>
            Optional doctor names, medication names, and care notes are{" "}
            <strong>nonpublic personal health information</strong>. That is
            stricter than the table above. We do not disclose it so that someone
            else can market to you.
          </p>
          <p className="font-medium text-navy">It is:</p>
          <ul className="list-disc space-y-2 pl-5">
            {GLBA_HEALTH_IS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-medium text-navy">We use it only to:</p>
          <ul className="list-disc space-y-2 pl-5">
            {GLBA_HEALTH_FUNCTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Training BRIDGEt or improving this site is not an insurance function
            on that list. If health information is used for those purposes, it
            moves only to a <strong>service provider</strong> under a contract
            that forbids them from using it for their own marketing or from
            building their own model with it. Otherwise we use de-identified
            data, or we ask you first.
          </p>
          <p>
            Leave those fields blank if you do not want to share them. The
            control map is on{" "}
            <Link className="text-blue" to="/hipaa">
              HIPAA & PHI
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Notice of insurance information practices</h2>
          <p>
            We collect personal information from you (forms, portal, calls). We
            do not run investigative consumer reports. We do not make adverse
            underwriting decisions — carriers do. We do not collect from sources
            other than you except public records or a carrier when you ask us to
            service coverage.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">How we protect it</h2>
          <p>
            We restrict access to team members who need it to serve you. The
            staff desk is team-email only. A portal file is visible only to the
            signed-in account, unless you create a share code. Production is
            served over TLS. The live control map is on{" "}
            <Link className="text-blue" to="/hipaa">
              HIPAA & PHI
            </Link>
            . The written program is on{" "}
            <Link className="text-blue" to="/security">
              Information Security
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Consumers and customers</h2>
          <p>
            If you request a call or send a needs analysis, you are a{" "}
            <strong>consumer</strong>. If you keep an ongoing relationship with
            us — a portal file, or coverage we helped you enroll — you are a{" "}
            <strong>customer</strong>. This page is the initial notice for both.
          </p>
          <p>
            Federal law lets us skip an annual re-mail when we share only as
            described here and this notice has not changed. If we start sharing
            in a new way, we will post a revised notice and tell customers.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Access, correction, deletion</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            NAIC Model 670: we answer in 30 business days.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {GLBA_ACCESS.map((item) => (
              <article key={item.t} className="card-elevated rounded-3xl bg-elevated p-5">
                <h3 className="font-sans text-base font-semibold text-navy">{item.t}</h3>
                <p className="mt-2 text-sm text-ink">{item.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">What you can do</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Email {GLBA_ORG.email} or call {PHONE_DISPLAY} and name the right you want.</li>
            <li>Leave doctor and medication fields blank. They are optional.</li>
            <li>Reply STOP to texts. Call to revoke callback consent going forward.</li>
          </ul>
          <p>
            Because we do not share with nonaffiliates for them to market to you,
            there is no GLBA “opt out of sales” form. TCPA consent for calls and
            texts is separate and is not a condition of purchase.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <CallLink>Call {PHONE_DISPLAY}</CallLink>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${GLBA_ORG.email}`}>Email {GLBA_ORG.email}</a>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted">
          Last reviewed {GLBA_ORG.reviewed}. {GLBA_ORG.address}.
        </p>
      </main>
    </SiteShell>
  );
}
