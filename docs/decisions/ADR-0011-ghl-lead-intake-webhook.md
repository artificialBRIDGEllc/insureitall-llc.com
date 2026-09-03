ADR-0011 - GoHighLevel lead intake feeds BRIDGEt via webhook, not form replacement

Status: Proposed - code merged dark, awaiting cutover approval. Date: 2026-09-02.

CONTEXT. The GoHighLevel form captures leads into GHL only, so the front of the funnel is invisible to the lead lifecycle the rest of the site already produces. The pipeline already exists in this repo and did not need to be built: ops_requests (migration 0004), lead_events (migration 0007), portal_integrations plus ops_requests.portal_user_id (migration 0007), submitOpsRequest in src/lib/ops.ts, and forwardLeadToBridget in src/lib/bridget-console.ts. Native /lead and /needs-analysis submissions already run that full path. GHL is a second front door that bypasses it.

DECISION. Add POST /api/lead-intake, a webhook receiver GHL posts to on submit, running the identical pipeline submitOpsRequest runs. The GHL form is untouched - no field, embed, or workflow changes. Ships dark: returns 503 until LEAD_INTAKE_ENABLED=1 on Vercel.

ALTERNATIVES CONSIDERED. Replace GHL with the native /lead form: zero new code, since the native form already feeds BRIDGEt. Rejected on timing - AEP opens Oct 15 and swapping a working capture path weeks beforehand risks dropping leads in the only season that matters, and it strands existing GHL nurture workflows. Still the better long-term answer; revisit after AEP, since two front doors fragment the corpus. Zapier or GHL native integration: adds a third-party hop, recurring cost, and another processor touching consumer PII. Rejected. Poll the GHL API on a schedule: higher latency, more moving parts, stored credentials. Rejected.

REASONING. Reuse over rebuild - the only real gap was an ingress point. Routing GHL through parsePublicLead keeps one definition of a valid lead rather than a second that drifts. Reversibility drove the shape: unset the flag and the route is inert.

TRADEOFFS. Two capture paths write to ops_requests; the source column distinguishes them, but one human submitting both forms produces two rows, and cross-path dedupe is out of scope here. GHL field names vary by form config - the mapper reads several candidate keys per field, but it is a guess until validated against a real payload. takeLeadSlot is not applied: it buckets by client IP and all GHL webhooks arrive from a small set of IPs, so it would throttle legitimate traffic; the shared secret and the external_id unique index are the controls instead.

COMPLIANCE IMPACT. Consumer PII moves from GHL into ops_requests in this site's own database - the same table native site forms already write. This is the site performing its ordinary function, not a disclosure across an entity boundary. The entity boundary sits downstream: any flow into the artificialBRIDGE cross-client corpus for de-identification and training is a separate, separately gated step and is NOT part of this ADR. Nothing here enables it. Error responses never echo the payload; rejections return a reason code only.

REVERSIBILITY. Easy. Env flag off, route inert. external_id is additive and nullable.

EVIDENCE. Route src/routes/api/lead-intake.ts. Migration migrations/0011_lead_intake_external_id.sql. Reuses src/lib/ops.ts, src/lib/bridget-console.ts, scripts/commercial-guard.mjs, scripts/lead-alert.mjs. NOT YET VALIDATED - no test run, no real GHL payload captured, no staging delivery. Claimed behavior is unproven until cutover step 2.

CUTOVER STEPS. 1) Set LEAD_INTAKE_SECRET on Vercel Production; leave LEAD_INTAKE_ENABLED unset. 2) Send a GHL test submission to /api/lead-intake with the secret header, capture the real payload, and confirm the mapper field names against it - fix the mapper before step 3, the current key list is inference, not observation. 3) Set LEAD_INTAKE_ENABLED=1 and redeploy; env vars do not attach to a running deployment. 4) Verify one live submission lands in ops_requests, produces a lead_events row at stage new, and appears on the BRIDGEt staff desk. 5) Re-submit the same payload; confirm duplicate true and no second row.

FOLLOW-UP ACTIONS. Decide post-AEP whether GHL remains the front door or the native form takes over. Add cross-path duplicate detection on phone and email across source values. Confirm whether the GHL form collects ZIP - if it does, that page requires the counts variant of the TPMO disclaimer rather than the general variant now in the footer.