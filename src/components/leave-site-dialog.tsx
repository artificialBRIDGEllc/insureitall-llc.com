import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { CallLink } from "@/components/call-link";
import { TpmoDisclaimer } from "@/components/tpmo-disclaimer";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";
import { PHONE_DISPLAY } from "@/lib/utils";

/**
 * Leave-site interstitial (Phase R R9) shown before any outbound link to the
 * third-party Sunfire self-enrollment platform. Names the different operator,
 * different privacy terms, and how to get back to an INSUREitALL agent.
 * "Continue" is a real <a> so the new tab opens from the user's click and
 * isn't popup-blocked.
 */
export function LeaveSiteDialog({ href, children }: { href: string; children: ReactNode }) {
  return (
    <AlertDialog.Root onOpenChange={(open) => open && track("enroll_leave_prompt")}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[100] bg-navy-deep/60 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[101] max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-elevated p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
            You're leaving INSUREitALL
          </p>
          <AlertDialog.Title className="mt-2 font-display text-2xl text-navy">
            Continue to a third-party enrollment site?
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink">
              <p>
                You're about to open a{" "}
                <strong>self-enrollment website operated by SunFireMatrix, Inc.</strong> It is a
                separate company, not INSUREitALL, and not the government or Medicare.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Information you enter there is governed by <strong>that site's</strong> privacy
                  policy and terms, not ours.
                </li>
                <li>
                  Phone numbers shown on that site may connect you to a different licensed agency.
                  To reach an INSUREitALL agent, call{" "}
                  <CallLink className="font-medium whitespace-nowrap text-blue">
                    {PHONE_DISPLAY}
                  </CallLink>{" "}
                  (TTY 711).
                </li>
                <li>You enroll yourself there. You can stop at any time before you submit.</li>
              </ul>
              <TpmoDisclaimer className="text-muted" />
            </div>
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="lg">
                Stay here
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button asChild variant="blue" size="lg">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("enroll_purl_click")}
                >
                  Continue to enrollment
                  <ExternalLink className="size-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
