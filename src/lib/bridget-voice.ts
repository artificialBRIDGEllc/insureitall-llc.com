import { ELEVENLABS_AGENT_ID } from "@/lib/elevenlabs";
import { track } from "@/lib/track";
// @ts-expect-error -- JS redaction
import { redactTranscript } from "../../scripts/feedback-loop.mjs";

export type BridgetVoiceMode = "listening" | "speaking";
export type BridgetVoicePhase = "idle" | "connecting" | "live" | "error";
export type BridgetVoiceErrorKind =
  | "mic-denied"
  | "mic-dismissed"
  | "mic-missing"
  | "mic-busy"
  | "mic-insecure"
  | "mic-unsupported"
  | "mic-other"
  | "agent";

export type BridgetVoiceState = {
  phase: BridgetVoicePhase;
  mode: BridgetVoiceMode;
  error: string | null;
  errorKind: BridgetVoiceErrorKind | null;
};

type Session = {
  endSession: () => Promise<void>;
  sendUserMessage: (text: string) => void;
  sendContextualUpdate: (text: string) => void;
  setMicMuted: (muted: boolean) => void;
};

type Turn = { role: "user" | "agent"; text: string };

const FIRST =
  "Hey — I’m BRIDGEt, your Medicare advocate. I don’t enroll anyone and I’m not Medicare. What’s the one thing that’s been spinning in your head?";

const KICKOFF =
  "Visitor tapped Talk with me on the INSUREitALL public site. They have not shared PHI. Greet them briefly as BRIDGEt, then ask what matters. Never enroll. Never ask for SSN or a Medicare number.";

const MIC: Record<BridgetVoiceErrorKind, string> = {
  "mic-denied":
    "Microphone is blocked for this site. In the address bar, open site settings, set Microphone to Allow, then tap Try again.",
  "mic-dismissed":
    "The mic prompt was closed before you chose. Tap Try again and select Allow so BRIDGEt can hear you.",
  "mic-missing":
    "No microphone was found. Plug one in or use a device with a mic, then tap Try again.",
  "mic-busy":
    "Another app is using the microphone. Close that call or tab, then tap Try again.",
  "mic-insecure":
    "This page isn’t a secure (HTTPS) context, so the browser won’t share the mic. Open the live site and try again.",
  "mic-unsupported":
    "This browser can’t share a microphone. Try Chrome, Edge, or Safari on this same page.",
  "mic-other":
    "The microphone didn’t start. Check system privacy settings for the browser, then tap Try again.",
  agent: "Could not start BRIDGEt’s voice.",
};

const DROP =
  "Voice connected then closed before BRIDGEt could speak. Tap Try again. If it keeps dropping, this Vercel project needs ELEVENLABS_API_KEY so the session can use a signed URL.";

let session: Session | null = null;
let turns: Turn[] = [];
let transcriptPath = "/";
let flushed = false;
let state: BridgetVoiceState = {
  phase: "idle",
  mode: "listening",
  error: null,
  errorKind: null,
};
const listeners = new Set<(s: BridgetVoiceState) => void>();

function emit(next: Partial<BridgetVoiceState>) {
  state = { ...state, ...next };
  listeners.forEach((fn) => fn(state));
}

function fail(kind: BridgetVoiceErrorKind, extra?: string) {
  emit({
    phase: "error",
    mode: "listening",
    errorKind: kind,
    error: extra ? `${MIC[kind]} ${extra}` : MIC[kind],
  });
}

function resetTranscript(path: string) {
  turns = [];
  flushed = false;
  transcriptPath = path;
}

function pushTurn(role: Turn["role"], text: string) {
  const clean = redactTranscript(text);
  if (!clean) return;
  const last = turns[turns.length - 1];
  if (last && last.role === role) {
    last.text = `${last.text} ${clean}`.slice(0, 600);
    return;
  }
  if (turns.length >= 80) return;
  turns.push({ role, text: clean.slice(0, 600) });
}

function flushTranscript() {
  if (flushed || turns.length === 0) return;
  flushed = true;
  track("voice_transcript", { turns: JSON.stringify(turns), n: String(turns.length) });
  turns = [];
}

export function getBridgetVoiceState() {
  return state;
}

export function subscribeBridgetVoice(fn: (s: BridgetVoiceState) => void) {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}

export async function stopBridgetVoice() {
  const current = session;
  session = null;
  flushTranscript();
  try {
    await current?.endSession();
  } catch {
    /* ignore */
  }
  emit({ phase: "idle", mode: "listening", error: null, errorKind: null });
}

function nameOf(err: unknown) {
  if (err && typeof err === "object" && "name" in err) {
    return String((err as { name: string }).name);
  }
  return "";
}

function classifyMicError(err: unknown): BridgetVoiceErrorKind {
  const name = nameOf(err);
  const message = err instanceof Error ? err.message.toLowerCase() : "";

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    if (/dismiss|prompt/i.test(message)) return "mic-dismissed";
    return "mic-denied";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") return "mic-missing";
  if (name === "NotReadableError" || name === "TrackStartError" || name === "AbortError") {
    return "mic-busy";
  }
  if (name === "SecurityError") return "mic-insecure";
  if (name === "NotSupportedError" || name === "TypeError") return "mic-unsupported";
  if (/denied|permission/i.test(message)) return "mic-denied";
  if (/not found|device/i.test(message)) return "mic-missing";
  return "mic-other";
}

async function permissionState(): Promise<PermissionState | "unknown"> {
  try {
    const status = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return status.state;
  } catch {
    return "unknown";
  }
}

