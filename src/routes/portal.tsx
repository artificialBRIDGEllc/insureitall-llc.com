import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { CallLink } from "@/components/call-link";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY } from "@/lib/utils";

export const Route = createFileRoute("/portal")({
  component: PortalComingSoon,
  head: () =>
    pageHead({
      title: "Client portal — coming soon",
      description:
        "beneficiaryCONNECT is INSUREitALL's client portal, coming soon. Not live yet. Call a licensed agent in the meantime.",
      path: "/portal",
      index: false,
    }),
});

function PortalComingSoon() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="beneficiaryCONNECT"
        title="Your client portal is coming soon."
        lede="beneficiaryCONNECT is a separate product that will connect with your INSUREitALL coverage file. It isn't live yet — a licensed agent can help you today by phone."
      />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-elevated p-8 text-center shadow-card">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-soft text-blue">
            <Sparkles className="size-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl text-navy">Client portal coming soon</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            We're building beneficiaryCONNECT so you can manage your coverage
            file online. Until it launches, a licensed INSUREitALL agent is a
            phone call away.
          </p>
          <Button asChild className="mt-6 w-full" size="lg" variant="blue">
            <CallLink>Call {PHONE_DISPLAY}</CallLink>
          </Button>
        </div>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
