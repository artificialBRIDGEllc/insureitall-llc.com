import { useEffect, useMemo, useState } from "react";
import {
  advanceLeadStage,
  listLeadEvents,
  listOpsRequests,
  type LeadEvent,
  type OpsRequest,
} from "@/lib/ops";
import {
  type ConsoleLead,
  leadFilterCounts,
  mergeLeads,
} from "@/lib/console";
import {
  DISENROLL_REASONS,
  LIFECYCLE_DISCLAIMER,
  PIPELINE_ORDER,
  STAGE_LABEL,
  nextStages,
  type LeadStage,
} from "@/lib/lead-lifecycle";
import { DispositionChip, FilterPill, SourceChip } from "@/components/console/ui";
import { Button } from "@/components/ui/button";

export function useConsoleLeads() {
  const [live, setLive] = useState<OpsRequest[] | null>(null);

  useEffect(() => {
    listOpsRequests()
      .then(setLive)
      .catch(() => setLive([]));
  }, []);

  const rows = useMemo(() => mergeLeads(live ?? []), [live]);
  return { loading: live === null, rows, setLive };
}

export function LeadsTable({
  compact = false,
  filter = "all",
}: {
  compact?: boolean;
  filter?: "all" | "open" | "enrolled" | "ended";
}) {
  const { loading, rows, setLive } = useConsoleLeads();
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = rows.filter((r) => {
    if (filter === "open") return !["enrolled", "reviewing", "disenrolled", "closed_lost"].includes(r.disposition);
    if (filter === "enrolled") return r.disposition === "enrolled" || r.disposition === "reviewing";
    if (filter === "ended") return r.disposition === "disenrolled" || r.disposition === "closed_lost";
    return true;
  });
  const shown = compact ? visible.slice(0, 8) : visible;
  const selected = rows.find((r) => r.id === openId) ?? null;

  if (loading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-soft" />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="console-table min-w-[860px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Best time</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-muted">
                  No leads in this view yet.
                </td>
              </tr>
            ) : (
              shown.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => setOpenId(row.id)}
                >
                  <td>
                    <p className="font-semibold text-navy">{row.name}</p>
                    {row.location ? <p className="text-xs text-muted">{row.location}</p> : null}
                    {row.live ? (
                      <p className="mt-0.5 text-[0.65rem] font-medium tracking-wide text-blue uppercase">Live</p>
                    ) : (
                      <p className="mt-0.5 text-[0.65rem] text-muted">Sample</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-sm text-ink tabular-nums">{row.phone || "—"}</td>
                  <td>
                    <SourceChip label={row.source} />
                  </td>
                  <td className="text-sm text-ink">{row.bestTime || "—"}</td>
                  <td>
                    <DispositionChip value={row.disposition} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected ? (
        <LeadDrawer
          row={selected}
          onClose={() => setOpenId(null)}
          onStage={(id, stage) => {
            setLive((prev) =>
              prev
                ? prev.map((p) => (p.id === id ? { ...p, stage, disposition: stage } : p))
                : prev,
            );
          }}
        />
      ) : null}
    </div>
  );
}

function LeadDrawer({
  row,
  onClose,
  onStage,
}: {
  row: ConsoleLead;
  onClose: () => void;
  onStage: (id: string, stage: LeadStage) => void;
}) {
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [reason, setReason] = useState("voluntary");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const next = row.live ? nextStages(row.disposition) : [];

  useEffect(() => {
    if (!row.live) {
      setEvents([]);
      return;
    }
    listLeadEvents({ data: { id: row.id } })
      .then(setEvents)
      .catch(() => setEvents([]));
  }, [row.id, row.live, row.disposition]);

  async function move(stage: LeadStage) {
    if (!row.live) return;
    setBusy(stage);
    setError(null);
    try {
      await advanceLeadStage({
        data: {
          id: row.id,
          stage,
          reason: stage === "disenrolled" ? reason : "",
          note,
        },
      });
      onStage(row.id, stage);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not move stage.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-6 grid gap-6 rounded-3xl border border-border bg-soft p-5 lg:grid-cols-[1fr_16rem]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">{row.id}</p>
            <h3 className="mt-1 font-display text-2xl text-navy">{row.name}</h3>
            <p className="text-sm text-ink">
              {row.phone} · {row.email || "no email"}
            </p>
          </div>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        <ol className="mt-5 flex flex-wrap gap-1">
          {PIPELINE_ORDER.map((stage) => (
            <li
              key={stage}
              className={
                stage === row.disposition
                  ? "rounded-full bg-navy px-2 py-1 text-[0.65rem] font-semibold text-elevated"
                  : "rounded-full bg-elevated px-2 py-1 text-[0.65rem] text-muted"
              }
            >
              {STAGE_LABEL[stage]}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">{LIFECYCLE_DISCLAIMER}</p>
        {(row.doctors || row.medications) && (
          <div className="mt-4 space-y-1 text-sm text-ink">
            {row.doctors ? <p>Doctors: {row.doctors}</p> : null}
            {row.medications ? <p>Medications: {row.medications}</p> : null}
          </div>
        )}
        <ul className="mt-5 space-y-2 border-l border-border pl-4 text-sm">
          {events.length === 0 ? (
            <li className="text-muted">{row.live ? "No timeline yet." : "Sample row — not in the book."}</li>
          ) : (
            events.map((ev) => (
              <li key={ev.id}>
                <p className="font-semibold text-navy">{STAGE_LABEL[ev.stage]}</p>
                <p className="text-xs text-muted">
                  {ev.at.slice(0, 16).replace("T", " ")} · {ev.actor}
                  {ev.reason ? ` · ${ev.reason}` : ""}
                </p>
                {ev.note ? <p className="text-ink">{ev.note}</p> : null}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">Next</p>
        {next.includes("disenrolled") ? (
          <label className="block text-xs text-ink">
            Disenroll reason
            <select
              className="mt-1 w-full rounded-xl border border-border bg-elevated px-3 py-2 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {DISENROLL_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <textarea
          className="w-full rounded-xl border border-border bg-elevated px-3 py-2 text-sm"
          rows={3}
          placeholder="Staff note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {next.map((stage) => (
          <Button
            key={stage}
            type="button"
            variant={stage === "disenrolled" || stage === "closed_lost" ? "outline" : "blue"}
            className="w-full"
            disabled={!row.live || busy !== null}
            onClick={() => void move(stage)}
          >
            {busy === stage ? "Saving…" : STAGE_LABEL[stage]}
          </Button>
        ))}
        {next.length === 0 ? <p className="text-xs text-muted">Terminal — book closed for this plan year story.</p> : null}
        {error ? <p className="text-sm text-alert">{error}</p> : null}
      </div>
    </div>
  );
}

export function LeadFilters({
  rows,
  filter,
  onChange,
}: {
  rows: ConsoleLead[];
  filter: "all" | "open" | "enrolled" | "ended";
  onChange: (next: "all" | "open" | "enrolled" | "ended") => void;
}) {
  const counts = leadFilterCounts(rows);
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill active={filter === "all"} onClick={() => onChange("all")}>
        All ({counts.all})
      </FilterPill>
      <FilterPill active={filter === "open"} onClick={() => onChange("open")}>
        Pipeline ({counts.open})
      </FilterPill>
      <FilterPill active={filter === "enrolled"} onClick={() => onChange("enrolled")}>
        Enrolled ({counts.enrolled})
      </FilterPill>
      <FilterPill active={filter === "ended"} onClick={() => onChange("ended")}>
        Ended ({counts.ended})
      </FilterPill>
    </div>
  );
}
