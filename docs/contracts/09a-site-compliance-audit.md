# Exhibit R-A — Existing website compliance audit

**Parent:** [Exhibit R](09-phase-r-regulatory-disclaimers.md) · Gate **RA**  
**Use:** every **already-live** website in an agent build contract — Client’s current site, a prior vendor, staging, ads landers, GHL/funnel pages, chat widgets.  
**Mode:** AUDIT only until this worksheet is filed. Then BUILD maps findings to R1–R16.

Not a CMS, carrier, HIPAA, or legal opinion. It is the Agent’s **evidence log**. Client CCO owns what stays published.

---

## 1. Hard rules for the Agent

1. **Audit before you edit.** No TPMO/TCPA/legal change on a live site until this file (or a dated copy under `docs/audits/`) exists.  
2. **Do not submit real people.** Test forms with obvious fake data (`Test User`, `555-0100`, `audit@example.com`). Do not complete a real enrollment.  
3. **Do not invent counts.** If the live site says “47 products” and the CCO form says 14, log a **Critical** mismatch — do not pick a number.  
4. **Quote, don’t paraphrase.** Paste the exact sentence you found.  
5. **One URL per finding.** Homepage footer and `/plans` footer are two rows if they differ.  
6. **If you only have HTML** (no repo): still run the live checks. Mark code-only tests (server TCPA, identifier scan) **Unable — no source**. That is **Major**, not Pass.  
7. **Audit-only SOW:** deliver the log. Do not remediate unless the SOW says BUILD.  
8. **Re-audit** after BUILD, and whenever Client adds a lander or widget.

---

## 2. Scope (list every host)

Fill before crawling:

| Field | Value |
|---|---|
| Audit ID | `AUD-YYYYMMDD-<host>` |
| Date / Agent | |
| Primary URL | |
| Other hosts (www, landers, funnels, chat) | |
| Repo (if any) | |
| Client / CCO | |
| Engagement | ☐ audit-only  ☐ audit + BUILD (Exhibit R) |

In scope unless Client carves out in writing: marketing pages, plan/compare pages, lead/contact/chat, footers, popups, SMS/email capture, AI widgets, “leave this site” links, privacy/HIPAA claims, ads landing URLs that collect phone.

Out of scope unless named: logged-in carrier portals, PDF books not linked from the site, paid media **creatives** (log a finding if the lander they hit fails; do not grade the ad network).

---

## 3. Method

1. Fetch `/`, sitemap.xml, robots.txt.  
2. Walk every nav + footer legal link + any “Get a quote / Call me / Chat.”  
3. View-source or DOM: TPMO, non-affiliation, consent checkbox, hidden fields (SSN, MBI, Medicare number).  
4. Submit a test lead **without** checking consent (expect reject).  
5. Submit a test note that looks like an SSN (`123-45-6789`) if a notes field exists (expect reject).  
6. If repo: `rg` for disclaimer strings, `consent`, `ssn`, `mbi`, `medicare number`.  
7. Screenshot or clip the exact block (path + 1–2 sentences).  
8. Score. File. **Then** (BUILD only) map to R-gates.

---

## 4. Severity

| Grade | Meaning | Ship? |
|---|---|---|
| **Critical** | Unlawful or carrier-kill: missing TCPA on a phone form; “every plan in your area”; “we are Medicare / CMS”; SSN or MBI field; HIPAA/SOC 2 **certified** claim; identifiable PHI in a public chat | **No.** Do not go live / do not leave live without CCO + BUILD. |
| **Major** | TPMO missing or paraphrased; counts not CCO-locked; consent checkbox only (no server); AI sounds licensed; no recording line; third-party portal with no leave-site; privacy merged across entities | BUILD required. Client may accept residual risk **in writing**. |
| **Minor** | NPN off one page; contrast/size of disclaimer; extra marketing page missing footer; TTY omitted | Fix in BUILD; does not alone block a documented go-live if CCO accepts. |
| **Pass** | Meets the check as written in Exhibit R | — |
| **Unable** | Cannot test (no source, blocked form, captcha). Treat like **Major** until tested. | |

**Phase R AUDIT pass:** zero open Critical; every Major mapped to a BUILD gate or written Client accept.

---

## 5. Checks (score each)

Use **Pass / Critical / Major / Minor / Unable**. Evidence = URL + quote.

### A1 Entity and non-affiliation
Site says who sells insurance (legal name). Does **not** claim CMS/Medicare endorsement. Non-affiliation sentence present on plan-touching pages + footer.

