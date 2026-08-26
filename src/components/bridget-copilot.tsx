import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BridgetMark, BridgetWordmark } from "@/components/bridget-wordmark";
import { CallLink } from "@/components/call-link";
import { BRIDGET_AVATAR } from "@/lib/bridget-assets";
import {
  beginMic,
  startBridgetVoice,
  stopBridgetVoice,
  subscribeBridgetVoice,
  type BridgetVoiceState,
} from "@/lib/bridget-voice";
import { IDENT_SESSION_KEY } from "@/lib/ident";
import { PHONE_DISPLAY } from "@/lib/utils";
import { track } from "@/lib/track";

const GREETINGS: Record<string, string> = {
  "/": "I’m your Medicare advocate. Want a calm first pass before you call?",
  "/compare": "This is a type-level audit — gained, sacrificed, watch. Not every plan in your zip. A licensed agent takes it from here.",
  "/needs-analysis": "Tell me what matters. Then a licensed agent compares what’s actually offered.",
  "/lead": "I’ll get you to a real person. I never enroll anyone.",
  "/bridget": "I’m BRIDGEt, your Medicare advocate. Humor, then the next right step.",
  "/contact": "Call, or leave a number. I’ll make sure a licensed agent gets it.",
  "/medicare-basics": "Parts A–D and the type table. When you’re ready, the Plan Choice Audit walks the trade-offs.",
};

const GREETED = "iia-widget-greeted";
const HOLD_MS = 5600;

export function BridgetCopilot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [intro, setIntro] = useState(false);
  const [voice, setVoice] = useState<BridgetVoiceState>({
    phase: "idle",
    mode: "listening",
    error: null,
    errorKind: null,
  });
  const userTouched = useRef(false);
  const closeTimer = useRef<number>(0);
  const line = GREETINGS[pathname] ?? GREETINGS["/bridget"];
  const hidden = pathname.startsWith("/portal") || pathname.startsWith("/console");
  const live = voice.phase === "connecting" || voice.phase === "live";

  useEffect(() => subscribeBridgetVoice(setVoice), []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(GREETED)) return;
    } catch {
      /* ignore */
    }

    let started = false;
    let openTimer = 0;

    const start = () => {
      if (started || userTouched.current) return;
      started = true;
      openTimer = window.setTimeout(() => {
        setOpen(true);
        setIntro(true);
        track("widget_open");
        try {
          sessionStorage.setItem(GREETED, "1");
        } catch {
          /* ignore */
        }
        closeTimer.current = window.setTimeout(() => {
          if (userTouched.current) return;
          setOpen(false);
          setIntro(false);
        }, HOLD_MS);
      }, 420);
    };

    try {
      if (sessionStorage.getItem(IDENT_SESSION_KEY) && !document.querySelector(".ident-splash")) {
        start();
      }
    } catch {
      start();
    }

    window.addEventListener("iia-splash-done", start);
    return () => {
      window.removeEventListener("iia-splash-done", start);
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  function touch() {
    userTouched.current = true;
    window.clearTimeout(closeTimer.current);
    setIntro(false);
  }

  function toggle() {
    touch();
    setOpen((v) => {
      const next = !v;
      if (next) track("widget_open");
      return next;
    });
  }

  async function talk() {
    touch();
    setOpen(true);
    track("widget_cta", { cta: "talk" });
    if (live) {
      await stopBridgetVoice();
      return;
    }
    const mic = beginMic();
    await startBridgetVoice(pathname, mic);
  }

  if (hidden) return null;

  const talkLabel =
    voice.phase === "connecting"
      ? "Connecting…"
      : voice.phase === "live"
        ? "End conversation"
        : voice.phase === "error"
          ? "Try again"
          : "Talk with me";

  return (
    <div className="bridget-dock">
      {open ? (
        <div
          className="bridget-panel"
          role="dialog"
          aria-label="BRIDGEt, your Medicare advocate"
          onPointerDown={touch}
        >
          <div className="flex items-center gap-3 bg-navy px-4 py-3 text-elevated">
            <BridgetMark invert className="text-4xl" />
            <div className="min-w-0">
              <BridgetWordmark invert className="text-lg" />
              <p className="text-[11px] text-elevated/70">
                {voice.phase === "live"
                  ? voice.mode === "speaking"
                    ? "Speaking · not a licensed agent"
                    : "Listening · not a licensed agent"
                  : "Advocate · not a licensed agent"}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto rounded-full px-2 py-1 text-sm text-elevated/80 hover:bg-white/10"
              onClick={toggle}
              aria-label="Close BRIDGEt"
            >
              ×
            </button>
          </div>
          <div className="space-y-3 p-4 text-sm text-ink">
            <p>
              {voice.phase === "live"
                ? voice.mode === "speaking"
                  ? "I’m on it — give me a second."
                  : "I’m listening. Speak naturally."
                : intro
                  ? "Hey — I’m right here if the alphabet soup starts spinning."
                  : line}
            </p>
            {voice.error ? (
              <div
                className="rounded-xl bg-soft px-3 py-2 text-xs text-navy"
                role="alert"
              >
                <p className="font-medium">
                  {voice.errorKind?.startsWith("mic-")
                    ? "Microphone"
                    : "Voice"}
                </p>
                <p className="mt-1">{voice.error}</p>
              </div>
            ) : null}
            <p className="text-xs text-muted">
              I don’t enroll. I don’t take health details. When you’re ready, a
              licensed agent compares plans we actually offer in your area.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-xl bg-blue px-3 py-2 text-xs font-medium text-elevated shadow-elevation-brand"
                onClick={() => void talk()}
                disabled={voice.phase === "connecting"}
              >
                {talkLabel}
              </button>
              <CallLink
                className="rounded-xl bg-navy px-3 py-2 text-xs font-medium text-elevated"
                onClick={() => track("widget_cta", { cta: "call" })}
              >
                Call {PHONE_DISPLAY}
              </CallLink>
              <Link
                to="/lead"
                className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-navy"
                onClick={() => {
                  track("widget_cta", { cta: "callback" });
                  setOpen(false);
                }}
              >
                Call me back
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="bridget-peek" onClick={toggle}>
          Need a hand?
        </button>
      )}
      <button
        type="button"
        className="bridget-launcher"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close BRIDGEt" : "Open BRIDGEt, your Medicare advocate"}
      >
        <span className="bridget-launcher-ring" aria-hidden />
        <span className="bridget-launcher-ring bridget-launcher-ring-late" aria-hidden />
        <span className="bridget-launcher-face">
          <img src={BRIDGET_AVATAR.bust} alt="" width={128} height={128} />
        </span>
        <span className="bridget-launcher-name">BRIDGEt</span>
      </button>
    </div>
  );
}
