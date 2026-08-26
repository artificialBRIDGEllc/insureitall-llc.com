import ledger from "./debt.ledger.json";
import p0 from "./debt.p0.json";

export type DebtSeverity = "p0" | "p1" | "p2" | "p3";
export type DebtStatus = "open" | "watch" | "resolved";
export type DebtArea = "brand" | "voice" | "compliance" | "ops" | "infra";

export type DebtClearsWhen = {
  missingFile?: string;
  fileExists?: string;
  filesExist?: string[];
  missingPattern?: string;
  noHardcodedAvatars?: boolean;
} | null;

export type DebtItem = {
  id: string;
  title: string;
  severity: DebtSeverity;
  status: DebtStatus;
  area: DebtArea;
  why: string;
  next: string;
  clearsWhen: DebtClearsWhen;
};

export type P0Playbook = {
  id: string;
  title: string;
  firesWhen: string;
  verify: string;
  doneWhen: string;
  steps: string[];
  files?: Record<string, string[]>;
};

export const DEBT_UPDATED = ledger.updated;
export const DEBT_LEDGER = ledger.items as DebtItem[];
export const P0_PLAYBOOKS = p0.playbooks as P0Playbook[];

export const DEBT_SEVERITY_ORDER: DebtSeverity[] = ["p0", "p1", "p2", "p3"];

export function playbookById(id: string) {
  return P0_PLAYBOOKS.find((p) => p.id === id);
}

export function p0LedgerItems() {
  return DEBT_LEDGER.filter((item) => item.severity === "p0");
}

export function debtByStatus(status: DebtStatus | "all") {
  if (status === "all") return DEBT_LEDGER;
  return DEBT_LEDGER.filter((item) => item.status === status);
}

export function countBySeverity(items: DebtItem[] = DEBT_LEDGER) {
  const counts: Record<DebtSeverity, number> = { p0: 0, p1: 0, p2: 0, p3: 0 };
  for (const item of items) {
    if (item.status === "resolved") continue;
    counts[item.severity] += 1;
  }
  return counts;
}

/** What the automated scanner enforces on every `npm run debt`. */
export const DEBT_GATES = [
  {
    id: "markers",
    label: "TODO / FIXME / HACK / DEBT markers in src/",
    severity: "p2" as const,
  },
  {
    id: "forbidden",
    label: "Rolled-back files (cutout, door transition) stay gone",
    severity: "p0" as const,
    playbook: "cutout-rollback",
  },
  {
    id: "legal",
    label: "Required legal pages including HIPAA, GLBA, security exist",
    severity: "p0" as const,
    playbook: "legal-pages",
  },
  {
    id: "avatars",
    label: "No hardcoded BRIDGEt avatar URLs outside bridget-assets.ts",
    severity: "p1" as const,
  },
  {
    id: "ledger",
    label: "Ledger clearsWhen conditions match the tree",
    severity: "p1" as const,
  },
] as const;
