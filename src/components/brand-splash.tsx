import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { IdentMark, loadIdent } from "@/components/ident-mark";
import { IDENT_HOLD_MS, IDENT_LEAVE_MS, IDENT_SESSION_KEY } from "@/lib/ident";
import { playIdentAudio, preloadIdentAudio, stopIdentAudio, unlockIdentAudio } from "@/lib/ident-audio";
import { cn } from "@/lib/utils";

function splashDone() {
  window.dispatchEvent(new Event("iia-splash-done"));
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setChromeInert(value: boolean) {
  const el = document.getElementById("site-chrome");
  if (el) el.inert = value;
}

export function BrandSplash() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const home = pathname === "/";
  const [show, setShow] = useState(home);
  const [leaving, setLeaving] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const started = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    setShow(false);
    setChromeInert(false);
    try {
      sessionStorage.setItem(IDENT_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    splashDone();
  }, []);

  const dismiss = useCallback(
    (delay: number) => {
      window.setTimeout(() => {
        setLeaving(true);
        stopIdentAudio();
        window.setTimeout(finish, IDENT_LEAVE_MS);
      }, delay);
    },
    [finish],
  );

  const skip = useCallback(() => {
    if (!show || leaving) return;
    started.current = true;
    stopIdentAudio();
    setLeaving(true);
    window.setTimeout(finish, 220);
  }, [finish, leaving, show]);

  const onMarkReady = useCallback(() => {
    if (started.current) return;
    started.current = true;
    dismiss(reducedMotion() ? 700 : IDENT_HOLD_MS);
  }, [dismiss]);

  useLayoutEffect(() => {
    if (!home) {
      setShow(false);
      splashDone();
      return;
    }
    try {
      if (sessionStorage.getItem(IDENT_SESSION_KEY)) {
        setShow(false);
        splashDone();
        return;
      }
    } catch {
      setShow(false);
      splashDone();
      return;
    }
    preloadIdentAudio();
    void loadIdent();
    setChromeInert(true);
    skipRef.current?.focus();
  }, [home]);

  useLayoutEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, skip]);

  if (!show) return null;

  return (
    <div
      className={cn("ident-splash ident-on", leaving && "ident-splash-leave")}
      role="dialog"
      aria-modal="true"
      aria-label="INSUREitALL intro"
    >
      <div className="ident-wash" />
      <div className="ident-grain" />
      <div className="ident-vignette" />
      <div className="ident-call" aria-hidden>
        <span className="ident-pulse" />
        <span className="ident-pulse ident-pulse-late" />
      </div>
      <div className="ident-goldline" />
      <div className="ident-frame">
        <IdentMark play onReady={onMarkReady} />
      </div>
      <div className="ident-controls">
        <button ref={skipRef} type="button" className="ident-skip" onClick={skip}>
          Skip intro
        </button>
        {reducedMotion() ? null : (
          <button
            type="button"
            className="ident-sound"
            onClick={() => {
              unlockIdentAudio();
              void playIdentAudio().then((ok) => {
                if (ok) setSoundOn(true);
              });
            }}
          >
            {soundOn ? "Sound on" : "Play sound"}
          </button>
        )}
      </div>
    </div>
  );
}
