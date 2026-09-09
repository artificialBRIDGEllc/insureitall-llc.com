import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  HeartHandshake,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { CallLink } from "@/components/call-link";
import { SiteShell } from "@/components/site-shell";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { BRIDGET_AVATAR } from "@/lib/bridget-assets";
import { HOME_FAQS, faqJsonLd, pageHead } from "@/lib/seo";
import { HOURS, PHONE_DISPLAY, TTY } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    pageHead({
      title: "Medicare guidance from licensed agents",
      description:
        "Licensed INSUREitALL agents help you understand Medicare Advantage, Supplement, and Part D. No cost, no pressure. Call +1 813-742-6798.",
      path: "/",
    }),
});

const plans = [
  {
    title: "Medicare Advantage",
    body: "All-in-one plans (Part C) that bundle hospital, medical, and often drug coverage, sometimes with extra benefits.",
    fit: "You want one plan that combines your coverage.",
  },
  {
    title: "Medicare Supplement",
    body: "Medigap plans that work alongside Original Medicare to help with out-of-pocket costs like copays and deductibles.",
    fit: "You want to keep Original Medicare and add predictability.",
  },
  {
    title: "Prescription Drug Plans",
    body: "Part D plans that help cover the cost of prescription medications, with formularies that vary by plan.",
    fit: "You take regular medications and want to manage drug costs.",
  },
];

