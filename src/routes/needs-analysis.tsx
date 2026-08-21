import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CtaBand } from "@/components/cta-band";
import { AreaField, Field, SelectField } from "@/components/field";
import { LeadConsent } from "@/components/lead-consent";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { savePortalProfile } from "@/lib/portal";
import { submitOpsRequest } from "@/lib/ops";
import { PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/needs-analysis")({ component: NeedsPage });

function NeedsPage() {
  const [sent, setSent] = useState(false);
  const [savedToFile, setSavedToFile] = useState(false);
  const [consent, setConsent] = useState(false);
  const { user } = useCurrentUserState();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    const form = new FormData(e.currentTarget);
    const zip = String(form.get("zip") ?? "");
    const doctors = String(form.get("doctors") ?? "");
    const medications = String(form.get("meds") ?? "");
    const budget = String(form.get("budget") ?? "");
    try {
      await submitOpsRequest({
        data: {
          kind: "needs",
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          zip,
          doctors,
          medications,
          budget,
        },
      });
    } catch {
      /* still thank them */
    }
    if (user) {
      try {
        await savePortalProfile({
          data: {
            role: "client",
            zip,
            doctors,
            medications,
            budget,
            notes: "",
          },
        });
        setSavedToFile(true);
      } catch {
        setSavedToFile(false);
      }
    }
    setSent(true);
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Needs analysis"
        title="Start with what matters to you."
        lede="Doctors, medications, budget. We use this so an agent can listen — not to push a plan. Signed in? We also save it to your portal file so it stays with you. No-cost, no-obligation."
      />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        {sent ? (
          <div className="rounded-3xl bg-elevated p-8 shadow-card">
            <h2 className="font-display text-2xl text-navy">Thank you.</h2>
            <p className="mt-2 text-ink">
              An agent will review what you shared and follow up. Prefer to talk now?
            </p>
            {savedToFile ? (
              <p className="mt-3 text-sm text-navy">
                Also saved to{" "}
                <Link to="/portal" className="text-blue">
                  your portal file
                </Link>
                .
              </p>
            ) : null}
            <Button asChild className="mt-6" variant="blue">
              <a href={PHONE_HREF}>Call now</a>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-elevated p-6 shadow-card">
            <Field label="Zip code" name="zip" required inputMode="numeric" autoComplete="postal-code" />
            <AreaField label="Doctors you want to keep" name="doctors" rows={2} />
            <AreaField label="Medications" name="meds" rows={2} />
            <SelectField label="Monthly budget comfort" name="budget" defaultValue="unsure">
              <option value="low">Keep premiums as low as possible</option>
              <option value="mid">Balance premium and copays</option>
              <option value="high">Predictable costs matter most</option>
              <option value="unsure">Not sure yet</option>
            </SelectField>
            <Field label="Phone (so we can follow up)" name="phone" type="tel" autoComplete="tel" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <LeadConsent id="needs-consent" checked={consent} onChange={setConsent} />
            <Button type="submit" className="w-full" size="lg" variant="blue" disabled={!consent}>
              Send to an agent
            </Button>
            <p className="text-center text-sm">
              {user ? (
                <span className="text-muted">We’ll also save this to your portal file.</span>
              ) : (
                <Link to="/portal" className="text-blue">
                  Create a portal account so this file stays with you
                </Link>
              )}
            </p>
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
