import type { OpsRequest } from "@/lib/ops";
import { normalizeStage, STAGE_LABEL, type LeadStage } from "@/lib/lead-lifecycle";

export type DateRange = "7d" | "30d" | "aep";

export type LeadSource =
  | "BRIDGEt voice"
  | "BRIDGEt chat"
  | "Callback form"
  | "Needs analysis";

export type LeadDisposition = LeadStage;

export type ConsoleLead = {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  source: LeadSource;
  bestTime: string;
  consentLabel: string;
  receivedLabel: string;
  receivedAt: string;
  disposition: LeadDisposition;
  live: boolean;
  notes: string;
  doctors: string;
  medications: string;
  disenrollReason: string;
};

export type TopicStat = { label: string; count: number };

export type ConsoleKpis = {
  visitors: number;
  visitorDelta: string;
  sessions: number;
  sessionDelta: string;
  callbacks: number;
  callbackDelta: string;
  convertRate: string;
  convertNote: string;
};

export type SessionRow = {
  id: string;
  started: string;
  channel: "Voice" | "Typed chat";
  topic: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Frustrated";
  guardrail: boolean;
  leadId: string | null;
};

export type AuditRow = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export const SAMPLE_LEADS: ConsoleLead[] = [
  {
    id: "SPL-DOROTHY",
    name: "Dorothy Alvarez",
    location: "Round Rock, TX",
    phone: "(512) 555-0148",
    email: "",
    source: "BRIDGEt voice",
    bestTime: "Mornings",
    consentLabel: "Given 3:41pm",
    receivedLabel: "Today",
    receivedAt: new Date().toISOString(),
    disposition: "new",
    live: false,
    notes: "",
    doctors: "",
    medications: "",
    disenrollReason: "",
  },
  {
    id: "SPL-WALTER",
    name: "Walter Kim",
    location: "Georgetown, TX",
    phone: "(737) 555-0192",
    email: "",
    source: "Callback form",
    bestTime: "After 3pm",
    consentLabel: "Given 1:05pm",
    receivedLabel: "Today",
    receivedAt: new Date().toISOString(),
    disposition: "contacted",
    live: false,
    notes: "",
    doctors: "",
    medications: "",
    disenrollReason: "",
  },
  {
    id: "SPL-PATRICIA",
    name: "Patricia Nguyen",
    location: "",
    phone: "(512) 555-0117",
    email: "",
    source: "BRIDGEt voice",
    bestTime: "—",
    consentLabel: "Given 11:22am",
    receivedLabel: "Yesterday",
    receivedAt: new Date(Date.now() - 86400000).toISOString(),
    disposition: "appointed",
    live: false,
    notes: "",
    doctors: "",
    medications: "",
    disenrollReason: "",
  },
  {
    id: "SPL-HAROLD",
    name: "Harold Bennett",
    location: "Tampa, FL",
    phone: "(813) 555-2204",
    email: "",
    source: "Needs analysis",
    bestTime: "Midday",
    consentLabel: "Given 9:18am",
    receivedLabel: "Yesterday",
    receivedAt: new Date(Date.now() - 86400000).toISOString(),
    disposition: "new",
    live: false,
    notes: "",
    doctors: "",
    medications: "",
    disenrollReason: "",
  },
  {
    id: "SPL-INEZ",
    name: "Inez Morales",
    location: "Prosper, TX",
    phone: "(469) 555-0881",
    email: "",
    source: "BRIDGEt chat",
    bestTime: "Mornings",
    consentLabel: "Given 4:02pm",
    receivedLabel: "2d ago",
    receivedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    disposition: "contacted",
    live: false,
    notes: "",
    doctors: "",
    medications: "",
    disenrollReason: "",
  },
  {
    id: "SPL-EARL",
    name: "Earl Whitaker",
    location: "Lakeland, FL",
    phone: "(863) 555-4410",
    email: "",
    source: "Callback form",
    bestTime: "After 3pm",
    consentLabel: "Given 2:11pm",
    receivedLabel: "3d ago",
    receivedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    disposition: "appointed",
    live: false,
    notes: "",
    doctors: "",
    medications: "",
    disenrollReason: "",
  },
];

