import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { CallLink } from "@/components/call-link";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY } from "@/lib/utils";

function StatusChrome({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col bg-surface text-fg">
      <div className="bg-navy px-4 py-4 sm:px-6">
        <Link to="/" aria-label="INSUREitALL home">
          <Logo variant="wordmark" color="white" className="h-8" />
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">INSUREitALL</p>
        <h1 className="mt-3 font-display text-4xl text-navy">{title}</h1>
        <p className="mt-4 text-ink">{lede}</p>
        {children}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <CallLink>Call {PHONE_DISPLAY}</CallLink>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back home</Link>
          </Button>
        </div>
        <p className="mt-8 text-xs text-muted">
          Licensed agents. No pressure. Not connected with or endorsed by the U.S.
          Government or the federal Medicare program.
        </p>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <StatusChrome
      title="That page isn’t here."
      lede="The link may be old. A licensed agent is, though — call and we’ll get you to the right place."
    />
  );
}

export function AppErrorPage({ message }: { message?: string }) {
  return (
    <StatusChrome
      title="Something went sideways."
      lede="Nothing you typed is lost on our end of the phone. Reload, or call and we’ll pick it up."
    >
      {message ? (
        <p className="mt-3 text-sm text-muted" role="status">
          If it keeps happening, mention this to the agent: the page could not finish loading.
        </p>
      ) : null}
    </StatusChrome>
  );
}
