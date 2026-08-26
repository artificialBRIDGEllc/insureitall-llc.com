import { Link, Outlet } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AbLockup } from "@/components/ab-mark";
import { AB_ORIGIN, AB_PRODUCT, AB_TAGLINE } from "@/lib/ab";
import { AB_EFFECTIVE, AB_EMAIL, AB_ENTITY } from "@/lib/ab-legal";

function useManrope() {
  useEffect(() => {
    if (document.getElementById("ab-manrope")) return;
    const link = document.createElement("link");
    link.id = "ab-manrope";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

export function AbLegalShell({ children }: { children: ReactNode }) {
  useManrope();
  return (
    <div className="ab-portal min-h-dvh">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-8 sm:px-6">
        <a href={AB_ORIGIN} className="text-[inherit]">
          <AbLockup />
        </a>
        <p className="text-[0.65rem] tracking-[0.28em] text-[var(--ab-ink-3)]">{AB_TAGLINE}</p>
      </header>
      <nav className="mx-auto flex max-w-3xl gap-4 px-4 text-sm text-[var(--ab-ink-2)] sm:px-6">
        <Link to="/ab">entity</Link>
        <Link to="/ab/privacy">privacy</Link>
        <Link to="/ab/terms">terms</Link>
        <Link to="/portal">{AB_PRODUCT}</Link>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-16 text-xs text-[var(--ab-ink-3)] sm:px-6">
        {AB_ENTITY.legalName} · wyoming single-member llc · {AB_EMAIL} · effective{" "}
        {AB_EFFECTIVE}. not legal advice. not insurance. not medicare.
      </footer>
    </div>
  );
}

export function AbLegalLayout() {
  return (
    <AbLegalShell>
      <Outlet />
    </AbLegalShell>
  );
}
