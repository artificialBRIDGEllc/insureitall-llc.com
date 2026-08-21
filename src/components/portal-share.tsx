import { Building2, Shield, Users } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createPortalShare,
  listPortalShares,
  openPortalShare,
  revokePortalShare,
  type OpenedFile,
  type PortalShare,
  type ShareAudience,
} from "@/lib/portal";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";

const audiences: {
  id: ShareAudience;
  title: string;
  hint: string;
  icon: typeof Users;
}[] = [
  {
    id: "agent",
    title: "New agent",
    hint: "Hand this code to the licensed agent you’re moving to.",
    icon: Users,
  },
  {
    id: "agency",
    title: "New agency",
    hint: "The shop can open your file without starting from zero.",
    icon: Building2,
  },
  {
    id: "carrier",
    title: "New carrier",
    hint: "Share the story, not an enrollment. They still need your consent to sell.",
    icon: Shield,
  },
];

export function PortalSharePanel() {
  const [shares, setShares] = useState<PortalShare[]>([]);
  const [labels, setLabels] = useState<Record<ShareAudience, string>>({
    agent: "",
    agency: "",
    carrier: "",
  });
  const [busy, setBusy] = useState<ShareAudience | null>(null);

  async function refresh() {
    try {
      setShares(await listPortalShares());
    } catch {
      setShares([]);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function create(audience: ShareAudience) {
    setBusy(audience);
    try {
      await createPortalShare({ data: { audience, label: labels[audience] } });
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  async function revoke(id: string) {
    await revokePortalShare({ data: { id } });
    await refresh();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-navy">Share your file</h3>
      <p className="mt-1 max-w-2xl text-sm text-ink">
        You keep the original. Hand a code to someone you trust. Revoke anytime.
        This is not an enrollment and does not move a book of business. Outside
        agents and agencies do not get a portal login.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {audiences.map((a) => {
            const active = shares.filter((s) => s.audience === a.id && !s.revokedAt);
            const Icon = a.icon;
            return (
              <article key={a.id} className="card-elevated rounded-3xl bg-elevated p-5">
                <Icon className="size-5 text-blue" />
                <h4 className="mt-3 font-display text-xl text-navy">{a.title}</h4>
                <p className="mt-1 text-sm text-ink">{a.hint}</p>
                <Field
                  label="Name (optional)"
                  name={`${a.id}-label`}
                  value={labels[a.id]}
                  onChange={(e) => setLabels((prev) => ({ ...prev, [a.id]: e.target.value }))}
                  placeholder="Who you’re sharing with"
                />
                <Button
                  type="button"
                  className="mt-3 w-full"
                  variant="blue"
                  disabled={busy === a.id}
                  onClick={() => void create(a.id)}
                >
                  {busy === a.id ? "Creating…" : "Create share code"}
                </Button>
                <ul className="mt-4 space-y-2">
                  {active.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-2xl bg-soft px-3 py-2 text-sm text-navy"
                    >
                      <p className="font-mono text-base tracking-wide">{s.id}</p>
                      {s.label ? <p className="text-xs text-muted">{s.label}</p> : null}
                      <button
                        type="button"
                        className="mt-1 text-xs text-blue"
                        onClick={() => void revoke(s.id)}
                      >
                        Revoke
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
    </div>
  );
}

export function TeamShareLookup() {
  const [code, setCode] = useState("");
  const [opened, setOpened] = useState<OpenedFile | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);

  async function open(e: FormEvent) {
    e.preventDefault();
    setOpenError(null);
    setOpened(null);
    try {
      const file = await openPortalShare({ data: { id: code } });
      if (!file) setOpenError("That code is not active.");
      else setOpened(file);
    } catch {
      setOpenError("Team sign-in required.");
    }
  }

  return (
    <div className="card-elevated rounded-3xl bg-elevated p-6 sm:p-8">
        <h3 className="font-display text-2xl text-navy">Open a consumer file</h3>
        <p className="mt-1 text-sm text-ink">
          INSUREitALL team only. Enter the code the consumer gave you.
        </p>
        <form onSubmit={open} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Field
              label="Share code"
              name="share-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="IIA-XXXXXX"
              autoComplete="off"
            />
          </div>
          <Button type="submit" className="sm:mt-7" variant="navy">
            Open file
          </Button>
        </form>
        {openError ? <p className="mt-3 text-sm text-blue">{openError}</p> : null}
        {opened ? (
          <div className="mt-6 space-y-2 rounded-2xl bg-soft p-5 text-sm text-ink">
            <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
              Shared for a {opened.audience}
              {opened.label ? ` · ${opened.label}` : ""}
            </p>
            <p>
              <span className="font-medium text-navy">Zip:</span> {opened.zip || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Doctors:</span>{" "}
              {opened.doctors || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Medications:</span>{" "}
              {opened.medications || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Budget:</span>{" "}
              {opened.budget || "—"}
            </p>
            <p>
              <span className="font-medium text-navy">Notes:</span> {opened.notes || "—"}
            </p>
          </div>
        ) : null}
    </div>
  );
}
