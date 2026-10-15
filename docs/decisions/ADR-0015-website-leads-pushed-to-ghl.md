ADR-0015 - Website leads are pushed to GoHighLevel as contacts

Status: Proposed - code merged dark by config, awaiting GHL credentials. Date: 2026-10-15.

CONTEXT. /lead and /needs-analysis write to ops_requests and forward to BRIDGEt Console, but nothing reached GoHighLevel, so agents working leads in GHL never saw website submissions. ADR-0011 covers the opposite direction (GHL form -> this site) and is unchanged.

DECISION. After the lead is saved locally, submitOpsRequest (src/lib/ops.ts) calls syncLeadToGhl (scripts/ghl-lead.mjs), which POSTs to GHL API v2 /contacts/upsert (upsert dedupes on phone/email) and adds a short note with the request id and best time to call. Contact fields sent: first name, phone, email, ZIP, source, tags (website-lead, needs-analysis or callback-request, tcpa-consent). Doctors, medications, budget and notes are NEVER sent: they are health-adjacent and GHL is not a PHI system. Inert until GHL_API_KEY and GHL_LOCATION_ID are both set; setting only one fails env:check.

FAILURE HANDLING. The consumer submission never fails because of GHL. One retry on 429/5xx. A failure writes a lead_events row "GHL sync failed: <reason code>" (no PII) so un-synced leads are findable. There is no automatic backfill yet.

LOOP SAFETY. /api/lead-intake (GHL -> site) does not call syncLeadToGhl, so a GHL-originated lead is not echoed back.

ALTERNATIVES. Reuse LEAD_ALERT_WEBHOOK pointed at a GHL inbound-webhook workflow: no new credential, but the payload is an alert (no consent flag, no tags, no dedupe) and it doubles as the team notification channel. Rejected as the primary path. Zapier/Make: extra processor touching consumer PII. Rejected.

COMPLIANCE. Consumer PII already lives in GHL for this agency; this adds a second write path, not a new processor. Consent is only tagged when consent was captured. NOT YET VALIDATED against a live GHL location.

CUTOVER. 1) In GHL create a Private Integration with contacts.write (and contacts.readonly) on the INSUREitALL location. 2) Set GHL_API_KEY and GHL_LOCATION_ID on Vercel Production and redeploy. 3) Submit one test lead on /lead; confirm a contact with the tags appears and the note is attached. 4) Resubmit the same phone; confirm no duplicate contact. 5) Confirm no "GHL sync failed" rows in lead_events.

FOLLOW-UP. Add a ghl_contact_id column and a retry/backfill job for failed syncs. Map callbackWindow to a GHL custom field. Decide whether to trigger a GHL workflow via tag.
