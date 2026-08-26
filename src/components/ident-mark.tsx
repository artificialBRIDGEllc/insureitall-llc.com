import { useEffect } from "react";
import { cn } from "@/lib/utils";

const LAYERS = [
  { id: "monogram", src: "/brand/ident/monogram.svg" },
  { id: "swoosh", src: "/brand/ident/swoosh.svg" },
  { id: "wordmark", src: "/brand/ident/wordmark.svg" },
  { id: "it", src: "/brand/ident/it.svg" },
  { id: "rules", src: "/brand/ident/rules.svg" },
  { id: "tagline", src: "/brand/ident/tagline.svg" },
] as const;

let primed: Promise<void> | null = null;

export function loadIdent() {
  if (typeof window === "undefined") return Promise.resolve();
  primed ??= Promise.all(
    LAYERS.map((layer) => {
      const img = new Image();
      img.src = layer.src;
      return img.decode().catch(() => undefined);
    }),
  ).then(() => undefined);
  return primed;
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
  useEffect(() => {
    void loadIdent();
    onReady?.();
  }, [onReady]);

  return (
    <div
      className={cn("ident-stage", play && "ident-run", compact && "ident-compact", className)}
      aria-hidden
    >
      {LAYERS.map((layer) => (
        <img
          key={layer.id}
          className={`ident-layer ident-layer-${layer.id}`}
          src={layer.src}
          alt=""
          draggable={false}
        />
      ))}
    </div>
  );
}
