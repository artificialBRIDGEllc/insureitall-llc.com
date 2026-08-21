import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

let cached = "";
let pending: Promise<string> | null = null;

function loadIdent() {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = fetch("/brand/insureitall-ident.svg")
      .then((r) => r.text())
      .then((html) => {
        cached = html;
        return html;
      });
  }
  return pending;
}

export function IdentMark({
  compact = false,
  play = true,
  className,
  onReady,
}: {
  compact?: boolean;
  play?: boolean;
  className?: string;
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    loadIdent().then((html) => {
      if (!live || !ref.current) return;
      ref.current.innerHTML = html;
      setReady(true);
      onReady?.();
    });
    return () => {
      live = false;
    };
  }, [onReady]);

  return (
    <div
      ref={ref}
      className={cn("ident-stage", play && ready && "ident-run", compact && "ident-compact", className)}
      aria-hidden
    />
  );
}