export const CONSOLE_KPIS: Record<DateRange, ConsoleKpis> = {
  "7d": {
    visitors: 4812,
    visitorDelta: "12% vs prior 7d",
    sessions: 396,
    sessionDelta: "8% vs prior 7d",
    callbacks: 41,
    callbackDelta: "3 vs prior 7d",
    convertRate: "10.4%",
    convertNote: "steady",
  },
  "30d": {
    visitors: 18440,
    visitorDelta: "6% vs prior 30d",
    sessions: 1512,
    sessionDelta: "4% vs prior 30d",
    callbacks: 158,
    callbackDelta: "11 vs prior 30d",
    convertRate: "10.5%",
    convertNote: "steady",
  },
  aep: {
    visitors: 9204,
    visitorDelta: "AEP-to-date",
    sessions: 870,
    sessionDelta: "AEP-to-date",
    callbacks: 96,
    callbackDelta: "AEP-to-date",
    convertRate: "11.0%",
    convertNote: "up vs last AEP",
  },
};

export const VOICE_SHARE = 0.63;

export const TOPIC_STATS: TopicStat[] = [
  { label: "Medicare Advantage vs Original Medicare", count: 128 },
  { label: "Enrollment windows / AEP timing", count: 96 },
  { label: "Medigap vs Advantage", count: 74 },
  { label: "Part D drug coverage basics", count: 52 },
];

export const SESSION_FOOT = {
  avgLength: "4m 12s",
  positive: "92%",
  guardrails: 0,
};

export const CONSENT_ROWS = [
  {
    label: "Voice audio recorded",
    value: "Never",
    tone: "alert" as const,
    note: "BRIDGEt does not keep a copy of the visitor’s voice. ElevenLabs processes the live turn; we do not archive audio.",
  },
  {
    label: "Transcript retention",
    value: "30 days",
    tone: "ink" as const,
    note: "Page-aware chat text, no Medicare numbers, no SSNs. Auto-deletes after 30 days.",
  },
  {
    label: "Callback consent required",
    value: "Enforced server-side",
    tone: "ok" as const,
    note: "TCPA opt-in is a hard gate on /lead and /needs-analysis. Not a purchase condition.",
  },
  {
    label: "Health info in lead records",
    value: "Blocked by design",
    tone: "alert" as const,
    note: "BRIDGEt transcripts never store PHI. Optional doctor/medication notes exist only on a needs-analysis form the consumer typed, visible to staff — not to the LLM.",
  },
];

export const SAMPLE_SESSIONS: SessionRow[] = [
  {
    id: "SES-8F2A",
    started: "Today · 3:38pm",
    channel: "Voice",
    topic: "Medicare Advantage vs Original Medicare",
    duration: "5m 02s",
    sentiment: "Positive",
    guardrail: false,
    leadId: "SPL-DOROTHY",
  },
  {
    id: "SES-1C90",
    started: "Today · 1:01pm",
    channel: "Typed chat",
    topic: "Enrollment windows / AEP timing",
    duration: "3m 41s",
    sentiment: "Neutral",
    guardrail: false,
    leadId: "SPL-WALTER",
  },
  {
    id: "SES-44B1",
    started: "Yesterday · 11:16am",
    channel: "Voice",
    topic: "Medigap vs Advantage",
    duration: "6m 18s",
    sentiment: "Positive",
    guardrail: false,
    leadId: "SPL-PATRICIA",
  },
  {
    id: "SES-9AA2",
    started: "Yesterday · 9:44am",
    channel: "Typed chat",
    topic: "Part D drug coverage basics",
    duration: "2m 09s",
    sentiment: "Frustrated",
    guardrail: false,
    leadId: null,
  },
  {
    id: "SES-220E",
    started: "2d ago · 4:12pm",
    channel: "Voice",
    topic: "Enrollment windows / AEP timing",
    duration: "4m 33s",
    sentiment: "Positive",
    guardrail: false,
    leadId: "SPL-INEZ",
  },
];

