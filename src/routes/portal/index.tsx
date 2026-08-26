import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, FileText, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { PortalFrame } from "@/components/portal/shell";
import { CallLink } from "@/components/call-link";
import { BridgetWordmark } from "@/components/bridget-wordmark";
import { ConsoleCard } from "@/components/console/ui";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getPortalProfile } from "@/lib/portal";
import { pageHead } from "@/lib/seo";
import { PHONE_DISPLAY } from "@/lib/utils";

export const Route = createFileRoute("/portal/")({
  component: PortalHome,
  head: () =>
    pageHead({
      title: "Your coverage file",
      description: "A beneficiary product. Connect an agency if you want. Revoke anytime.",
      path: "/portal",
      index: false,
    }),
});

function PortalHome() {
  const user = useCurrentUser();
  const first = (user?.displayName ?? "there").split(" ")[0];
  const [ready, setReady] = useState(false);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    getPortalProfile()
      .then((profile) => {
        if (!profile) return;
        const bits = [profile.zip, profile.doctors, profile.medications, profile.notes];
        setFilled(bits.filter((v) => v.trim()).length);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  return (
    <PortalFrame title="Home">
      <p className="text-lg text-ink">
        Hello {first}. This is an artificialBRIDGE app. INSUREitALL sees you
        only if you grant consent — and only the fields you check.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ConsoleCard>
          <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">File</p>
          <h2 className="mt-2 font-display text-2xl text-navy">
            {ready ? `${filled} of 4 filled` : "…"}
          </h2>
          <p className="mt-2 text-sm text-ink">
            Zip, doctors, medications, notes. Names only. Never a Medicare number.
          </p>
          <Link to="/portal/file" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue">
            <FileText className="size-4" />
            Open my file
          </Link>
        </ConsoleCard>
        <ConsoleCard>
          <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">Agency</p>
          <h2 className="mt-2 font-display text-2xl text-navy">Optional link</h2>
          <p className="mt-2 text-sm text-ink">
            INSUREitALL is a partner. They see only fields you consent to. Revoke anytime.
          </p>
          <Link to="/portal/agency" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue">
            <Building2 className="size-4" />
            Manage connection
          </Link>
        </ConsoleCard>
        <ConsoleCard>
          <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">Human</p>
          <h2 className="mt-2 font-display text-2xl text-navy">{PHONE_DISPLAY}</h2>
          <p className="mt-2 text-sm text-ink">
            Licensed INSUREitALL agents. No scripts. No pressure.
          </p>
          <CallLink className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue">
            <Phone className="size-4" />
            Call now
          </CallLink>
        </ConsoleCard>
      </div>

      <ConsoleCard className="mt-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">In this portal</p>
        <h2 className="mt-2 font-display text-2xl text-navy">
          <BridgetWordmark className="text-[1.65rem]" /> is your advocate here
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink">
          She can walk a question. She is not a licensed agent and she does not
          enroll anyone. Plan conversations still go to a human.{" "}
          <Link to="/portal/help" className="font-semibold text-blue">
            How help works
          </Link>
          .
        </p>
      </ConsoleCard>
    </PortalFrame>
  );
}
