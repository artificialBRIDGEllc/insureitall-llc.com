import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SelectField } from "@/components/field";
import { SiteShell } from "@/components/site-shell";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { Button } from "@/components/ui/button";
import {
  AUDIT_DISCLAIMER,
  runPlanAudit,
  type CostStyle,
  type CoverageNow,
  type Drugs,
  type PlanAuditInput,
  type Yn,
} from "@/lib/plan-audit";
import { MEDICARE_2026 } from "@/lib/medicare-2026";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";
import { track } from "@/lib/track";

export const Route = createFileRoute("/compare")({
  component: PlanAuditPage,
  head: () =>
    pageHead({
      title: "Plan Choice Audit",
      description:
        "Educational trade-off ledger for Medicare plan types — not a quote and not every plan in your zip. A licensed agent compares what is actually offered where you live.",
      path: "/compare",
    }),
});

const blank: PlanAuditInput = {
  coverageNow: "unsure",
  keepDoctors: "unsure",
  travel: "unsure",
  drugs: "moderate",
  extras: "unsure",
  cost: "unsure",
  medicaid: "no",
  facility: "no",
};

function PlanAuditPage() {
  const [form, setForm] = useState<PlanAuditInput>(blank);
  const [ran, setRan] = useState(false);
  const ledger = ran ? runPlanAudit(form) : [];

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setRan(true);
    track("audit_complete", { ...form });
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={`Plan Choice Audit · ${MEDICARE_2026.planYear} figures`}
        title="Audit the type — not every plan."
        lede="What you would gain, sacrifice, and need to watch. Not a recommendation. Not a quote. Type-level only, so a licensed agent can compare what is actually offered where you live."
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-3xl bg-elevated p-6 shadow-card sm:grid-cols-2"
        >
          <SelectField
            label="What do you have now?"
            value={form.coverageNow}
            onChange={(e) =>
              setForm((f) => ({ ...f, coverageNow: e.target.value as CoverageNow }))
            }
          >
            <option value="unsure">Not sure</option>
            <option value="original">Original Medicare</option>
            <option value="advantage">Medicare Advantage</option>
            <option value="medigap">Original + Supplement</option>
          </SelectField>
          <SelectField
            label="Need to keep specific doctors?"
            value={form.keepDoctors}
            onChange={(e) => setForm((f) => ({ ...f, keepDoctors: e.target.value as Yn }))}
          >
            <option value="unsure">Not sure</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </SelectField>
          <SelectField
            label="Do you travel or split time?"
            value={form.travel}
            onChange={(e) => setForm((f) => ({ ...f, travel: e.target.value as Yn }))}
          >
            <option value="unsure">Not sure</option>
            <option value="yes">Yes</option>
            <option value="no">Mostly local</option>
          </SelectField>
          <SelectField
            label="Prescription use"
            value={form.drugs}
            onChange={(e) => setForm((f) => ({ ...f, drugs: e.target.value as Drugs }))}
          >
            <option value="light">Few or none</option>
            <option value="moderate">A handful</option>
            <option value="heavy">Several or high-cost</option>
          </SelectField>
          <SelectField
            label="Do extra benefits matter (dental, vision, hearing)?"
            value={form.extras}
            onChange={(e) => setForm((f) => ({ ...f, extras: e.target.value as Yn }))}
          >
            <option value="unsure">Not sure</option>
            <option value="yes">Yes</option>
            <option value="no">Not really</option>
          </SelectField>
          <SelectField
            label="Cost style"
            value={form.cost}
            onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value as CostStyle }))}
          >
            <option value="unsure">Not sure</option>
            <option value="premium">Keep the premium low</option>
            <option value="predictable">Predictable when I use care</option>
          </SelectField>
          <SelectField
            label="Do you also have Medicaid?"
            value={form.medicaid}
            onChange={(e) => setForm((f) => ({ ...f, medicaid: e.target.value as Yn }))}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="unsure">Not sure</option>
          </SelectField>
          <SelectField
            label="Nursing home or daily long-term help?"
            value={form.facility}
            onChange={(e) => setForm((f) => ({ ...f, facility: e.target.value as Yn }))}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="unsure">Not sure</option>
          </SelectField>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" variant="blue">
              {ran ? "Update the audit" : "Run the audit"}
            </Button>
          </div>
        </form>

        {ran ? (
          <div className="mt-10 space-y-4">
            <p className="max-w-3xl text-sm text-ink">{AUDIT_DISCLAIMER}</p>
            <div className="grid gap-4 lg:grid-cols-3">
              {ledger.map((row) => (
                <article key={row.id} className="card-elevated rounded-3xl bg-elevated p-6">
                  <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
                    Type
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-navy">{row.title}</h2>
                  <p className="mt-2 text-sm text-ink">{row.when}</p>
                  <Block label="Gained" items={row.gained} />
                  <Block label="Sacrificed" items={row.sacrificed} />
                  <Block label="Watch" items={row.watch} />
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <TpmoDisclaimer withNonAffiliation className="mt-8 text-muted" />

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="blue">
            <a href={PHONE_HREF}>Call {PHONE_DISPLAY} — licensed agent</a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/medicare-basics">Read the type table</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/needs-analysis">Needs analysis</Link>
          </Button>
        </div>
      </main>
      <CtaBand />
    </SiteShell>
  );
}

function Block({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{label}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
