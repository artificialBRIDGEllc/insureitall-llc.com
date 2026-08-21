import type { ReactNode } from "react";
import { useParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

export function BridgetCutout({
  className,
  size = "hero",
}: {
  className?: string;
  size?: "hero" | "page" | "peek";
}) {
  const dims =
    size === "peek"
      ? "h-40 w-28 sm:h-48 sm:w-32"
      : size === "page"
        ? "h-[28rem] w-[18rem] sm:h-[34rem] sm:w-[22rem]"
        : "h-[26rem] w-[16.5rem] sm:h-[32rem] sm:w-[21rem] lg:h-[36rem] lg:w-[23rem]";

  return (
    <div className={cn("cutout-window", dims, className)} aria-hidden={false}>
      <div className="cutout-well">
        <img
          src="/brand/bridget/avatar-locked.png"
          alt="BRIDGEt, your Medicare advocate"
          className="cutout-figure"
        />
      </div>
    </div>
  );
}

export function PageDieCut({
  children,
  figure = "hero",
}: {
  children: ReactNode;
  figure?: "hero" | "page";
}) {
  const ref = useParallax<HTMLElement>(1);
  return (
    <section ref={ref} className="diecut-stage">
      <div className="diecut-sheet">
        <div className="diecut-grid">
          <div className="diecut-copy">{children}</div>
          <div className="diecut-hole">
            <BridgetCutout size={figure} />
          </div>
        </div>
      </div>
    </section>
  );
}
