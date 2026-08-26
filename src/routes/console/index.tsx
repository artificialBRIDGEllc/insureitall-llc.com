import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard, KpiCard, MockFlag, PolicyChip } from "@/components/console/ui";
import { LeadFilters, LeadsTable, useConsoleLeads } from "@/components/console/leads-table";
import {
  CONSOLE_KPIS,
  CONSENT_ROWS,
  SESSION_FOOT,
  TOPIC_STATS,
  VOICE_SHARE,
  type DateRange,
} from "@/lib/console";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/")({ component: OverviewPage });

function OverviewPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [filter, setFilter] = useState<"all" | "open" | "enrolled" | "ended">("all");
  const { rows } = useConsoleLeads();
  const kpis = CONSOLE_KPIS[range];
  const topicMax = useMemo(
    () => Math.max(...TOPIC_STATS.map((t) => t.count), 1),
    [],
  );

  return (
    <ConsoleFrame
      title="Overview"
      actions={
        <label className="hidden items-center gap-2 text-sm text-muted sm:flex">
          Showing
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="h-10 rounded-full border border-border bg-elevated px-3 text-sm text-navy"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="aep">This AEP</option>
          </select>
        </label>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Site visitors"
          value={kpis.visitors.toLocaleString()}
          hint={kpis.visitorDelta}
          up
        />
        <KpiCard
          label="BRIDGEt sessions"
          value={kpis.sessions.toLocaleString()}
          hint={kpis.sessionDelta}
          up
        />
        <KpiCard
          label="Callback requests"
          value={String(kpis.callbacks)}
          hint={kpis.callbackDelta}
          up
        />
        <KpiCard
          label="Session → lead rate"
          value={kpis.convertRate}
          hint={kpis.convertNote}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <ConsoleCard>
          <h2 className="font-sans text-base font-semibold text-navy">BRIDGEt usage</h2>
          <p className="mt-0.5 text-sm text-muted">How people are actually using her, this week</p>
          <div className="console-mix mt-5">
            <span className="voice" style={{ width: `${VOICE_SHARE * 100}%` }} />
            <span className="typed" style={{ width: `${(1 - VOICE_SHARE) * 100}%` }} />
          </div>
          <p className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
            <span>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-blue" />
              Voice · {Math.round(VOICE_SHARE * 100)}%
            </span>
            <span>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-blue/40" />
              Typed chat · {Math.round((1 - VOICE_SHARE) * 100)}%
            </span>
          </p>
          <ul className="mt-6 space-y-4">
            {TOPIC_STATS.map((t) => (
              <li key={t.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink">{t.label}</span>
                  <span className="tabular-nums text-muted">{t.count}</span>
                </div>
                <div className="console-bar mt-1.5">
                  <span style={{ width: `${(t.count / topicMax) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4">
            <div>
              <dt className="font-sans text-xl font-semibold text-navy tabular-nums">
                {SESSION_FOOT.avgLength}
              </dt>
              <dd className="text-xs text-muted">Avg. session length</dd>
            </div>
            <div>
              <dt className="font-sans text-xl font-semibold text-navy tabular-nums">
                {SESSION_FOOT.positive}
              </dt>
              <dd className="text-xs text-muted">Positive sentiment</dd>
            </div>
            <div>
              <dt className="font-sans text-xl font-semibold text-navy tabular-nums">
                {SESSION_FOOT.guardrails}
              </dt>
              <dd className="text-xs text-muted">Guardrail blocks</dd>
            </div>
          </dl>
        </ConsoleCard>

        <ConsoleCard>
          <h2 className="font-sans text-base font-semibold text-navy">Consent & retention</h2>
          <p className="mt-0.5 text-sm text-muted">What’s actually stored, and for how long</p>
          <ul className="mt-4 divide-y divide-border">
            {CONSENT_ROWS.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-3 py-3.5">
                <span className="text-sm text-ink">{row.label}</span>
                <PolicyChip value={row.value} tone={row.tone} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            <Link to="/console/consent" className="text-blue">
              Full policy →
            </Link>
          </p>
        </ConsoleCard>
      </div>

      <ConsoleCard className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-sans text-base font-semibold text-navy">Recent leads</h2>
          <LeadFilters rows={rows} filter={filter} onChange={setFilter} />
        </div>
        <LeadsTable compact filter={filter} />
        <p className="mt-4 text-sm">
          <Link to="/console/leads" className={cn("text-blue")}>
            Open full lead desk →
          </Link>
        </p>
      </ConsoleCard>
      <MockFlag />
    </ConsoleFrame>
  );
}
