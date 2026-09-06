import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CtaBand } from "@/components/cta-band";
import { AreaField, Field, SelectField } from "@/components/field";
import { Honeypot } from "@/components/honeypot";
import { LeadConsent } from "@/components/lead-consent";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { submitOpsRequest } from "@/lib/ops";
import { track } from "@/lib/track";
import { pageHead } from "@/lib/seo";
import { PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/needs-analysis")({
  component: NeedsPage,
  head: () =>
    pageHead({
      title: "Medicare needs analysis",
      description:
        "Start with doctors, medications, and budget if you want. A licensed INSUREitALL agent uses this to listen — not to push a plan. Never a Medicare number or SSN.",
      path: "/needs-analysis",
    }),
});

function NeedsPage() {
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || busy) return;
    const form = new FormData(e.currentTarget);
    const zip = String(form.get("zip") ?? "");
    const doctors = String(form.get("doctors") ?? "");
    const medications = String(form.get("meds") ?? "");
    const budget = String(form.get("budget") ?? "");
    setBusy(true);
    setError(null);
    try {
      await submitOpsRequest({
        data: {
          kind: "needs",
          firstName: String(form.get("first") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          zip,
          doctors,
          medications,
          budget,
          website: String(form.get("website") ?? ""),
          consent: true,
        },
      });
      track("lead_kind", { kind: "needs" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message && !message.toLowerCase().includes("unexpected")
          ? message
          : "We couldn’t save that. Call us and we’ll take it from here.",
      );
      setBusy(false);
      return;
    }
    setBusy(false);
    setSent(true);
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Needs analysis"
        title="Start with what matters to you."
        lede="Doctors, medications, budget — only if you want. We use this so a licensed agent can listen, not to push a plan. Never type a Medicare number or Social Security number. No-cost, no-obligation."
      />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        {sent ? (
          <div className="rounded-3xl bg-elevated p-8 shadow-card">
            <h2 className="font-display text-2xl text-navy">Thank you.</h2>
            <p className="mt-2 text-ink">
              An agent will review what you shared and follow up. Prefer to talk now?
            </p>
            <Button asChild className="mt-6" variant="blue">
              <a href={PHONE_HREF}>Call now</a>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="relative space-y-4 rounded-3xl bg-elevated p-6 shadow-card">
            <Honeypot />
            <Field label="Your name" name="first" autoComplete="given-name" required />
            <Field label="Zip code" name="zip" required inputMode="numeric" autoComplete="postal-code" />
            <AreaField label="Doctors you want to keep (optional)" name="doctors" rows={2} />
            <AreaField label="Medications (optional)" name="meds" rows={2} />
            <p className="text-xs text-muted">
              Names only, and only if you want to. Never a Medicare number or Social
              Security number. Those stay off this site.
            </p>
            <SelectField label="Monthly budget comfort" name="budget" defaultValue="unsure">
              <option value="low">Keep premiums as low as possible</option>
              <option value="mid">Balance premium and copays</option>
              <option value="high">Predictable costs matter most</option>
              <option value="unsure">Not sure yet</option>
            </SelectField>
            <Field label="Phone (so we can follow up)" name="phone" type="tel" autoComplete="tel" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <LeadConsent id="needs-consent" checked={consent} onChange={setConsent} />
            {error ? (
              <p className="text-sm text-alert" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" size="lg" variant="blue" disabled={!consent || busy}>
              {busy ? "Sending…" : "Send to an agent"}
            </Button>
            <p className="text-center text-sm">
              <Link to="/lead" className="text-blue">
                Prefer a call back instead
              </Link>
            </p>
          </form>
        )}
      </main>
      <CtaBand />
    </SiteShell>
  );
}
