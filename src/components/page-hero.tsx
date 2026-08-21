import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
}) {
  return (
    <section className="hero-glow relative overflow-hidden bg-navy text-elevated">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-xs font-semibold tracking-[0.16em] text-mist uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.12] text-elevated sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-elevated/80">{lede}</p>
      </div>
    </section>
  );
}
