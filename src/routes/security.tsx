import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { CallLink } from "@/components/call-link";
import { Button } from "@/components/ui/button";
import {
  BAA_POLICY,
  ISP_HOLDS,
  ISP_INCIDENT,
  ISP_ORG,
  ISP_SAFEGUARDS,
  ISP_VENDORS,
} from "@/lib/isp";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY } from "@/lib/utils";

export const Route = createFileRoute("/security")({
  component: SecurityPage,
  head: () =>
    pageHead({
      title: "Information Security Program & BAAs",
      description:
        "INSUREitALL LLC written information-security program (NAIC 673) for this website and portal, and how we treat Business Associate Agreements.",
      path: "/security",
    }),
});

function SecurityPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="NAIC 673 · BAA"
        title="Information security."
        lede="The written program for this website, portal, and staff desk. Not a certificate. Not the agency’s office-network binder — that lives with the Privacy Official."
      />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <dl className="grid gap-4 rounded-3xl bg-navy p-6 text-elevated sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Coordinator
            </dt>
            <dd className="mt-1 text-sm">
              {ISP_ORG.coordinator}
              <br />
              <a className="underline underline-offset-2" href={`mailto:${ISP_ORG.email}`}>
                {ISP_ORG.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Entity
            </dt>
            <dd className="mt-1 text-sm">
              {ISP_ORG.entity} · NPN {ISP_ORG.npn}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-mist uppercase">
              Last reviewed
            </dt>
            <dd className="mt-1 text-sm">{ISP_ORG.reviewed}</dd>
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
          <h2 className="font-display text-2xl text-navy">Purpose</h2>
          <p>
            NAIC Model 673 requires a licensee to have a written information
            security program for customer information. This page is that program
            for the public site, the consumer portal, and the BRIDGEt Console.
            The{" "}
            <Link className="text-blue" to="/hipaa">
              HIPAA
            </Link>{" "}
            and{" "}
            <Link className="text-blue" to="/glba">
              GLBA
            </Link>{" "}
            notices are the consumer-facing maps. This is the internal-facing
            one, published so a carrier can read it.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Customer information we hold</h2>
          <ul className="list-disc space-y-2 pl-5">
            {ISP_HOLDS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Safeguards</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ISP_SAFEGUARDS.map((item) => (
              <article key={item.t} className="card-elevated rounded-3xl bg-elevated p-5">
                <h3 className="font-sans text-base font-semibold text-navy">{item.t}</h3>
                <p className="mt-2 text-sm text-ink">{item.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy">Vendors</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Categories, not a signed-vendor roster. A name goes on a roster only
            after the contract is executed.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {ISP_VENDORS.map((item) => (
              <article key={item.t} className="card-elevated rounded-3xl bg-elevated p-5">
                <h3 className="font-sans text-base font-semibold text-navy">{item.t}</h3>
                <p className="mt-2 text-sm text-ink">{item.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Business Associate Agreements</h2>
          <ul className="list-disc space-y-2 pl-5">
            {BAA_POLICY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">If something goes wrong</h2>
          <ol className="list-decimal space-y-2 pl-5">
            {ISP_INCIDENT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="mt-12 space-y-4 text-sm leading-relaxed text-ink">
          <h2 className="font-display text-2xl text-navy">Evaluation</h2>
          <p>
            The Privacy Official reviews this program at least annually, and
            after a material system change or a security event. Last reviewed{" "}
            {ISP_ORG.reviewed}.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <CallLink>Call {PHONE_DISPLAY}</CallLink>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${ISP_ORG.email}?subject=BAA%20request`}>Request or send a BAA</a>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted">
          Last reviewed {ISP_ORG.reviewed}. {ISP_ORG.address}.
        </p>
      </main>
    </SiteShell>
  );
}
