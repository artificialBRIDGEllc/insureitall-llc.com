import { createFileRoute, Link } from "@tanstack/react-router";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard, PolicyChip } from "@/components/console/ui";
import { CONSENT_ROWS } from "@/lib/console";

export const Route = createFileRoute("/console/consent")({ component: ConsentPage });

function ConsentPage() {
  return (
    <ConsoleFrame title="Consent & retention">
      <ConsoleCard>
        <p className="max-w-2xl text-sm text-ink">
          What this site actually keeps. BRIDGEt is not a licensed agent and is not Medicare.
          She never stores a Medicare number or SSN. Callback consent is TCPA opt-in — not a
          purchase condition.
        </p>
        <ul className="mt-6 divide-y divide-border">
          {CONSENT_ROWS.map((row) => (
            <li key={row.label} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <p className="font-medium text-navy">{row.label}</p>
                <p className="mt-1 text-sm text-muted">{row.note}</p>
              </div>
              <PolicyChip value={row.value} tone={row.tone} />
            </li>
          ))}
        </ul>
      </ConsoleCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ConsoleCard>
          <h2 className="font-sans text-base font-semibold text-navy">TCPA on forms</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            /lead and /needs-analysis will not submit without the consent checkbox. That gate is
            enforced in the form, not just copy. Calls to and from INSUREitALL are recorded for
            quality, training, and compliance.
          </p>
        </ConsoleCard>
        <ConsoleCard>
          <h2 className="font-sans text-base font-semibold text-navy">Public copy</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            The same rules live on the{" "}
            <Link to="/privacy" className="text-blue">
              Privacy Policy
            </Link>{" "}
            and the public{" "}
            <Link to="/hipaa" className="text-blue">
              HIPAA & PHI
            </Link>{" "}
            control map. If a retention number here and there ever disagree, privacy
            wins — change this desk to match, not the other way around.
          </p>
        </ConsoleCard>
      </div>
    </ConsoleFrame>
  );
}