### A2 TPMO
“We do not offer every plan available in your area…” **or Client CCO-approved equivalent**. Org count + product count present. Not buried (readable, footer or adjacent to plan talk). **Paraphrase = Major.** Missing on a plan page = **Critical**.

### A3 Counts vs authority
Counts match CCO form / `compliance.ts`. Zip-level counts without CCO “Yes” = **Critical**.

### A4 Licensed footprint
States listed do not exceed what Client confirmed. “Licensed nationwide” without a list = **Major**.

### A5 TCPA on every phone/email capture
Required checkbox. Autodial / prerecorded / text. Not a condition of purchase. STOP / HELP if SMS. Same string, not a shorter “I agree to be contacted.” **Missing checkbox on a phone form = Critical.**

### A6 Server enforcement
POST without consent rejected. Checkbox-only = **Major** (Unable if no source/no way to POST).

### A7 Recording
Call / “click to call” discloses recording + licensed agent.

### A8 Identifiers
No SSN, MBI, “Medicare number,” card upload, bank. Notes field scanned. Field present = **Critical**.

### A9 Lead use
No “we sell your information.” GLBA-style: no joint marketing / no nonaffiliate marketing if that is the Client position. Lead-buyer language = **Critical**.

### A10 AI / chat
Labeled not a licensed agent, not enrollment, may be wrong. Cannot open PHI file. Widget that enrolls or quotes a premium = **Critical**.

### A11 Third-party / leave-site
Off-domain portal, scheduler, or “file” product: interstitial, different operator named, TCPA does not travel.

### A12 HIPAA / security claims
“HIPAA compliant / certified / SOC 2” without a certificate = **Major** (overclaim). Proof-of-controls page is OK if it **says it is not a certificate**.

### A13 Privacy split
If a third party operates a portal, that party’s privacy is linked and not the agency’s policy pretending to cover both.

### A14 House facts
Phone, TTY, hours, HQ, NPN, email match CCO house facts. Contradictory phones = **Major**.

### A15 Forks
Same disclaimer worded two ways on two pages = **Major** (source lock fail).

### A16 Ads / extra landers
Any URL that takes a phone number is in A5–A8. “Short form” lander without TCPA = **Critical**.

---

## 6. Worksheet (copy per audit)

Save as `docs/audits/AUD-YYYYMMDD-<host>.md`.

```
# AUD-________
Host:
Date:
Agent:
Mode: audit-only / audit+BUILD
CCO:

## Hosts crawled
-

## Summary
Critical: _  Major: _  Minor: _  Pass: _  Unable: _

## Findings
| ID | Check | Grade | URL | Quote (exact) | Map to R-gate | Status |
|---|---|---|---|---|---|---|
| F-01 | A2 | | | | R2 | open / fixed / accepted |

## Unable tests
| Check | Why | Follow-up |
|---|---|---|

## CCO / Client
☐ Log received  Date: ____
☐ Critical/Major accepted as residual risk (list IDs): ____
☐ Proceed to BUILD
Name / title: Ryan Butterfield, CEO (INSUREitALL) when this Client
```

Do not put live PHI or real lead payloads in the log.

---

## 7. Mapping to BUILD gates

| Audit check | Exhibit R gate |
|---|---|
| A1 | R3, R7, R8 |
| A2 A3 A15 | R1, R2, R14 |
| A4 | R4 |
| A5 A6 A16 | R5 |
| A7 | R6 |
| A8 | R8, R10 (no-mbi) |
| A9 A12 A13 | R10–R13 |
| A10 | R8, R12 |
| A11 | R9 |
| A14 | R7 |

---

## 8. What “good” looks like (this engagement)

Reference implementation after BUILD — **not** a shortcut to skip RA:

- `src/lib/compliance.ts` + `<TpmoDisclaimer />` on footer  
- `LEAD_CONSENT` + server refuse  
- `/leaving` before fileBRIDGE  
- `/hipaa` proof, not a certificate  
- `/glba` with health-info row  
- `/ai-disclosure`  
- No SSN/MBI fields  

An existing site that is **not** this repo is graded against **§5**, not against file paths.

---

## 9. Recurrence

| Event | Re-run RA |
|---|---|
| New Agent session that will change copy | Yes (delta OK if last audit ≤ 7 days and hosts unchanged) |
| New lander, widget, or domain | Yes, scoped to the new URL + footer |
| CCO changes counts/states/consent | Yes, those checks only |
| AEP / annual | Yes, full |

---

**Agent sign-off (RA complete):**  
Name: ______________________  Date: __________  
Worksheet path: `docs/audits/AUD-________________`  
