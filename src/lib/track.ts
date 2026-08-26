import { recordFeedback } from "@/lib/feedback";

/** Fire-and-forget. Never send names, phones, emails, zips, doctors, or meds. */
export function track(event: string, payload: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  void recordFeedback({ data: { event, path, payload } }).catch(() => {
    /* training loop must never block the visitor */
  });
}
