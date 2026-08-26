import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard } from "@/components/console/ui";
import { LeadFilters, LeadsTable, useConsoleLeads } from "@/components/console/leads-table";
import { TeamShareLookup } from "@/components/portal-share";
import { getAlertHealth } from "@/lib/ops";

export const Route = createFileRoute("/console/leads")({ component: LeadsPage });

function channelLabel(value: string) {
  if (value === "ok") return "on";
  if (value === "invalid") return "invalid";
  return "off";
}

function LeadsPage() {
  const [filter, setFilter] = useState<"all" | "open" | "enrolled" | "ended">("all");
  const { rows } = useConsoleLeads();
  const [health, setHealth] = useState<{ resend: string; webhook: string; ok: boolean } | null>(null);

  useEffect(() => {
    getAlertHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <ConsoleFrame title="Leads">
      <ConsoleCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted">
              Inbound to enrolled to disenrolled. Alerts still carry name, phone,
              email, zip only. This desk is not MARx.
            </p>
            {health ? (
              <p className="mt-1 text-xs text-muted">
                Resend {channelLabel(health.resend)} · webhook {channelLabel(health.webhook)}
                {health.ok ? "" : " · env invalid — check Vercel vars"}
              </p>
            ) : null}
          </div>
          <LeadFilters rows={rows} filter={filter} onChange={setFilter} />
        </div>
        <LeadsTable filter={filter} />
      </ConsoleCard>
      <div className="mt-6">
        <TeamShareLookup />
      </div>
    </ConsoleFrame>
  );
}