export const SAMPLE_AUDIT: AuditRow[] = [
  {
    id: "AUD-1",
    at: "Today · 3:44pm",
    actor: "system",
    action: "Lead created",
    detail: "BRIDGEt voice session handed Dorothy Alvarez to /lead with TCPA consent.",
  },
  {
    id: "AUD-2",
    at: "Today · 1:08pm",
    actor: "system",
    action: "Consent captured",
    detail: "Callback form consent recorded for Walter Kim. Not a condition of purchase.",
  },
  {
    id: "AUD-3",
    at: "Today · 10:02am",
    actor: "BRIDGEt",
    action: "Guardrail held",
    detail: "Visitor asked BRIDGEt to pick a plan. She declined and offered a licensed agent.",
  },
  {
    id: "AUD-4",
    at: "Yesterday · 4:19pm",
    actor: "staff",
    action: "Share code opened",
    detail: "Consumer file opened in scoped ops. No Medicare number present.",
  },
  {
    id: "AUD-5",
    at: "Yesterday · 11:22am",
    actor: "system",
    action: "Lead created",
    detail: "BRIDGEt voice session created a callback for Patricia Nguyen.",
  },
];

export const FEATURE_STATS = [
  { label: "Widget opened", count: 612, share: 0.82 },
  { label: "Talk with me → /bridget", count: 214, share: 0.54 },
  { label: "Call from widget", count: 88, share: 0.22 },
  { label: "Callback form started", count: 61, share: 0.15 },
  { label: "Needs analysis started", count: 29, share: 0.07 },
  { label: "Plan compare used", count: 176, share: 0.44 },
];

const WINDOW_LABEL: Record<string, string> = {
  morning: "Mornings",
  mid: "Midday",
  afternoon: "After 3pm",
};

function sourceFromKind(kind: string): LeadSource {
  if (kind === "needs") return "Needs analysis";
  return "Callback form";
}

function receivedLabel(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const days = Math.floor((Date.now() - t) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function consentLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Given";
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const hour = ((h + 11) % 12) + 1;
  const ap = h >= 12 ? "pm" : "am";
  return `Given ${hour}:${m}${ap}`;
}

export function opsToLead(row: OpsRequest): ConsoleLead {
  const disposition = normalizeStage(row.stage || row.disposition);
  return {
    id: row.id,
    name: row.firstName || row.email || "Consumer",
    location: row.zip ? `ZIP ${row.zip}` : "",
    phone: row.phone,
    email: row.email,
    source: (row.source as LeadSource) || sourceFromKind(row.kind),
    bestTime: WINDOW_LABEL[row.callbackWindow] ?? row.callbackWindow ?? "—",
    consentLabel: consentLabel(row.consentAt || row.createdAt),
    receivedLabel: receivedLabel(row.createdAt),
    receivedAt: row.createdAt,
    disposition,
    live: true,
    notes: row.notes,
    doctors: row.doctors,
    medications: row.medications,
    disenrollReason: row.disenrollReason,
  };
}

export function mergeLeads(live: OpsRequest[]): ConsoleLead[] {
  const mapped = live.map(opsToLead);
  const livePhones = new Set(mapped.map((l) => l.phone.replace(/\D/g, "")));
  const samples = SAMPLE_LEADS.filter((s) => !livePhones.has(s.phone.replace(/\D/g, "")));
  return [...mapped, ...samples];
}

export function leadFilterCounts(rows: ConsoleLead[]) {
  return {
    all: rows.length,
    open: rows.filter((r) => !["enrolled", "disenrolled", "closed_lost"].includes(r.disposition)).length,
    enrolled: rows.filter((r) => r.disposition === "enrolled" || r.disposition === "reviewing").length,
    ended: rows.filter((r) => r.disposition === "disenrolled" || r.disposition === "closed_lost").length,
  };
}

export const DISPOSITION_LABEL: Record<string, string> = { ...STAGE_LABEL, scheduled: "Appointment", closed: "Closed — no enroll" };
