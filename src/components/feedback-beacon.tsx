import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { track } from "@/lib/track";

/** Public-page views only. Path is allowlisted server-side. */
export function FeedbackBeacon() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const last = useRef("");

  useEffect(() => {
    if (pathname.startsWith("/portal") || pathname.startsWith("/console")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    track("page_view");
  }, [pathname]);

  return null;
}
