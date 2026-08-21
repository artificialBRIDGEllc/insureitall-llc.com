import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PortalEmailAuth } from "@/components/portal-email-auth";
import { TeamShareLookup } from "@/components/portal-share";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { listOpsRequests, type OpsRequest } from "@/lib/ops";
import { isStaffUser } from "@/lib/staff";
import { HOURS } from "@/lib/utils";
import { LICENSED_STATES_LINE } from "@/lib/compliance";

export const Route = createFileRoute("/team")({ component: TeamPage });

function TeamPage() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <SiteShell>
        <main className="mx-auto max-w-5xl px-4 py-16">
          <div className="h-48 animate-pulse rounded-3xl bg-soft" />
        </main>
      </SiteShell>
    );
  }

  if (!user) {
    return (
      <SiteShell>
        <section className="bg-navy py-14 text-center text-elevated">
          <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">
            INSUREitALL team
          </p>
          <h1 className="mt-4 font-display text-4xl">Business operations</h1>
          <p className="mx-auto mt-4 max-w-xl text-elevated/80">
            Scoped to INSUREitALL team members. Not a door for outside agents or
            agencies. Consumers use the portal.
          </p>
        </section>
        <main className="mx-auto max-w-sm px-4 py-12">
          <div className="card-elevated rounded-3xl bg-elevated p-8">
            {authEnabled ? (
              <div className="space-y-3">
                <PortalEmailAuth callbackURL="/team" />
                <p className="text-center text-xs text-muted">or continue with</p>
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn(p.providerId, { callbackURL: "/team" })}
                  >
                    Sign in with {p.label}
                  </Button>
                ))}
              </div>
            ) : (
              <RedirectToSignIn to="/team" />
            )}
            <p className="mt-6 text-xs text-muted">
              Use your INSUREitALL email.{" "}
              <Link to="/portal" className="text-blue">
                Consumers sign in here
              </Link>
              .
            </p>
          </div>
        </main>
      </SiteShell>
    );
  }

  if (!isStaffUser(user)) {
    return (
      <SiteShell>
        <main className="mx-auto max-w-xl px-4 py-16">
          <div className="card-elevated rounded-3xl bg-elevated p-8">
            <h1 className="font-display text-3xl text-navy">Team only</h1>
            <p className="mt-3 text-ink">
              This workspace is for INSUREitALL team members. It is not open to
              outside agents or agencies.
            </p>
            <p className="mt-3 text-sm text-muted">
              Signed in as {user.primaryEmail ?? user.displayName}. Use a
              company email, or go to the consumer portal.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/portal">Consumer portal</Link>
              </Button>
              <UserButton />
            </div>
          </div>
        </main>
      </SiteShell>
    );
  }

  return <TeamOps />;
}

function TeamOps() {
  const [rows, setRows] = useState<OpsRequest[] | null>(null);

  useEffect(() => {
    listOpsRequests()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <SiteShell>
      <section className="bg-navy py-12 text-elevated">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">
              INSUREitALL · scoped
            </p>
            <h1 className="mt-2 font-display text-4xl">Business operations</h1>
            <p className="mt-2 max-w-xl text-elevated/75">
              Inbound consumer requests and files they chose to share. Outside
              agents and agencies do not have accounts here.
            </p>
          </div>
          <UserButton />
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h2 className="font-display text-2xl text-navy">Inbound</h2>
          <p className="mt-1 text-sm text-muted">Callbacks and needs analyses from this site.</p>
          <div className="mt-5 space-y-3">
            {rows === null ? (
              <div className="h-32 animate-pulse rounded-3xl bg-soft" />
            ) : rows.length === 0 ? (
              <p className="rounded-3xl bg-elevated p-6 text-sm text-ink shadow-card">
                No requests yet. New callbacks and needs analyses land here.
              </p>
            ) : (
              rows.map((r) => (
                <article key={r.id} className="card-elevated rounded-3xl bg-elevated p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
                    {r.kind === "needs" ? "Needs analysis" : "Callback"} · {r.id}
                  </p>
                  <p className="mt-2 font-medium text-navy">
                    {r.firstName || r.email || "Consumer"}
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    {[r.phone, r.email, r.zip, r.callbackWindow].filter(Boolean).join(" · ")}
                  </p>
                  {r.doctors || r.medications || r.notes ? (
                    <p className="mt-2 text-sm text-muted">
                      {r.doctors ? `Doctors: ${r.doctors}. ` : ""}
                      {r.medications ? `Meds: ${r.medications}. ` : ""}
                      {r.notes}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </section>

        <div className="space-y-6">
          <TeamShareLookup />
          <section className="card-elevated rounded-3xl bg-elevated p-6">
            <h2 className="font-display text-xl text-navy">Desk</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              <li>Hours: {HOURS}</li>
              <li>{LICENSED_STATES_LINE}</li>
              <li>
                <Link to="/portal" className="text-blue">
                  Consumer portal
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
