/** Staff lifecycle: inbound lead → enrollment → disenrollment. Not MARx. */

export const LEAD_STAGES = [
  "new",
  "contacted",
  "soa",
  "appointed",
  "presented",
  "submitted",
  "enrolled",
  "reviewing",
  "disenroll_pending",
  "disenrolled",
  "closed_lost",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const STAGE_LABEL: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  soa: "SOA on file",
  appointed: "Appointment",
  presented: "Options presented",
  submitted: "App submitted",
  enrolled: "Enrolled",
  reviewing: "AEP / review",
  disenroll_pending: "Disenroll pending",
  disenrolled: "Disenrolled",
  closed_lost: "Closed — no enroll",
};

export const PIPELINE_ORDER: LeadStage[] = [
  "new",
  "contacted",
  "soa",
  "appointed",
  "presented",
  "submitted",
  "enrolled",
  "reviewing",
  "disenroll_pending",
  "disenrolled",
];

export const DISENROLL_REASONS = [
  { id: "voluntary", label: "Beneficiary request" },
  { id: "other_plan", label: "Chose another plan (AEP/SEP)" },
  { id: "moved", label: "Moved out of service area" },
  { id: "eligibility", label: "Loss of eligibility" },
  { id: "cms", label: "CMS / plan involuntary" },
  { id: "death", label: "Death" },
  { id: "other", label: "Other — note required" },
] as const;

export type DisenrollReason = (typeof DISENROLL_REASONS)[number]["id"];

const NEXT: Record<LeadStage, LeadStage[]> = {
  new: ["contacted", "closed_lost"],
  contacted: ["soa", "appointed", "closed_lost"],
  soa: ["appointed", "closed_lost"],
  appointed: ["presented", "closed_lost"],
  presented: ["submitted", "closed_lost"],
  submitted: ["enrolled", "closed_lost"],
  enrolled: ["reviewing", "disenroll_pending"],
  reviewing: ["enrolled", "disenroll_pending"],
  disenroll_pending: ["disenrolled", "enrolled"],
  disenrolled: [],
  closed_lost: ["contacted"],
};

export function normalizeStage(value: string | null | undefined): LeadStage {
  if (value === "scheduled") return "appointed";
  if (value === "closed") return "closed_lost";
  if ((LEAD_STAGES as readonly string[]).includes(value ?? "")) return value as LeadStage;
  return "new";
}

export function nextStages(current: LeadStage): LeadStage[] {
  return NEXT[current] ?? [];
}

export function isTerminal(stage: LeadStage) {
  return stage === "disenrolled";
}

export const LIFECYCLE_DISCLAIMER =
  "Agency bookkeeping — not MARx, not CMS, not an enrollment transaction. A licensed agent still submits the application with the carrier.";