/** Must run inside the click handler — no awaits before this, or the browser will skip the prompt. */
export function beginMic(): Promise<MediaStream> {
  if (typeof window === "undefined" || !window.isSecureContext) {
    return Promise.reject(Object.assign(new Error("insecure"), { name: "SecurityError" }));
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return Promise.reject(Object.assign(new Error("unsupported"), { name: "NotSupportedError" }));
  }
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true },
  });
}

function waitForPhase(ms: number) {
  return new Promise<"live" | "error" | "timeout">((resolve) => {
    if (state.phase === "live") return resolve("live");
    if (state.phase === "error") return resolve("error");
    let unsub = () => {};
    const timer = window.setTimeout(() => {
      unsub();
      resolve(timeoutSafe());
    }, ms);
    unsub = subscribeBridgetVoice((s) => {
      if (s.phase === "live" || s.phase === "error") {
        window.clearTimeout(timer);
        unsub();
        resolve(s.phase);
      }
    });
  });
}

function timeoutSafe(): "live" | "error" | "timeout" {
  if (state.phase === "live") return "live";
  if (state.phase === "error") return "error";
  return "timeout";
}

function disconnectNote(details: unknown) {
  if (!details || typeof details !== "object") return "";
  const row = details as { reason?: string; message?: string };
  if (row.reason === "error" && row.message) return row.message;
  if (row.reason && row.reason !== "user") return row.reason;
  return "";
}

export async function startBridgetVoice(pagePath: string, micPromise?: Promise<MediaStream>) {
  if (state.phase === "connecting" || state.phase === "live") return;
  const pending = micPromise ?? beginMic();
  resetTranscript(pagePath);
  emit({ phase: "connecting", mode: "listening", error: null, errorKind: null });

  try {
    const stream = await pending;
    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    const kind = classifyMicError(err);
    if (kind === "mic-denied") {
      const prior = await permissionState();
      fail(prior === "prompt" || prior === "unknown" ? "mic-dismissed" : "mic-denied");
      return;
    }
    fail(kind);
    return;
  }

  await new Promise((r) => window.setTimeout(r, 80));

  let token: {
    ok?: boolean;
    mode?: string;
    agentId?: string;
    signedUrl?: string;
    hint?: string;
  } = {};
  try {
    const res = await fetch("/api/bridget-voice");
    token = (await res.json()) as typeof token;
  } catch {
    token = { ok: true, mode: "public", agentId: ELEVENLABS_AGENT_ID };
  }

  if (token.ok === false) {
    fail("agent", token.hint);
    return;
  }

  const { Conversation } = await import("@elevenlabs/client");
  const agentId = token.agentId || ELEVENLABS_AGENT_ID;
  let drop = "";
  let retrying = false;

  const shared = {
    overrides: {
      agent: { firstMessage: FIRST },
    },
    dynamicVariables: {
      page: pagePath,
    },
    onConnect: () => {
      emit({ phase: "live", error: null, errorKind: null });
      try {
        session?.sendContextualUpdate(`${KICKOFF} Page: ${transcriptPath}.`);
      } catch {
        /* agent may already be speaking */
      }
    },
    onMessage: ({ message, role }: { message: string; role?: string }) => {
      const who = role === "user" ? "user" : "agent";
      pushTurn(who, message);
    },
    onModeChange: ({ mode }: { mode: string }) => {
      if (mode === "speaking" || mode === "listening") {
        emit({ mode });
      }
    },
    onDisconnect: (details?: unknown) => {
      session = null;
      flushTranscript();
      if (retrying) return;
      if (state.phase === "connecting") {
        drop = disconnectNote(details) || drop;
        return;
      }
      if (state.phase !== "error") {
        emit({ phase: "idle", mode: "listening", error: null, errorKind: null });
      }
    },
    onError: (message: string) => {
      const kind = /mic|permission|notallowed/i.test(message)
        ? classifyMicError({ name: "NotAllowedError", message })
        : "agent";
      fail(kind, kind === "agent" ? message : undefined);
    },
  };

  async function open(opts: { signedUrl: string; connectionType: "websocket" } | { agentId: string; connectionType: "websocket" | "webrtc" }) {
    const next = (await Conversation.startSession({
      ...shared,
      ...opts,
    } as Parameters<typeof Conversation.startSession>[0])) as Session;
    try {
      next.setMicMuted(false);
    } catch {
      /* session may already be live */
    }
    return next;
  }

  try {
    if (token.signedUrl) {
      session = await open({ signedUrl: token.signedUrl, connectionType: "websocket" });
    } else {
      try {
        session = await open({ agentId, connectionType: "websocket" });
      } catch (first) {
        drop = first instanceof Error ? first.message : drop;
        session = await open({ agentId, connectionType: "webrtc" });
      }
    }
  } catch (err) {
    session = null;
    const kind = classifyMicError(err);
    if (kind !== "mic-other") {
      fail(kind);
      return;
    }
    fail("agent", err instanceof Error ? err.message : DROP);
    return;
  }

  let outcome = await waitForPhase(5000);
  if (outcome === "timeout" && getBridgetVoiceState().phase === "connecting" && !token.signedUrl) {
    retrying = true;
    const current = session;
    session = null;
    try {
      await current?.endSession();
    } catch {
      /* ignore */
    }
    retrying = false;
    try {
      session = await open({ agentId, connectionType: "webrtc" });
    } catch (err) {
      fail("agent", err instanceof Error ? `${DROP} ${err.message}` : DROP);
      return;
    }
    outcome = await waitForPhase(5000);
  }

  if (getBridgetVoiceState().phase === "connecting") {
    try {
      await session?.endSession();
    } catch {
      /* ignore */
    }
    session = null;
    fail("agent", drop ? `${DROP} (${drop})` : DROP);
  }
}
