import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/screener")({ component: ScreenerPage });

function ScreenerPage() {
  const [size, setSize] = useState(1);
  const [income, setIncome] = useState(24000);
  const [show, setShow] = useState(false);

  const hints = useMemo(() => {
    const extraHelp = income < 23000 + (size - 1) * 8000;
    const premium = income < 18000 + (size - 1) * 6500;
    const snap = income < 20000 + (size - 1) * 7000;
    return { extraHelp, premium, snap };
  }, [size, income]);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Anonymous · Educational"
        title="See what you might be able to get."
        lede="Household and income only — not your health. Nothing is saved. This is not an application."
      />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="space-y-6 rounded-3xl bg-elevated p-6 shadow-card">
          <label className="block text-sm font-medium text-navy">
            Household size: {size}
            <input
              type="range"
              min={1}
              max={6}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-3 w-full accent-blue"
            />
          </label>
          <label className="block text-sm font-medium text-navy">
            Approximate yearly household income: ${income.toLocaleString()}
            <input
              type="range"
              min={8000}
              max={90000}
              step={1000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="mt-3 w-full accent-blue"
            />
          </label>
          <Button type="button" className="w-full" variant="blue" onClick={() => setShow(true)}>
            See possible programs
          </Button>
        </div>

        {show ? (
          <div className="mt-8 space-y-4">
            <Result
              title="Extra Help (Part D)"
              ok={hints.extraHelp}
              body="May lower prescription costs if income is near these ranges. A licensed agent can walk through LIS with you."
            />
            <Result
              title="Medicare Savings Programs"
              ok={hints.premium}
              body="May help with Part B premiums and some cost-sharing, depending on your state."
            />
            <Result
              title="Nutrition assistance (SNAP)"
              ok={hints.snap}
              body="Food assistance is separate from Medicare. This is a hint only — apply through your state."
            />
            <p className="text-sm text-muted">
              This tool is not affiliated with CMS. Confirm eligibility with Medicare.gov
              or your state agency.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/lead">Talk to an agent</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/bridget">Ask BRIDGEt</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </main>
      <CtaBand />
    </SiteShell>
  );
}

function Result({ title, ok, body }: { title: string; ok: boolean; body: string }) {
  return (
    <article className="rounded-2xl bg-elevated p-5 shadow-card">
      <p className="text-xs font-semibold tracking-wide text-blue uppercase">
        {ok ? "May be worth checking" : "Less likely at this income"}
      </p>
      <h2 className="mt-1 font-display text-xl text-navy">{title}</h2>
      <p className="mt-2 text-sm text-ink">{body}</p>
    </article>
  );
}
