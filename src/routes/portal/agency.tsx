import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PortalFrame } from "@/components/portal/shell";
import { ConsoleCard } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import {
  EMPTY_SCOPE,
  connectAgency,
  disconnectAgency,
  getAgencyLink,
  type AgencyLink,
  type ConsentScope,
} from "@/lib/portal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portal/agency")({
  component: PortalAgencyPage,
  head: () =>
    pageHead({
      title: "Agency access",
      description:
        "artificialBRIDGE operates this portal. Grant or revoke INSUREitALL access, field by field.",
      path: "/portal/agency",
      index: false,
    }),
});

const FIELDS: { key: keyof ConsentScope; label: string; hint: string }[] = [
  { key: "zip", label: "Zip code", hint: "So they know your service area" },
  { key: "budget", label: "Budget comfort", hint: "Premium vs copay preference" },
  { key: "doctors", label: "Doctors you want to keep", hint: "Names only" },
  { key: "medications", label: "Medications", hint: "Names only — never a Medicare number" },
  { key: "notes", label: "Your notes", hint: "Whatever you typed in your file" },
];

function PortalAgencyPage() {
  const [link, setLink] = useState<AgencyLink | null>(null);
  const [scopes, setScopes] = useState<ConsentScope>(EMPTY_SCOPE);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const next = await getAgencyLink();
      setLink(next);
      setScopes(next.scopes);
    } catch {
      setLink(null);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function connect() {
    setBusy(true);
    setError(null);
    try {
      setLink(await connectAgency({ data: { consent: true, scopes } }));
      setConsent(false);
    } catch {
      setError("Could not save consent. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setError(null);
    try {
      setLink(await disconnectAgency());
    } catch {
      setError("Could not revoke. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const connected = Boolean(link?.connected);

  return (
    <PortalFrame title="Agency">
      <ConsoleCard>
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          artificialBRIDGE LLC
        </p>
        <h2 className="mt-2 font-display text-3xl text-navy">This app is ours to you.</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink">
          The portal is owned and operated by artificialBRIDGE LLC — not by
          INSUREitALL. An agency sees your file only if you give express consent,
          and only the fields you check. Revoke and the live access ends. Your
          copy stays.
        </p>
      </ConsoleCard>

      <ConsoleCard className="mt-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
          {connected ? "Consent active" : "No agency access"}
        </p>
        <h3 className="mt-2 font-display text-2xl text-navy">INSUREitALL</h3>
        <p className="mt-2 max-w-lg text-sm text-ink">
          Licensed Medicare agency. Partner integration — not the owner of this
          portal. They never receive a Medicare number or SSN from this app.
        </p>

        <fieldset className="mt-6 space-y-3">
          <legend className="text-sm font-semibold text-navy">They may see</legend>
          {FIELDS.map((field) => (
            <label key={field.key} className="flex items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={scopes[field.key]}
                disabled={connected}
                onChange={(e) =>
                  setScopes((prev) => ({ ...prev, [field.key]: e.target.checked }))
                }
              />
              <span>
                <span className="font-medium text-navy">{field.label}</span>
                <span className="block text-xs text-muted">{field.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {connected ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" disabled={busy} onClick={() => void disconnect()}>
              {busy ? "Revoking…" : "Revoke consent"}
            </Button>
            <p className="text-xs text-muted">
              Granted {link?.consentAt?.slice(0, 10) ?? ""}. Access stops immediately.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <label className="flex items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I give express consent for INSUREitALL licensed agents to view
                only the fields I checked. I can revoke this at any time. This is
                not an enrollment.
              </span>
            </label>
            <Button
              type="button"
              variant="blue"
              disabled={busy || !consent}
              onClick={() => void connect()}
            >
              {busy ? "Saving…" : "Grant access"}
            </Button>
          </div>
        )}
        {error ? <p className="mt-4 text-sm text-alert">{error}</p> : null}
      </ConsoleCard>
    </PortalFrame>
  );
}
