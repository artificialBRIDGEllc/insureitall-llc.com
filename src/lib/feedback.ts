import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { staffMiddleware } from "@/lib/staff-middleware";
import { getSql } from "@/lib/db";
// @ts-expect-error -- JS sanitize
import { sanitizeFeedback, takeFeedbackSlot } from "../../scripts/feedback-loop.mjs";

export type FeedbackEvent =
  | "page_view"
  | "widget_open"
  | "widget_cta"
  | "audit_complete"
  | "lead_kind";

function clientKey() {
  try {
    const req = getRequest();
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || req.headers.get("cf-connecting-ip") || "local";
  } catch {
    return "local";
  }
}

export const recordFeedback = createServerFn({ method: "POST" })
  .validator((input: { event?: string; path?: string; payload?: Record<string, string> }) => input)
  .handler(async ({ data }) => {
    const parsed = sanitizeFeedback(data);
    if (!parsed.ok) return { stored: false };
    const slot = takeFeedbackSlot(clientKey());
    if (!slot.ok) return { stored: false };
    const sql = await getSql();
    await sql`
      insert into ai_feedback_events (event, path, payload)
      values (
        ${parsed.data.event},
        ${parsed.data.path},
        ${JSON.stringify(parsed.data.payload)}::jsonb
      )
    `;
    return { stored: true };
  });

export type FeedbackCount = { event: string; path: string; count: number };

export const listFeedbackSummary = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<{ event: string; path: string; count: number }>`
      select event, path, count(*)::int as count
      from ai_feedback_events
      where occurred_at > now() - interval '7 days'
      group by event, path
      order by count desc
      limit 40
    `;
    return rows;
  });
