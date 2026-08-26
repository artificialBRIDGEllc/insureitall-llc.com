import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard } from "@/components/console/ui";
import { listFeedbackSummary, type FeedbackCount } from "@/lib/feedback";

export const Route = createFileRoute("/console/usage")({ component: UsagePage });

function UsagePage() {
  const [rows, setRows] = useState<FeedbackCount[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    listFeedbackSummary()
      .then((data) => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setReady(true));
  }, []);

  const byEvent = new Map<string, number>();
  for (const row of rows) {
    byEvent.set(row.event, (byEvent.get(row.event) ?? 0) + row.count);
  }
  const events = [...byEvent.entries()].sort((a, b) => b[1] - a[1]);
  const max = Math.max(...events.map(([, n]) => n), 1);

  return (
    <ConsoleFrame title="Usage & feature stats">
      <ConsoleCard>
        <h2 className="font-sans text-base font-semibold text-navy">Training loop (7 days)</h2>
        <p className="mt-1 text-sm text-muted">
          Deidentified events only — no names, phones, emails, doctors, or medications.
        </p>
        {!ready ? (
          <p className="mt-6 text-sm text-muted">Loading…</p>
        ) : events.length === 0 ? (
          <p className="mt-6 text-sm text-ink">
            No events yet. Public page views, widget, Plan Choice Audit, and lead
            kind (not the lead itself) land here.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {events.map(([label, count]) => (
              <li key={label}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-ink">{label}</span>
                  <span className="tabular-nums text-muted">{count}</span>
                </div>
                <div className="console-bar mt-1.5">
                  <span style={{ width: `${(count / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </ConsoleCard>

      <ConsoleCard className="mt-6">
        <h2 className="font-sans text-base font-semibold text-navy">By page</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {rows.map((row) => (
            <li key={`${row.event}-${row.path}`} className="flex justify-between gap-3">
              <span className="text-ink">
                {row.event} · {row.path}
              </span>
              <span className="tabular-nums text-muted">{row.count}</span>
            </li>
          ))}
        </ul>
      </ConsoleCard>
    </ConsoleFrame>
  );
}
