import { createFileRoute } from "@tanstack/react-router";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard, MockFlag, SourceChip } from "@/components/console/ui";
import { SAMPLE_SESSIONS, SESSION_FOOT } from "@/lib/console";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/sessions")({ component: SessionsPage });

function SessionsPage() {
  return (
    <ConsoleFrame title="BRIDGEt sessions">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <ConsoleCard>
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted uppercase">
            Avg. length
          </p>
          <p className="mt-2 text-2xl font-semibold text-navy tabular-nums">{SESSION_FOOT.avgLength}</p>
        </ConsoleCard>
        <ConsoleCard>
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted uppercase">
            Positive sentiment
          </p>
          <p className="mt-2 text-2xl font-semibold text-navy tabular-nums">{SESSION_FOOT.positive}</p>
        </ConsoleCard>
        <ConsoleCard>
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted uppercase">
            Guardrail blocks
          </p>
          <p className="mt-2 text-2xl font-semibold text-navy tabular-nums">{SESSION_FOOT.guardrails}</p>
        </ConsoleCard>
      </div>

      <ConsoleCard>
        <h2 className="font-sans text-base font-semibold text-navy">Recent sessions</h2>
        <p className="mt-1 text-sm text-muted">
          She never quotes or enrolls. A guardrail block means she walked the person to a licensed agent instead.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="console-table min-w-[720px]">
            <thead>
              <tr>
                <th>Session</th>
                <th>Channel</th>
                <th>Topic</th>
                <th>Length</th>
                <th>Sentiment</th>
                <th>Lead</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SESSIONS.map((s) => (
                <tr key={s.id}>
                  <td>
                    <p className="font-medium text-navy">{s.id}</p>
                    <p className="text-xs text-muted">{s.started}</p>
                  </td>
                  <td>
                    <SourceChip label={s.channel} />
                  </td>
                  <td className="text-sm text-ink">{s.topic}</td>
                  <td className="text-sm tabular-nums text-ink">{s.duration}</td>
                  <td>
                    <span
                      className={cn(
                        "console-chip",
                        s.sentiment === "Positive" && "bg-ok-soft text-ok",
                        s.sentiment === "Neutral" && "bg-soft text-muted",
                        s.sentiment === "Frustrated" && "bg-warn-soft text-warn",
                      )}
                    >
                      {s.sentiment}
                    </span>
                  </td>
                  <td className="text-sm text-muted">{s.leadId ? "Handed off" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ConsoleCard>
      <MockFlag />
    </ConsoleFrame>
  );
}
