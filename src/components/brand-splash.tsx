import { useCallback, useEffect, useState } from "react";
import { IdentMark } from "@/components/ident-mark";
import { cn } from "@/lib/utils";

const KEY = "iia-ident-seen";

function splashDone() {
  window.dispatchEvent(new Event("iia-splash-done"));
}

export function BrandSplash() {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) {
        splashDone();
        return;
      }
    } catch {
      splashDone();
      return;
    }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show || !ready) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 800 : 2500;
    const t = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(() => {
        setShow(false);
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          /* ignore */
        }
        splashDone();
      }, 520);
    }, hold);
    return () => window.clearTimeout(t);
  }, [show, ready]);

  if (!show) return null;

  return (
    <div
      className={cn("ident-splash", leaving && "ident-splash-leave")}
      role="img"
      aria-label="INSUREitALL"
    >
      <div className="ident-wash" />
      <div className="ident-grain" />
      <div className="ident-vignette" />
      <div className="ident-goldline" />
      <div className="ident-frame">
        <IdentMark play={ready && !leaving} onReady={onReady} />
      </div>
    </div>
  );
}
