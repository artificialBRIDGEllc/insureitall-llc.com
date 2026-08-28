# Resend templates — INSUREitALL

Two transactional templates. No doctors, medications, or notes in either.

In Resend, create each variable as a **string**. Subject lines can use the same names. If a dashboard ID is not set, the app still sends filled HTML from `scripts/email-templates.mjs`.

## Env

```
RESEND_API_KEY=re_...
LEAD_ALERT_FROM=INSUREitALL <alerts@insureitall-llc.com>
LEAD_ALERT_TO=info@team-iia.com
RESEND_TEMPLATE_LEAD_ALERT=insureitall-lead-alert
RESEND_TEMPLATE_LEAD_RECEIVED=insureitall-lead-received
```

Optional copy overrides (no deploy needed):

```
EMAIL_SITE_NAME=INSUREitALL
EMAIL_PHONE=+1 888-459-4842
EMAIL_HOURS=Mon–Fri 9am–6pm ET
EMAIL_CONSOLE_URL=https://insureitall-llc.com/console
EMAIL_DESK_CTA=Open the lead desk
EMAIL_CALL_CTA=Call +1 888-459-4842
EMAIL_RECEIVED_TITLE=We have your request.
EMAIL_RECEIVED_BODY=A licensed INSUREitALL agent will call during the window you chose. No scripts. No pressure.
LEAD_RECEIPT=0
```

`npm run env:check` validates formats and the Resend cluster. It never prints secret values. `--strict-production` also fails on missing alert channel / DATABASE_URL warnings.

## Shared variables (both templates)

| Variable | Default |
|---|---|
| `SITE_NAME` | INSUREitALL |
| `NPN` | 20114179 |
| `HQ` | 3550 Buschwood Park Dr, Ste 180, Tampa, FL 33618 |
| `HOURS` | Mon–Fri 9am–6pm ET |
| `TTY` | TTY 711 |
| `PHONE_DISPLAY` | +1 888-459-4842 |
| `PHONE_HREF` | tel:+18884594842 |
| `FOOTER_LICENSE` | Licensed agents |
| `NON_AFFILIATION` | CMS non-affiliation sentence |

## insureitall-lead-alert (team)

Subject: `{{KIND}} · {{FIRST_NAME}} · {{ID}}`

| Variable | Meaning |
|---|---|
| `KIND` | Callback or Needs analysis |
| `FIRST_NAME` | Lead first name |
| `PHONE` | Lead phone (not the agency line) |
| `EMAIL` | Lead email |
| `ZIP` | Zip |
| `WINDOW` | Callback window |
| `ID` | REQ-… |
| `CONSOLE_URL` | Staff desk |
| `DESK_CTA` | Button label |
| `ALERT_INTRO` | Body open |
| `ALERT_CLOSE` | Body close |
| `SUBJECT` / `PREVIEW` | Filled subject and inbox preview |

Paste [emails/lead-alert.html](lead-alert.html).

## insureitall-lead-received (consumer)

Subject: `{{RECEIVED_TITLE}} — {{SITE_NAME}}`

| Variable | Meaning |
|---|---|
| `FIRST_NAME` | Consumer first name |
| `GREETING` | Hello Pat. |
| `KIND` | Callback / Needs analysis |
| `KIND_LOWER` | callback / needs analysis |
| `RECEIVED_TITLE` | Headline |
| `RECEIVED_BODY` | What happens next |
| `RECEIVED_SOONER` | If you need someone sooner: |
| `CALL_CTA` | Button label |
| `RECORDING` | Recording notice |
| `STOP_LINE` | Not enrollment · STOP |

Paste [emails/lead-received.html](lead-received.html).
