import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard, FilterPill, KpiCard, PolicyChip, SourceChip } from "@/components/console/ui";
import {
  DEBT_GATES,
  DEBT_LEDGER,
  DEBT_UPDATED,
  P0_PLAYBOOKS,
  countBySeverity,
  type DebtSeverity,
  type DebtStatus,
} from "@/lib/debt";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/debt")({ component: DebtPage });

const SEVERITY_TONE: Record<DebtSeverity, "alert" | "ok" | "ink"> = {
  p0: "alert",
  p1: "ink",
  p2: "ink",
  p3: "ok",
};

function DebtPage() {
  const [status, setStatus] = useState<DebtStatus | "all">("all");
  const items = useMemo(
    () => (status === "all" ? DEBT_LEDGER : DEBT_LEDGER.filter((i) => i.status === status)),
    [status],
  );
  const counts = countBySeverity();
  const open = DEBT_LEDGER.filter((i) => i.status !== "resolved").length;

  return (
    <ConsoleFrame title="Engineering debt">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Named issues plus automated gates. Ledger last aligned {DEBT_UPDATED}. A strict scan
        fails the run if a rolled-back file or a required legal page is missing — each P0 has
        the exact restore steps below. PHI never belongs in this list.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open or watch" value={String(open)} hint="not resolved" />
        <KpiCard label="P0 open" value={String(counts.p0)} hint="blocks ship" />
        <KpiCard label="P1 open" value={String(counts.p1)} hint="voice / brand" />
        <KpiCard label="P2–P3 open" value={String(counts.p2 + counts.p3)} hint="ops / polish" />
      </div>

      <section className="mt-8">
        <h2 className="font-sans text-base font-semibold text-navy">P0 playbooks</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Ship-blockers. Follow the numbered steps in order. All three are currently resolved
          on this tree — keep the recipes so a regression has a one-page fix.
        </p>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {P0_PLAYBOOKS.map((book) => {
            const ledger = DEBT_LEDGER.find((i) => i.id === book.id);
            const resolved = ledger?.status === "resolved";
            return (
              <ConsoleCard key={book.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <PolicyChip value="P0" tone="alert" />
                  <span
                    className={cn(
                      "console-chip",
                      resolved ? "bg-ok-soft text-ok" : "bg-alert-soft text-alert",
                    )}
                  >
                    {ledger?.status ?? "open"}
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-base font-semibold text-navy">{book.title}</h3>
                <p className="mt-1 text-xs text-muted">
                  Fires when {book.firesWhen[0].toLowerCase()}
                  {book.firesWhen.slice(1)}
                </p>
                <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm text-ink">
                  {book.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="mt-4 text-xs text-muted">
                  <span className="font-semibold text-navy">Done when. </span>
                  {book.doneWhen}
                </p>
                <p className="mt-1 text-xs text-muted">
                  <span className="font-semibold text-navy">Verify. </span>
                  {book.verify}
                </p>
              </ConsoleCard>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["all", "open", "watch", "resolved"] as const).map((key) => (
          <FilterPill key={key} active={status === key} onClick={() => setStatus(key)}>
            {key[0].toUpperCase() + key.slice(1)}
          </FilterPill>
        ))}
      </div>

      <ConsoleCard className="mt-4">
        <h2 className="font-sans text-base font-semibold text-navy">Ledger</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="console-table min-w-[720px]">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Item</th>
                <th>Area</th>
                <th>Status</th>
                <th>Next</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <PolicyChip value={item.severity.toUpperCase()} tone={SEVERITY_TONE[item.severity]} />
                  </td>
                  <td className="max-w-xs">
                    <p className="text-sm font-medium text-navy">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">{item.why}</p>
                  </td>
                  <td>
                    <SourceChip label={item.area} />
                  </td>
                  <td>
                    <span
                      className={cn(
                        "console-chip",
                        item.status === "resolved"
                          ? "bg-ok-soft text-ok"
                          : item.status === "watch"
                            ? "bg-warn-soft text-warn"
                            : "bg-soft text-ink",
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="text-sm text-muted">{item.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConsoleCard>

      <ConsoleCard className="mt-6">
        <h2 className="font-sans text-base font-semibold text-navy">Automated gates</h2>
        <p className="mt-1 text-sm text-muted">
          Run on every test pass and `npm run debt`. Strict mode exits 2 on live P0 and prints
          the matching playbook.
        </p>
        <ul className="mt-5 space-y-3">
          {DEBT_GATES.map((gate) => (
            <li key={gate.id} className="flex items-start justify-between gap-4">
              <span className="text-sm text-ink">{gate.label}</span>
              <PolicyChip value={gate.severity.toUpperCase()} tone={SEVERITY_TONE[gate.severity]} />
            </li>
          ))}
        </ul>
      </ConsoleCard>
    </ConsoleFrame>
  );
}
