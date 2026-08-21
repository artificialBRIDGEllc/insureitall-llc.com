import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Fingerprint, HeartHandshake, Shield, Users } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PortalEmailAuth } from "@/components/portal-email-auth";
import { PortalFile } from "@/components/portal-file";
import { PortalSharePanel } from "@/components/portal-share";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { isStaffUser } from "@/lib/staff";

export const Route = createFileRoute("/portal")({ component: PortalPage });

const pillars = [
  {
    icon: Users,
    t: "Yours, not the agent’s",
    d: "Change who you talk to. Keep the record.",
  },
  {
    icon: Building2,
    t: "Yours, not the shop’s",
    d: "The file does not live at an agency.",
  },
  {
    icon: Shield,
    t: "Yours if the plan moves",
    d: "Carriers can change. Your story doesn’t vanish.",
  },
];

function PortalPage() {
  const { user, isPending } = useCurrentUserState();

  return (
    <SiteShell>
      <section className="hero-glow relative overflow-hidden bg-navy text-elevated">
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-elevated/15 bg-elevated/8 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-mist uppercase">
            For consumers · No cost
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] sm:text-5xl lg:text-[3.2rem]">
            Your file.{" "}
            <em className="italic text-mist">Not the agency’s.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-elevated/80">
            Open to any consumer. Not for agents or agencies. Save your coverage
            story here so it stays with you when a relationship changes.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
            For people on Medicare
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
            Continuity is the point.
          </h2>
          <p className="mt-4 max-w-xl text-ink leading-relaxed">
            Agents change. Agencies merge. Carriers swap networks. Your doctors,
            medications, and the questions you’ve already answered should not
            start over.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.t} className="card-elevated rounded-3xl bg-elevated p-5">
                <p.icon className="size-5 text-blue" />
                <h3 className="mt-3 font-display text-lg text-navy">{p.t}</h3>
                <p className="mt-1 text-sm text-ink">{p.d}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 flex items-start gap-2 text-sm text-muted">
            <Fingerprint className="mt-0.5 size-4 shrink-0 text-blue" />
            Consumers only. Licensed agents still handle plan conversations.
            INSUREitALL team members use a separate ops workspace. Do not enter a
            Medicare number here.
          </p>
        </div>

        <div className="card-elevated rounded-3xl bg-elevated p-6 sm:p-8">
          {isPending ? (
            <div className="h-40 animate-pulse rounded-2xl bg-soft" />
          ) : user ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-soft p-4">
                <UserButton />
                <p className="mt-3 flex items-start gap-2 text-sm text-navy">
                  <HeartHandshake className="mt-0.5 size-4 shrink-0 text-blue" />
                  This file is yours. Share a code if you want someone to see it —
                  revoke anytime.
                </p>
                {isStaffUser(user) ? (
                  <p className="mt-2 text-sm">
                    <Link to="/team" className="text-blue">
                      Open team ops →
                    </Link>
                  </p>
                ) : null}
              </div>
              <div>
                <h3 className="font-display text-xl text-navy">Your coverage file</h3>
                <p className="mt-1 text-sm text-muted">
                  Saved to you — not to an agent or a shop.
                </p>
                <div className="mt-4">
                  <PortalFile />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-ink">
                Any consumer can create an account. No invitation. No cost. Agents
                and agencies cannot join.
              </p>
              {authEnabled ? (
                <>
                  <PortalEmailAuth />
                  <p className="text-center text-xs text-muted">or continue with</p>
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn(p.providerId, { callbackURL: "/portal" })}
                    >
                      Sign in with {p.label}
                    </Button>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted">Sign-in is paused.</p>
              )}
            </div>
          )}

          <p className="mt-6 text-xs text-muted">
            No-cost, no-obligation. Creating an account does not start a Medicare
            enrollment.{" "}
            <Link to="/contact" className="text-blue">
              Talk to a licensed agent
            </Link>{" "}
            if you need help now.
          </p>
        </div>
      </main>
      {user && !isPending ? (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <PortalSharePanel />
        </section>
      ) : null}
    </SiteShell>
  );
}
