import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BridgetMark, BridgetWordmark } from "@/components/bridget-wordmark";
import { CallLink } from "@/components/call-link";
import { PHONE_DISPLAY } from "@/lib/utils";

const GREETINGS: Record<string, string> = {
  "/": "I’m your Medicare advocate. Want a calm first pass before you call?",
  "/compare": "This page is plan types — not every plan in your zip. I can walk the tradeoffs.",
  "/screener": "Anonymous, two minutes. I’ll stay with you. No name, no phone.",
  "/needs-analysis": "Tell me what matters. Then a licensed agent compares what’s actually offered.",
  "/lead": "I’ll get you to a real person. I never enroll anyone.",
  "/bridget": "I’m BRIDGEt, your Medicare advocate. Humor, then the next right step.",
  "/contact": "Call, or leave a number. I’ll make sure a licensed agent gets it.",
  "/medicare-basics": "Original, Advantage, Supplement, Part D — I’ll keep the jargon off the table.",
};

const GREETED = "iia-widget-greeted";
const HOLD_MS = 5600;

export function BridgetCopilot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [intro, setIntro] = useState(false);
  const userTouched = useRef(false);
  const closeTimer = useRef<number>(0);
  const line = GREETINGS[pathname] ?? GREETINGS["/bridget"];

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
      if (sessionStorage.getItem("iia-ident-seen") && !document.querySelector(".ident-splash")) {
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
    setOpen((v) => !v);
  }

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
              <p className="text-[11px] text-elevated/70">Advocate · not a licensed agent</p>
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
            <p>{intro ? "Hey — I’m right here if the alphabet soup starts spinning." : line}</p>
            <p className="text-xs text-muted">
              I don’t enroll. I don’t take health details. When you’re ready, a
              licensed agent compares plans we actually offer in your area.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/bridget"
                className="rounded-xl bg-blue px-3 py-2 text-xs font-medium text-elevated shadow-elevation-brand"
                onClick={() => setOpen(false)}
              >
                Talk with me
              </Link>
              <CallLink className="rounded-xl bg-navy px-3 py-2 text-xs font-medium text-elevated">
                Call {PHONE_DISPLAY}
              </CallLink>
              <Link
                to="/lead"
                className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-navy"
                onClick={() => setOpen(false)}
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
          <img src="/brand/bridget/avatar-bust.png" alt="" />
        </span>
        <span className="bridget-launcher-name">BRIDGEt</span>
      </button>
    </div>
  );
}
