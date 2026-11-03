# Onboarding Portal — Integration Notes

Built into artificialBRIDGEllc/insureitall-llc.com (Vite + TanStack Start + better-auth + Neon).

## What is scaffolded

- Migration `migrations/0013_onboarding.sql` — full data model from the Nov 3 plan (hires, invites, steps, approvals, owner_sections, documents, checkr, offboarding, audit_log).
- `src/lib/onboarding/steps.ts` — step definitions, applicability by worker type / Team Lead / agent platform, annual refresh keys.
- Routes:
  - `/onboarding` — hire landing (sign-in with invited email).
  - `/onboarding/admin` — Operations console entry.

## Next phases (from the plan)

1. Wire better-auth magic links for hires; Google Workspace + allowlist for staff.
2. Step engine: order, gating, auto-advance on confirm, Returned flow.
3. Document viewer (pdf.js) + questions form + typed-name signing dialog.
4. Server-side signed-copy builder (pdf-lib) with certificate page + SHA-256.
5. Background jobs (Vercel Cron / Inngest) for Monday file uploads, Slack, email-a-copy, Checkr webhooks.
6. Owner sections (CRE-002 Schedule A, QA coaching 3.1-A).
7. Annual refresh cycles and Form 4.5-A offboarding.
8. Load the 20 source PDFs into the documents table and map to steps.

## Environment variables needed

- DATABASE_URL (already used)
- MONDAY_TOKEN
- CHECKR_API_KEY + CHECKR_WEBHOOK_SECRET
- SLACK_WEBHOOK_URL
- Google Workspace service account for Gmail send-as insureitallagency@team-iia.com
- Vercel Blob or S3 for private PDFs

## Security notes

- No SSN / DOB stored.
- Signed URLs only for downloads.
- Server-side staff checks on every admin action.
- Audit log on confirm / return / undo / offboard.

Claude portal remains the sandbox. Production hires go only to the website link once launch checklist is green.
