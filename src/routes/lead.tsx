import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CtaBand } from "@/components/cta-band";
import { AreaField, Field, SelectField } from "@/components/field";
import { Honeypot } from "@/components/honeypot";
import { LeadConsent } from "@/components/lead-consent";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";
import { submitOpsRequest } from "@/lib/ops";
import { track } from "@/lib/track";

export const Route = createFileRoute("/lead")({
  component: LeadPage,
  head: () =>
    pageHead({
      title: "Request a call back",
      description:
        "Leave a window that works. A licensed INSUREitALL agent will call you — no scripts, no pressure. Or call +1 908-827-6223 now.",
      path: "/lead",
    }),
});

function LeadPage() {
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || busy) return;
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await submitOpsRequest({
        data: {
          kind: "callback",
          firstName: String(form.get("first") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          callbackWindow: String(form.get("window") ?? ""),
          notes: String(form.get("notes") ?? ""),
          website: String(form.get("website") ?? ""),
          consent: true,
        },
      });
      track("lead_kind", { kind: "callback" });
      setSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message && !message.toLowerCase().includes("unexpected")
          ? message
          : "We couldn’t save that. Call us and we’ll take it from here.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Call back"
        title="Have us call you instead."
        lede={`Leave a window that works. A licensed agent will reach out — no scripts, no pressure. You can always call ${PHONE_DISPLAY} now.`}
      />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        {sent ? (
          <div className="rounded-3xl bg-elevated p-8 shadow-card">
            <h2 className="font-display text-2xl text-navy">We have your request.</h2>
            <p className="mt-2 text-ink">
              An agent will call during the window you chose. Nothing is sold on this
              page. If you need someone sooner, call us.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={PHONE_HREF}>Call now</a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Back home</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="relative space-y-4 rounded-3xl bg-elevated p-6 shadow-card">
            <Honeypot />
            <Field label="First name" name="first" autoComplete="given-name" required />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <SelectField label="Best time" name="window" defaultValue="morning">
              <option value="morning">Morning (9–12 ET)</option>
              <option value="mid">Midday (12–3 ET)</option>
              <option value="afternoon">Afternoon (3–6 ET)</option>
            </SelectField>
            <AreaField
              label="Notes (optional)"
              name="notes"
              rows={3}
            />
            <p className="text-xs text-muted">
              Never a Medicare number or Social Security number. Doctor or
              medication names are optional.
            </p>
            <LeadConsent checked={consent} onChange={setConsent} />
            {error ? (
              <p className="text-sm text-alert" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" size="lg" disabled={!consent || busy}>
              {busy ? "Sending…" : "Request a call back"}
            </Button>
          </form>
        )}
        <TpmoDisclaimer withNonAffiliation className="mt-8 text-muted" />
      </main>
      <CtaBand />
    </SiteShell>
  );
}
