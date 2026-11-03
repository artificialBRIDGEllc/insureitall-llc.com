// Step definitions and gating for the onboarding portal.
// Matches the process in the Nov 3, 2026 build plan.
// Steps that don't apply are skipped based on worker_type and flags.

export type WorkerType = "1099_remote" | "1099_inoffice" | "w2";

export interface StepDef {
  key: string;
  title: string;
  appliesTo: (hire: { workerType: WorkerType; isTeamLead?: boolean; isAgentPlatform?: boolean }) => boolean;
  hasQuestions?: boolean;
  hasOwnerSection?: boolean;
  ownerRole?: "ops" | "team_lead";
  requiresInitials?: boolean;
}

export const ONBOARDING_STEPS: StepDef[] = [
  { key: "intake", title: "Intake form", appliesTo: () => true, hasQuestions: true },
  { key: "checkr", title: "Checkr background check", appliesTo: () => true },
  { key: "hr-002", title: "HR-002", appliesTo: () => true, hasQuestions: true },
  { key: "cre-005", title: "CRE-005", appliesTo: () => true },
  { key: "ica", title: "Independent Contractor Agreement", appliesTo: (h) => h.workerType.startsWith("1099") },
  { key: "hr-007-009", title: "HR-007, HR-008, HR-009", appliesTo: () => true },
  { key: "hr-012", title: "HR-012", appliesTo: () => true, hasQuestions: true },
  { key: "hr-010", title: "HR-010", appliesTo: (h) => h.workerType === "w2" },
  { key: "hr-011", title: "HR-011", appliesTo: (h) => h.workerType.startsWith("1099") },
  { key: "hr-006", title: "HR-006", appliesTo: () => true, hasQuestions: true },
  { key: "cre-003", title: "CRE-003", appliesTo: () => true, requiresInitials: true },
  { key: "cre-002", title: "CRE-002 (Schedule A)", appliesTo: (h) => !!h.isAgentPlatform, hasOwnerSection: true, ownerRole: "ops" },
  { key: "comp-plan", title: "Sales compensation plan", appliesTo: () => true },
  { key: "tl-comp-plan", title: "Team Lead compensation plan", appliesTo: (h) => !!h.isTeamLead },
  { key: "handbook", title: "Handbook acknowledgment", appliesTo: () => true },
  { key: "manual", title: "Manual acknowledgment", appliesTo: () => true },
  { key: "policies", title: "Policy acknowledgments", appliesTo: () => true, requiresInitials: true },
  { key: "qa-coaching", title: "QA coaching 3.1-A", appliesTo: () => true, hasOwnerSection: true, ownerRole: "team_lead" },
];

export function applicableSteps(hire: { workerType: WorkerType; isTeamLead?: boolean; isAgentPlatform?: boolean }): StepDef[] {
  return ONBOARDING_STEPS.filter((s) => s.appliesTo(hire));
}

export const ANNUAL_REFRESH_STEPS = ["hr-006", "hr-007-009", "hr-011", "hr-012"];
