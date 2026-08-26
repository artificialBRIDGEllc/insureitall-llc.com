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
        session?.sendUserMessage("Hi");
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
    onDisconnect: () => {
      session = null;
      flushTranscript();
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

  try {
    session = token.signedUrl
      ? ((await Conversation.startSession({
          signedUrl: token.signedUrl,
          connectionType: "websocket",
          ...shared,
        })) as Session)
      : ((await Conversation.startSession({
          agentId,
          connectionType: "webrtc",
          ...shared,
        })) as Session);
    session.setMicMuted(false);
  } catch (err) {
    session = null;
    const kind = classifyMicError(err);
    if (kind !== "mic-other") {
      fail(kind);
      return;
    }
    fail(
      "agent",
      err instanceof Error
        ? err.message
        : "Allow this origin on the agent, or turn agent auth off.",
    );
  }
}
