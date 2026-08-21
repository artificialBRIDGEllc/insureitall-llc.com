import type { AnchorHTMLAttributes } from "react";
import { playPickup } from "@/lib/ring";
import { PHONE_HREF, cn } from "@/lib/utils";

export function CallLink({
  className,
  onClick,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={PHONE_HREF}
      className={cn("ring-call", className)}
      onClick={(e) => {
        playPickup();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
