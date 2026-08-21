import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BridgetOrbit } from "@/components/bridget-orbit";
import { BridgetWordmark } from "@/components/bridget-wordmark";
import { CallLink } from "@/components/call-link";
import { CtaBand } from "@/components/cta-band";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY } from "@/lib/utils";

export const Route = createFileRoute("/bridget")({
  component: BridgetPage,
  head: () => ({
    meta: [
      { title: "BRIDGEt — Your Medicare advocate | INSUREitALL" },
      {
        name: "description",
        content:
          "BRIDGEt is your Medicare advocate. Humor when it helps, straight talk when it matters. She never enrolls you — she walks you to a licensed agent when you’re ready.",
      },
    ],
  }),
});

const steps = [
  {
    q: "What matters most right now?",
    options: ["Keeping my doctors", "Lower monthly cost", "Drug costs", "I’m not sure yet"],
  },
  {
    q: "How do you feel about networks?",
    options: [
      "I want to keep Original Medicare + a supplement",
      "I’m open to an Advantage plan",
      "Explain the difference first",
    ],
  },
  {
    q: "When would you like to talk to a licensed agent?",
    options: ["Now — I’ll call", "Have someone call me", "I’m still learning"],
  },
];

function BridgetPage() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = i >= steps.length;

  return (
    <SiteShell>
      <section className="hero-glow relative overflow-hidden bg-navy text-elevated">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">
            Your Medicare advocate
          </p>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl">
            <BridgetWordmark invert loop className="text-5xl sm:text-6xl" />
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-elevated/80">
            Laid-back, wise, and on task. Humor when it helps. Straight talk when
            it matters. She never enrolls you — she walks you to a licensed agent
            when you’re ready.
          </p>
          <div className="mt-8 w-full">
            <BridgetOrbit />
          </div>
          <p className="mt-6 max-w-xl text-sm text-elevated/60">
            BRIDGEt is a Medicare advocate, not a licensed insurance agent, and is not
            connected with or endorsed by the U.S. Government or the federal
            Medicare program.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="card-elevated rounded-3xl bg-elevated p-6">
          {!done ? (
            <>
              <p className="text-xs text-muted">
                Question {i + 1} of {steps.length}
              </p>
              <h2 className="mt-2 font-display text-2xl text-navy">{steps[i].q}</h2>
              <div className="mt-5 grid gap-2">
                {steps[i].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="rounded-xl border border-border px-4 py-3 text-left text-sm text-navy shadow-elevation-1 hover:bg-soft"
                    onClick={() => {
                      setAnswers((a) => [...a, opt]);
                      setI((n) => n + 1);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <h2 className="font-display text-2xl text-navy">Here is a simple next step.</h2>
              <p className="mt-3 text-ink">
                You said: {answers.join(" · ")}. A licensed agent can compare the
                specific plans in your zip — BRIDGEt cannot.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="blue">
                  <CallLink>Call {PHONE_DISPLAY}</CallLink>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/lead">Request a call back</Link>
                </Button>
              </div>
              <button
                type="button"
                className="mt-4 text-sm text-blue"
                onClick={() => {
                  setI(0);
                  setAnswers([]);
                }}
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