const faqs = HOME_FAQS;

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <SiteShell>
      <JsonLd data={faqJsonLd(HOME_FAQS)} />
      <section className="hero-glow relative overflow-hidden bg-navy text-elevated">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-mist uppercase">
              Licensed Medicare Agents · No cost to you
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.12] text-elevated sm:text-5xl lg:text-[3.4rem]">
              We do the <em className="italic text-mist">hard part.</em>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-elevated/80">
              Medicare is genuinely complicated. Comparing plans, checking whether
              your doctors are in network, tracking which prescriptions are covered,
              catching the deadlines — that part is ours. Yours is to tell us what
              matters to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="blue">
                <CallLink>
                  <Phone className="size-4" />
                  Call {PHONE_DISPLAY}
                </CallLink>
              </Button>
              <Button asChild size="lg" variant="soft">
                <Link to="/lead">Request a Call Back</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-elevated/55">
              Calls are recorded for quality and compliance. Full disclosure in the footer.
            </p>
          </div>

          <div className="card-elevated rounded-[1.6rem] bg-elevated p-7 sm:p-8">
            <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
              Speak with an agent
            </p>
            <h2 className="mt-2 font-display text-2xl text-navy">We start by listening.</h2>
            <p className="mt-3 text-ink">
              No scripts. A licensed agent takes the time to understand your doctors,
              medications, and budget — before mentioning a single plan.
            </p>
            <p className="mt-6 text-center font-display text-3xl text-navy">{PHONE_DISPLAY}</p>
            <p className="mt-1 text-center text-sm text-muted">
              {HOURS} · {TTY}
            </p>
            <Button asChild className="mt-6 w-full" size="lg" variant="blue">
              <CallLink>Call Now</CallLink>
            </Button>
            <p className="my-4 text-center text-xs text-muted">— or —</p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/lead">Have us call you instead →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-elevated">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {[
            "Licensed & certified",
            "Multiple carriers",
            "No cost to you",
            "Recorded for compliance",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium text-navy">
              <ShieldCheck className="size-4 text-blue" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              Educational · Not a quote
            </p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Audit the type. Then talk to a <em className="italic text-blue">human.</em>
            </h2>
            <p className="mt-4 max-w-xl text-ink">
              The Plan Choice Audit is a trade-off ledger for Advantage, Original
              Medicare, and Supplement — gained, sacrificed, watch. Not every plan
              in your zip. A licensed agent compares what is actually offered.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="blue">
                <Link to="/compare">Run the Plan Choice Audit</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/medicare-basics">Medicare basics</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl bg-soft p-8">
            <p className="font-display text-xl text-navy">Takes a few minutes.</p>
            <p className="mt-2 text-ink">No Medicare number. No enrollment.</p>
            <ul className="mt-6 space-y-3 text-sm text-ink">
              {["What you have now", "Doctors, drugs, travel", "Gained / sacrificed / watch"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-blue" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">How it works</p>
          <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
            Three simple <em className="italic text-blue">steps.</em>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Call a licensed agent",
                d: "Reach a real, licensed agent by phone. Tell them about your doctors, medications, and budget.",
              },
              {
                n: "2",
                t: "Compare your options",
                d: "Your agent explains the plan types in plain language and helps you compare what fits.",
              },
              {
                n: "3",
                t: "Enroll with confidence",
                d: "When you’re ready — and only then — we help you enroll. Our team stays with you after.",
              },
            ].map((s) => (
              <div key={s.n} className="card-elevated rounded-3xl bg-surface p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-navy font-display text-elevated">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-xl text-navy">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">What we help with</p>
        <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
          The Medicare plan <em className="italic text-blue">types.</em>
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article key={p.title} className="card-elevated rounded-3xl bg-elevated p-6">
              <h3 className="font-display text-xl text-navy">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink">{p.body}</p>
              <p className="mt-4 text-sm font-medium text-blue">Good to discuss if {p.fit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-elevated">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-mist uppercase">Why Insure It All</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Guidance you can <em className="italic">actually talk to.</em>
            </h2>
            <p className="mt-4 leading-relaxed text-elevated/80">
              Our CEO Ryan Butterfield spent 20 years inside Medicare — first as an
              agent, then as a carrier executive. He built INSUREitALL to be the
              opposite of the industry's worst habits.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "We take calls — but we’re not a call-center culture",
                "No scripts, no quotas pushing one plan",
                "Multiple carriers compared honestly, including trade-offs",
                "Still here after enrollment",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <HeartHandshake className="mt-0.5 size-4 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { k: "$0", v: "Cost to speak with us" },
              { k: "20", v: "Years in Medicare" },
              { k: "1 call", v: "To get clear answers" },
            ].map((m) => (
              <div key={m.v} className="rounded-2xl bg-elevated/8 p-4 text-center">
                <p className="font-display text-2xl sm:text-3xl">{m.k}</p>
                <p className="mt-1 text-xs text-elevated/70">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl text-navy">You probably want to know…</h2>
        <div className="mt-8 divide-y divide-border rounded-3xl bg-elevated shadow-card">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-navy"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                {f.q}
                <span className="text-blue">{openFaq === i ? "–" : "+"}</span>
              </button>
              {openFaq === i ? (
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink">{f.a}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-elevated">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-mist uppercase">
              beneficiaryCONNECT
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Continuity when the <em className="italic">relationship changes.</em>
            </h2>
            <p className="mt-4 leading-relaxed text-elevated/80">
              beneficiaryCONNECT is a separate client portal that will connect
              with your INSUREitALL coverage file. It's coming soon — not live
              yet.
            </p>
            <p className="welcome-home">Welcome home.</p>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-3xl bg-elevated/8 p-8">
            <p className="text-sm text-elevated/80">
              Express consent. Scoped fields. Not an enrollment.
            </p>
            <Button asChild size="lg" variant="soft">
              <Link to="/portal">Client Portal — coming soon</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="card-elevated flex flex-col items-center gap-6 rounded-3xl bg-elevated p-8 text-center">
            <img
              src={BRIDGET_AVATAR.bust}
              alt="BRIDGEt"
              width={128}
              height={128}
              className="size-32 rounded-full bg-navy object-cover object-top shadow-elevation-2"
            />
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
                Your Medicare advocate
              </p>
              <h2 className="mt-2 font-display text-3xl text-navy">
                Warm up with <em className="italic text-blue">BRIDGEt</em> first.
              </h2>
              <p className="mt-3 text-ink">
                The older sister who keeps you on task. A few questions, a little
                humor, then a licensed agent when you’re ready. No-cost, no-obligation.
              </p>
            </div>
            <Button asChild size="lg" variant="blue">
              <Link to="/bridget">
                <Sparkles className="size-4" />
                Start with BRIDGEt
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <TpmoDisclaimer withNonAffiliation className="text-muted" />
      </section>

      <CtaBand />
    </SiteShell>
  );
}