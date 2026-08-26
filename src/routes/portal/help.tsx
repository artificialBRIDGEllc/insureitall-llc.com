import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalFrame } from "@/components/portal/shell";
import { CallLink } from "@/components/call-link";
import { BridgetWordmark } from "@/components/bridget-wordmark";
import { ConsoleCard } from "@/components/console/ui";
import { pageHead } from "@/lib/seo";
import { HOURS, PHONE_DISPLAY, TTY } from "@/lib/utils";

export const Route = createFileRoute("/portal/help")({
  component: PortalHelpPage,
  head: () =>
    pageHead({
      title: "Help",
      description: "Call a licensed INSUREitALL agent. BRIDGEt does not enroll.",
      path: "/portal/help",
      index: false,
    }),
});

function PortalHelpPage() {
  return (
    <PortalFrame title="Help">
      <div className="grid gap-4 lg:grid-cols-2">
        <ConsoleCard>
          <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
            Licensed agent
          </p>
          <h2 className="mt-2 font-display text-3xl text-navy">{PHONE_DISPLAY}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {HOURS}. {TTY}. Calls are recorded for quality, training, and
            compliance. This is not an enrollment.
          </p>
          <CallLink className="mt-5 inline-flex min-h-11 items-center rounded-full bg-blue px-5 text-sm font-semibold text-elevated">
            Call a licensed agent
          </CallLink>
        </ConsoleCard>
        <ConsoleCard>
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            Advocate
          </p>
          <h2 className="mt-2 font-display text-3xl text-navy">
            <BridgetWordmark className="text-[1.85rem]" />
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Older sister energy. Humor, then the next right step. She is not a
            licensed agent, not Medicare, and she never enrolls anyone.
          </p>
          <Link to="/bridget" className="mt-5 inline-flex text-sm font-semibold text-blue">
            Meet BRIDGEt on the public site →
          </Link>
        </ConsoleCard>
      </div>
      <p className="mt-6 text-xs text-muted">
        fileBRIDGE is owned and operated by artificialBRIDGE LLC, a Wyoming
        single-member LLC — not INSUREitALL, not Medicare.{" "}
        <Link to="/ab/privacy" className="text-blue">
          privacy
        </Link>{" "}
        ·{" "}
        <Link to="/ab/terms" className="text-blue">
          terms
        </Link>{" "}
        ·{" "}
        <Link to="/ab" className="text-blue">
          entity
        </Link>
        . Insure It All is not connected with or endorsed by the U.S. Government
        or the federal Medicare program.
      </p>
    </PortalFrame>
  );
}
