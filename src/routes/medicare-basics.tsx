import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { PlanTypeTable } from "@/components/plan-type-table";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/medicare-basics")({
  component: BasicsPage,
  head: () =>
    pageHead({
      title: "Medicare basics",
      description:
        "Parts A, B, C, and D in plain language, plus how Advantage, Supplement, and Part D typically differ. Educational only — not a recommendation.",
      path: "/medicare-basics",
    }),
});

const parts = [
  {
    t: "Hospital protection (A)",
    d: "Inpatient care, skilled nursing facilities, and essential home health services.",
  },
  {
    t: "Medical protection (B)",
    d: "Physician services, preventive care, and necessary medical equipment.",
  },
  {
    t: "Advantage plans (C)",
    d: "All-in-one alternatives combining Parts A/B with additional benefits.",
  },
  {
    t: "Prescription plans (D)",
    d: "Medication protection to keep pharmacy costs manageable.",
  },
];

function BasicsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Education"
        title="Medicare, made clear."
        lede="Plain language. No scare tactics. This is education — not a recommendation. A licensed agent compares what is actually available in your area."
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {parts.map((p) => (
            <article key={p.t} className="rounded-3xl bg-elevated p-6 shadow-card">
              <h2 className="font-display text-xl text-navy">{p.t}</h2>
              <p className="mt-2 text-sm text-ink">{p.d}</p>
            </article>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy sm:text-3xl">How the plan types differ</h2>
          <p className="mt-3 max-w-2xl text-ink">
            This table is types, not every plan in your zip. Use it to learn the
            shapes. The Plan Choice Audit then walks the trade-offs for your
            situation.
          </p>
          <div className="mt-6">
            <PlanTypeTable />
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl text-navy">Key enrollment windows</h2>
          <div className="mt-4 space-y-4">
            <article className="rounded-2xl bg-elevated p-5 shadow-card">
              <h3 className="font-medium text-navy">Initial Enrollment</h3>
              <p className="mt-1 text-sm text-ink">
                A 7-month window around your 65th birthday. Enrolling on time helps
                you avoid lifetime late-enrollment penalties.
              </p>
            </article>
            <article className="rounded-2xl bg-elevated p-5 shadow-card">
              <h3 className="font-medium text-navy">Annual Election Period</h3>
              <p className="mt-1 text-sm text-ink">
                October 15 – December 7: your yearly chance to review Advantage and
                prescription coverage.
              </p>
            </article>
          </div>
        </section>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="blue">
            <Link to="/compare">Run the Plan Choice Audit</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/needs-analysis">Start a needs analysis</Link>
          </Button>
        </div>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
