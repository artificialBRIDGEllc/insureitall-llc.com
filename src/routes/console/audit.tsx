import { createFileRoute } from "@tanstack/react-router";
import { ConsoleFrame } from "@/components/console/shell";
import { ConsoleCard, MockFlag, SourceChip } from "@/components/console/ui";
import { SAMPLE_AUDIT } from "@/lib/console";

export const Route = createFileRoute("/console/audit")({ component: AuditPage });

function AuditPage() {
  return (
    <ConsoleFrame title="Audit log">
      <ConsoleCard>
        <p className="max-w-2xl text-sm text-muted">
          Who touched what. Illustrative until session analytics and staff actions write to the
          same log. PHI never belongs here.
        </p>
        <div className="console-scroll mt-5">
          <table className="console-table min-w-[640px]">
            <thead>
              <tr>
                <th>When</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_AUDIT.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap text-sm text-ink">{row.at}</td>
                  <td>
                    <SourceChip label={row.actor} />
                  </td>
                  <td className="text-sm font-medium text-navy">{row.action}</td>
                  <td className="text-sm text-muted">{row.detail}</td>
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
