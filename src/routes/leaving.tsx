import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { LEAVE_DEST, LEAVE_POINTS, type LeaveDest } from "@/lib/leaving";
import { pageHead } from "@/lib/seo";
import { SITE_LEGAL } from "@/lib/seo";

export const Route = createFileRoute("/leaving")({
  component: LeavingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    to: search.to === "filebridge" ? "filebridge" : "filebridge",
  }),
  head: () =>
    pageHead({
      title: "You are leaving INSUREitALL",
      description:
        "fileBRIDGE is a third-party artificialBRIDGE LLC site. Not Medicare. Not an enrollment.",
      path: "/leaving",
    }),
});

function LeavingPage() {
  const { to } = Route.useSearch();
  const dest = LEAVE_DEST[to as LeaveDest] ?? LEAVE_DEST.filebridge;

  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Third-party site
        </p>
        <h1 className="mt-3 font-display text-4xl text-navy">
          You are leaving {SITE_LEGAL}.
        </h1>
        <p className="mt-4 text-lg text-ink">
          Next stop: <strong>{dest.product}</strong>, owned and operated by {dest.operator}{" "}
          ({dest.publicUrl.replace("https://", "")}).
        </p>
        <ul className="mt-8 list-disc space-y-3 pl-5 text-sm leading-relaxed text-ink">
          {LEAVE_POINTS.map((line) => (
            <li key={line.slice(0, 24)}>{line}</li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="blue">
            <Link to="/portal">Continue to {dest.product}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/">Stay on INSUREitALL</Link>
          </Button>
        </div>
        <p className="mt-8 text-xs text-muted">
          Not an endorsement of a plan or carrier.{" "}
          <Link to="/privacy" className="text-blue">
            INSUREitALL privacy
          </Link>
          {" · "}
          <Link to="/ab/privacy" className="text-blue">
            artificialBRIDGE privacy
          </Link>
          {" · "}
          <Link to="/ab" className="text-blue">
            who operates fileBRIDGE
          </Link>
          . TCPA consent on this site does not transfer.
        </p>
        <TpmoDisclaimer withNonAffiliation className="mt-6 text-muted" />
      </main>
    </SiteShell>
  );
}
