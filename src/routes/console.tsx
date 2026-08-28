import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { bridgetConsoleUrl } from "@/lib/bridget-console";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/console")({
  beforeLoad: () => {
    const url = bridgetConsoleUrl();
    if (url) throw redirect({ href: url });
  },
  component: ConsoleMoved,
  head: () =>
    pageHead({
      title: "BRIDGEt Console",
      description: "The staff desk moved to BRIDGEt Console.",
      path: "/console",
      index: false,
    }),
});

/** Only renders when VITE_BRIDGET_CONSOLE_URL isn't configured yet (beforeLoad redirects otherwise). */
function ConsoleMoved() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface px-4">
      <div className="card-elevated max-w-md rounded-3xl bg-elevated p-8 text-center">
        <h1 className="font-display text-3xl text-navy">The console moved.</h1>
        <p className="mt-3 text-ink">
          BRIDGEt Console is now its own product. Ask an admin for the workspace link, or check{" "}
          <code className="rounded bg-soft px-1 py-0.5 text-sm">VITE_BRIDGET_CONSOLE_URL</code> in
          this site's deploy config.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
