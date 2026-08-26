import type { ReactNode } from "react";
import type { LeadDisposition } from "@/lib/console";
import { DISPOSITION_LABEL } from "@/lib/console";
import { cn } from "@/lib/utils";

export function ConsoleCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("console-card p-5 sm:p-6", className)}>{children}</section>;
}

export function KpiCard({
  label,
  value,
  hint,
  up,
}: {
  label: string;
  value: string;
  hint: string;
  up?: boolean;
}) {
  return (
    <article className="console-card console-kpi p-5">
      <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="mt-3 font-sans text-3xl font-semibold tracking-tight text-navy tabular-nums sm:text-[2rem]">
        {value}
      </p>
      <p className={cn("mt-2 text-xs", up ? "text-ok" : "text-muted")}>
        {up ? `▲ ${hint}` : hint.startsWith("—") ? hint : `— ${hint}`}
      </p>
    </article>
  );
}

export function DispositionChip({
  value,
  onCycle,
}: {
  value: LeadDisposition;
  onCycle?: () => void;
}) {
  const tone =
    value === "enrolled" || value === "reviewing"
      ? "bg-ok-soft text-ok"
      : value === "disenrolled" || value === "closed_lost"
        ? "bg-surface text-muted"
        : value === "disenroll_pending" || value === "submitted"
          ? "bg-warn-soft text-warn"
          : value === "new"
            ? "bg-soft text-muted"
            : "bg-mist text-blue";
  const label = DISPOSITION_LABEL[value] ?? value;
  if (onCycle) {
    return (
      <button type="button" onClick={onCycle} className={cn("console-chip min-h-8 cursor-pointer", tone)}>
        {label}
      </button>
    );
  }
  return <span className={cn("console-chip", tone)}>{label}</span>;
}

export function SourceChip({ label }: { label: string }) {
  return <span className="console-chip bg-surface text-ink">{label}</span>;
}

export function PolicyChip({
  value,
  tone,
}: {
  value: string;
  tone: "ok" | "alert" | "ink";
}) {
  const styles = {
    ok: "bg-ok-soft text-ok",
    alert: "bg-alert-soft text-alert",
    ink: "bg-navy text-elevated",
  };
  return <span className={cn("console-chip", styles[tone])}>{value}</span>;
}

export function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
        active ? "bg-elevated text-navy shadow-card" : "bg-surface text-muted hover:bg-soft hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}

export function MockFlag() {
  return (
    <p className="pointer-events-none fixed right-4 bottom-4 z-30 rounded-full bg-navy px-3 py-1.5 text-[0.7rem] font-medium text-elevated shadow-lift">
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-blue" />
      Usage is illustrative — inbound leads are live
    </p>
  );
}
