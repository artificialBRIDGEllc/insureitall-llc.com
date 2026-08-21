import { cn } from "@/lib/utils";

/** Gold TALK smile — same mark under the B and under BRIDGEt. */
export function BridgetSmile({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 36"
      className={cn("bridget-smile overflow-visible", className)}
      aria-hidden
    >
      <path
        fill="#C9A227"
        d="M10 7C66 34 134 34 190 7C134 26 66 26 10 7Z"
      />
    </svg>
  );
}

export function BridgetMark({
  className,
  loop = false,
  invert = false,
}: {
  className?: string;
  loop?: boolean;
  invert?: boolean;
}) {
  return (
    <span
      className={cn(
        "bridget-mark inline-flex flex-col items-center font-display font-semibold leading-none",
        invert ? "text-elevated" : "text-navy",
        loop && "bridget-mark-loop",
        className,
      )}
      aria-hidden
    >
      <span>B</span>
      <BridgetSmile className="mt-[0.08em] w-[1.22em]" />
    </span>
  );
}

export function BridgetWordmark({
  className,
  invert = false,
  withMark = false,
  loop = false,
}: {
  className?: string;
  invert?: boolean;
  withMark?: boolean;
  loop?: boolean;
}) {
  return (
    <span
      className={cn(
        "bridget-word inline-flex items-center gap-3 font-display tracking-normal",
        invert ? "text-elevated" : "text-navy",
        loop && "bridget-word-loop",
        className,
      )}
      aria-label="BRIDGEt"
    >
      {withMark ? <BridgetMark invert={invert} className="text-[0.9em]" /> : null}
      <span className="inline-flex flex-col items-center">
        <span className="inline-flex items-baseline leading-none">
          <span className="font-semibold">BRIDGE</span>
          <span className="bridget-t text-[0.84em] italic text-blue">t</span>
        </span>
        <BridgetSmile className="mt-[0.12em] w-[1.02em] min-w-full" />
      </span>
    </span>
  );
}
