import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/utils";

export const Route = createFileRoute("/compare")({ component: ComparePage });

const rows = [
  {
    label: "How coverage works",
    advantage: "One plan that usually bundles hospital, medical, and often drugs",
    supplement: "Original Medicare (A+B) plus a Medigap policy for cost-sharing",
    pdp: "Stand-alone drug coverage that pairs with Original Medicare",
  },
  {
    label: "Doctors",
    advantage: "Typically a network (HMO/PPO). Referrals may apply.",
    supplement: "Any provider that accepts Medicare — nationwide in most cases",
    pdp: "Pharmacies and formularies vary by plan",
  },
  {
    label: "Monthly cost pattern",
    advantage: "Often lower premium; copays at the point of care",
    supplement: "Higher premium; more predictable when you use care",
    pdp: "Premium + deductible + copays/coinsurance for drugs",
  },
  {
    label: "Extra benefits",
    advantage: "Sometimes dental, vision, hearing, fitness",
    supplement: "Generally does not add extras beyond cost help",
    pdp: "Focused on prescriptions, not extras",
  },
  {
    label: "Best to discuss if",
    advantage: "You want one card and can work within a network",
    supplement: "You travel or want to keep specific specialists",
    pdp: "You stay on Original Medicare and need drug coverage",
  },
];

function regionFromZip(zip: string) {
  const n = Number(zip.slice(0, 3));
  if (Number.isNaN(n)) return null;
  if (n >= 750 && n <= 799) return "Texas";
  if (n >= 320 && n <= 349) return "Florida";
  if (n >= 300 && n <= 319) return "Georgia";
  if (n >= 350 && n <= 369) return "Alabama";
  if (n >= 700 && n <= 714) return "Louisiana";
  if (n >= 730 && n <= 749) return "Oklahoma";
  if (n >= 480 && n <= 499) return "Michigan";
  if (n >= 386 && n <= 397) return "Mississippi";
  if (n >= 150 && n <= 196) return "Pennsylvania";
  if (n >= 430 && n <= 458) return "Ohio";
  if (n >= 290 && n <= 299) return "South Carolina";
  if (n >= 270 && n <= 289) return "North Carolina";
  if (n >= 370 && n <= 385) return "Tennessee";
  return "your area";
}

function ComparePage() {
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState("");

  const region = useMemo(
    () => (submitted.length === 5 ? regionFromZip(submitted) : null),
    [submitted],
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const z = zip.replace(/\D/g, "").slice(0, 5);
    if (z.length === 5) setSubmitted(z);
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Educational compare"
        title="Compare plan types."
        lede="This is not a list of every plan in your zip. It shows how Advantage, Supplement, and Part D typically differ so a licensed agent can compare what is actually offered where you live."
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col gap-3 rounded-3xl bg-elevated p-5 shadow-card sm:flex-row sm:items-end"
        >
          <label className="block flex-1 text-sm font-medium text-navy">
            Zip code
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              required
              minLength={5}
              className="mt-1.5 w-full rounded-xl border border-border px-3 py-3"
              placeholder="75078"
            />
          </label>
          <Button type="submit" size="lg" variant="blue">
            Compare for this zip
          </Button>
        </form>

        {submitted ? (
          <p className="mt-6 text-sm text-ink">
            Showing type-level differences for zip{" "}
            <span className="font-medium text-navy">{submitted}</span>
            {region ? ` (${region})` : ""}. Specific carriers change by county — an
            agent will pull the current options.
          </p>
        ) : (
          <p className="mt-6 text-sm text-muted">Enter a zip to personalize the compare.</p>
        )}

        <div className="mt-8 overflow-x-auto rounded-3xl bg-elevated shadow-card">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-navy text-elevated">
              <tr>
                <th className="px-4 py-3 font-medium"> </th>
                <th className="px-4 py-3 font-medium">Medicare Advantage</th>
                <th className="px-4 py-3 font-medium">Medicare Supplement</th>
                <th className="px-4 py-3 font-medium">Part D (drugs)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-border align-top">
                  <th className="px-4 py-3 font-medium text-navy">{r.label}</th>
                  <td className="px-4 py-3 text-ink">{r.advantage}</td>
                  <td className="px-4 py-3 text-ink">{r.supplement}</td>
                  <td className="px-4 py-3 text-ink">{r.pdp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TpmoDisclaimer withNonAffiliation className="mt-4 text-muted" />

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="blue">
            <a href={PHONE_HREF}>Call {PHONE_DISPLAY} to compare actual plans</a>
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
