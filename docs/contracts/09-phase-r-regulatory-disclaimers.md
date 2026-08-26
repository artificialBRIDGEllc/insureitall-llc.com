# Exhibit R — Strict Operating Phase  
# Regulatory Disclaimers (Agent Build Contract)

**Status:** MANDATORY. Not optional. Not a marketing polish pass.  
**Phase code:** **R**  
**Blocks:** SOW acceptance, production go-live, and any later agent build that touches public copy, forms, AI, or legal pages.  
**This engagement:** Independent Contractor Agreement dated 25 August 2026 · SOW No. 1 · Design Partner License · Exhibit BAA  
**Client:** INSUREitALL LLC  
**Client authorized signer:** Ryan Butterfield, CEO (`rmbutterfield@team-iia.com`)  
**Client compliance owner:** Ryan Butterfield, acting CCO  
**Contractor:** artificialBRIDGE LLC  
**Contractor authorized signer:** Michael Lang, Managing Member (`lang@theartificialbridge.com`)  
**Build agent:** any human or AI agent executing code, copy, or deploy under this engagement (the **Agent**)

Not legal advice. Not a CMS, HIPAA, SOC 2, or carrier certification. Client remains responsible for carrier and CMS representations (ICA §8, §11(a)).

---

## 0. Why this phase exists

The INSUREitALL site is **TPMO-adjacent Medicare marketing**. A paraphrase, a missing checkbox, a zip-level count the CCO did not confirm, or an AI that “sounds licensed” is a **regulatory defect**, not a UX miss.

This exhibit packages the disclaimer work already built into a **strict operating phase**. The Agent **MUST** run Phase R as specified. The Agent **MUST NOT** skip, merge into “legal pages later,” or soften copy for conversion.

**Pass rule:** **RA** (existing-site audit) plus every gate R0–R16 is **PASS**. One FAIL = Phase R incomplete. SOW acceptance does not start.

**Two modes (both in this exhibit):**

| Mode | When | Output |
|---|---|---|
| **AUDIT** | Any URL already live (Client’s current site, a staging host, a prior vendor build, or a site Client asks the Agent to review) | Findings log + severity. **No copy change** until the log exists. |
| **BUILD** | Greenfield or remediation after AUDIT | Source-lock + gates R0–R16 |

The Agent **MUST** run AUDIT on every existing website in scope **before** BUILD. Protocol and worksheet: [09a-site-compliance-audit.md](09a-site-compliance-audit.md).

---

## 1. Agent operating contract (hard rules)

The Agent **MUST**:

1. Treat `src/lib/compliance.ts` as the **only** source of TPMO text, org/product counts, non-affiliation, licensed-state list, and TCPA consent.  
2. Render TPMO via `<TpmoDisclaimer />` (`src/components/tpmo-disclaimer.tsx`). **No second wording.**  
3. Enforce TCPA on the **server**. A checked box in the DOM is not enough.  
4. Keep SSN and Medicare Beneficiary Identifier (MBI) **off every form and API**. Scan free text and reject lookalikes.  
5. Keep BRIDGEt labeled as **not a licensed agent and not an enrollment path**.  
6. Route fileBRIDGE / portal from the public site through `/leaving` (third-party interstitial). TCPA consent **does not travel**.  
7. Change counts, states, phone, NPN, hours, HQ, or consent **only** from a signed `docs/cco-confirmation.md`. One-line (or one-list) edits in the source module. **No paraphrase.**  
9. **Audit first.** If a website already exists, complete **RA** and file the worksheet before editing disclaimers, forms, or legal pages.  
10. Stop and ask Client if a gate is ambiguous. **Do not invent a number.**

The Agent **MUST NOT**:

- Say or imply “every plan in your area,” “Medicare.gov results,” “we’re Medicare,” “official,” “endorsed,” or “certified HIPAA/SOC 2.”  
- Quote a plan premium, star rating, or MARx output. Plan Choice Audit is **type-level**, not a quote.  
- Collect SSN, MBI, bank/card images, or uploaded medical records.  
- Email doctors, medications, or notes in lead alerts.  
- Train a model on **identifiable** PHI. Deidentified / aggregated only, and only if Exhibit BAA is signed (License §4).  
- Open the portal file from the BRIDGEt widget.  
- Move TCPA consent or call-recording rules onto fileBRIDGE.  
- Hide, grey-out below 12px-equivalent unreadable, or bury TPMO/non-affiliation. Footer + marketing pages that discuss plans.  
- “Improve” disclaimer grammar if it changes meaning. CMS wording stays.

**Defense split (ICA §11(h)):** TCPA, TPMO, CMS, and sales claims are **Client’s**. The Agent implementing Phase R does not assume those tenders.

---

## 2. Single source of truth (do not fork)

| Fact | Module | Who may change it |
|---|---|---|
| TPMO org count / product count / disclaimer | `src/lib/compliance.ts` → `TPMO_ORG_COUNT`, `TPMO_PRODUCT_COUNT`, `TPMO_DISCLAIMER` | CCO via `docs/cco-confirmation.md` |
| Non-affiliation | `NON_AFFILIATION` | CCO |
| Licensed states | `LICENSED_STATES` | CCO |
| TCPA / recording consent | `LEAD_CONSENT` | CCO + counsel |
| Phone, TTY, hours, HQ | `src/lib/utils.ts` | CCO house facts |
| Legal name, NPN, email, origin | `src/lib/seo.ts` | CCO house facts |
| HIPAA controls (proof, not a certificate) | `src/lib/hipaa.ts` | Contractor + CCO review |
| GLBA / NAIC notice | `src/lib/glba.ts` | Contractor + CCO review |
| Information security practices | `src/lib/isp.ts` | Contractor |
| Leave-site copy | `src/lib/leaving.ts` | Contractor; Client confirms third-party split |
| AB entity / privacy contact | `src/lib/ab.ts`, `src/lib/ab-legal.ts` | Contractor (`lang@theartificialbridge.com`) |

**Renderers (must import, not rewrite):**

- `src/components/tpmo-disclaimer.tsx`  
- `src/components/site-footer.tsx` (TPMO + non-affiliation + recording + NPN + states)  
- Lead + needs forms: checkbox bound to `LEAD_CONSENT`; server refuses `consent !== true`

Static 14 / 14 **stays** until Ryan marks zip-level **Yes** on the CCO form. Zip-level without that mark is a **FAIL**.

---

## 3. Gates (all required)

### RA — Audit existing websites (mandatory if any URL is already live)

**Trigger:** Client names a live host, a prior site, ads landing pages, or “review this URL.” Also required against **this** production host (`insureitall-llc.com` and any preview) at the start of a new Agent session that will change copy.

**The Agent MUST:**

1. Crawl the live site (home, plan pages, lead/contact forms, chat/widget, footer, legal, sitemap).  
2. Fill [09a-site-compliance-audit.md](09a-site-compliance-audit.md) — one row per finding, with URL + exact snippet.  
3. Score each finding **Critical / Major / Minor / Pass**.  
4. **Not** “fix as you go.” Critical/Major stay open until Client (CCO) accepts the log.  
5. If the engagement is **audit-only**, stop after the log. If it is **build**, map each open finding to R1–R16 and remediate only after RA is filed.

**PASS:** worksheet dated, URLs listed, every Critical/Major either remapped to a BUILD gate or accepted in writing by Client.  
**FAIL:** Agent edited TPMO/TCPA/forms on a live site with no audit file; or Agent declared “compliant” without evidence.

### R0 — Inventory

Agent lists every public route that (a) mentions plans, (b) takes a lead, (c) runs AI, or (d) is legal. Current inventory:

`/`, `/medicare-basics`, `/compare`, `/needs-analysis`, `/lead`, `/contact`, `/bridget`, `/leaving`, `/privacy`, `/hipaa`, `/glba`, `/security`, `/terms`, `/ai-disclosure`, `/accessibility`, `/ab`, `/ab/privacy`, `/ab/terms`, plus footer on all `SiteShell` pages.

**PASS:** list matches production sitemap. No orphan marketing page without footer TPMO.

### R1 — Source lock

`rg "We do not offer every plan"` returns **only** `compliance.ts` (plus tests/docs quoting it). No hard-coded variant in a route.

**PASS:** one string. **FAIL:** any paraphrase on a page.

### R2 — TPMO

Published text (do not edit in this exhibit):

> We do not offer every plan available in your area. Currently we represent **14** organizations which offer **14** products in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Program (SHIP) to get information on all of your options.

**PASS:** footer on every public marketing page; also on pages that discuss plan types. Counts from constants, interpolated — not typed twice.

### R3 — Non-affiliation

> Insure It All is not connected with or endorsed by the U.S. Government or the federal Medicare program.

Spoken brand (“Insure It All”), not a made-up CMS lockup. Footer `withNonAffiliation`.

### R4 — License footprint

41 states, exact list in `LICENSED_STATES`. Do not add a state to look bigger.

### R5 — TCPA

`LEAD_CONSENT` on `/lead` and `/needs-analysis`. Required checkbox. Server rejects missing consent, honeypots, and over-rate. Consent is **not** a condition of purchase (already in the string — do not delete that sentence).

### R6 — Recording

Phone/footer: calls recorded and monitored; caller connected to a licensed agent. Matches consent string.

### R7 — House facts

| Fact | Value |
|---|---|
| Phone | +1 888-459-4842 |
| TTY | 711 |
| Hours | Mon–Fri 9am–6pm ET |
| HQ | 3550 Buschwood Park Dr, Ste 180, Tampa, FL 33618 |
| Email (Client) | info@team-iia.com |
| Signer | Ryan Butterfield, CEO · rmbutterfield@team-iia.com |
| NPN | 20114179 |

Mismatch vs CCO form = FAIL.

### R8 — Forbidden claims (must stay off)

- Not every plan in the zip  
- Not a quote / not MARx / not Medicare.gov plan-finder output  
- Not an enrollment  
- BRIDGEt is not a licensed agent and does not enroll  
- fileBRIDGE is third-party (artificialBRIDGE LLC)  
- No SSN / Medicare number collection  
- Compensation from carriers, never from the consumer (if that line is used, keep it accurate)

### R9 — Leave-site

`/leaving` before fileBRIDGE. Points in `LEAVE_POINTS` (different operator, different privacy, TCPA does not move, not an enrollment). Continue vs stay.

### R10 — HIPAA proof page

`/hipaa` from `HIPAA_CONTROLS`. **Proof of product controls, not a certificate.** Page MUST say it is not a HIPAA certification. Controls that must remain true: no-mbi, walled-ai, staff-gate, portal-scope, same-site, TLS, TCPA server, no-sale.

### R11 — GLBA / NAIC

`/glba` model-privacy-notice layout. Health information (doctors, meds, notes) called out as **not** ordinary NPI. No joint marketing / no lead sale rows stay **No**.

### R12 — AI disclosure

`/ai-disclosure`: BRIDGEt is a facade / copilot, not a licensed agent, not CMS, may be wrong; licensed human follows. Training (if any) is deidentified under License + BAA.

### R13 — Privacy split

INSUREitALL: `/privacy`, `/terms`.  
artificialBRIDGE LLC: `/ab`, `/ab/privacy`, `/ab/terms` · contact `lang@theartificialbridge.com`.  
Do not merge entities. Do not put team-iia as the BA contact.

### R14 — CCO lock

`docs/cco-confirmation.md` is the only path to change R2–R7. Until Ryan signs **Confirm**, Agent ships the published 14/14 and 41-state list. Zip-level product count **forbidden** without “Yes — effective date.”

### R15 — No-paraphrase / no-gold-plate

Agent MUST NOT “clarify” TPMO, TCPA, or non-affiliation. MUST NOT add conversion CTAs that contradict R8. MUST NOT hide legal links.

### R16 — Verify

Agent MUST prove, before calling Phase R done:

| Check | How |
|---|---|
| Footer TPMO + non-affiliation | Load `/`, `/medicare-basics`, `/compare`, `/lead` |
| Consent server-side | POST lead without consent → rejected |
| Identifier scan | Submit SSN-like string → rejected |
| Leave-site | `/leaving?to=filebridge` 200, copy present |
| Legal routes | `/hipaa` `/glba` `/security` `/ai-disclosure` `/privacy` `/ab/privacy` 200 |
| Source lock | ripgrep: disclaimer string only from `compliance.ts` |
| Staff desk | `/console` not open to non-staff email |

Log results in the work-order or `docs/sow-acceptance.md`. Missing log = FAIL.

---

## 4. Sequence (the Agent runs in this order)

```
RA  audit every live URL in scope (worksheet 09a). STOP if audit-only.
 → R0 inventory
 → R1 source lock (create/keep compliance.ts; delete forks)
 → R2–R4 render (component + footer; states line)
 → R5–R6 forms + server + recording
 → R7 house facts
 → R8 scan public copy for forbidden claims
 → R9 leaving interstitial
 → R10–R13 legal pages (HIPAA, GLBA, AI, split privacy)
 → R14 attach CCO form; do not wait to ship static 14/14
 → R15 self-check paraphrase
 → R16 verify + log
 → STOP. Phase R PASS only if RA + R0–R16 PASS.
```

**Do not** start “conversion optimization” on plan pages until R16 is logged. **Do not** remediate an existing site until RA is filed.

---

## 5. Deliverables already in this build (packaged)

These are the Phase R artifacts from SOW No. 1. The Agent maintains them; it does not replace them with a rewrite.

| Artifact | Path |
|---|---|
| Source lock | `src/lib/compliance.ts` |
| TPMO renderer | `src/components/tpmo-disclaimer.tsx` |
| Footer | `src/components/site-footer.tsx` |
| HIPAA proof | `src/lib/hipaa.ts` · `/hipaa` |
| GLBA / NAIC | `src/lib/glba.ts` · `/glba` |
| ISP | `src/lib/isp.ts` · `/security` |
| AI | `/ai-disclosure` |
| Leave-site | `src/lib/leaving.ts` · `/leaving` |
| AB legal | `src/lib/ab-legal.ts` · `/ab/*` |
| This phase | `docs/contracts/09-phase-r-regulatory-disclaimers.md` |
| Existing-site audit protocol | `docs/contracts/09a-site-compliance-audit.md` |
| CCO form | `docs/cco-confirmation.md` |

---

## 6. Change control

| Change | Allowed? | How |
|---|---|---|
| Cosmetic (size, color) of TPMO block | Yes, if still readable | Agent |
| Wording of TPMO / TCPA / non-affiliation / states / counts | **No** | Signed CCO form, then one-line source edit |
| New marketing page that mentions plans | Yes only if it uses `<TpmoDisclaimer />` + footer | Agent; re-run R0, R8, R16 |
| Zip-level product count | **No** until CCO marks Yes | CCO + deploy |
| Collect MBI “just for the agent” | **Never** | — |
| Identifiable model training | **Never** under this phase | Would need new writing + BAA amendment |

---

## 7. Acceptance

Phase R is **complete** when:

1. R0–R16 are PASS (log attached).  
2. Client has been given `docs/cco-confirmation.md`. Unsigned CCO form does **not** fail Phase R if static 14/14 remains; it **does** fail if the Agent published different counts.  
3. SOW No. 1 acceptance (`docs/sow-acceptance.md`) may then be signed.

A later agent build that touches routes in R0 **re-enters Phase R** from R0. It does not inherit a PASS from this SOW.

---

## 8. Authority and signatures (phase adoption)

By signing, Client adopts Phase R as a **strict operating phase** of this engagement and of any Agent executing the build. Contractor and Agent will not treat disclaimer work as optional.

**Client — INSUREitALL LLC**  
I have authority to bind INSUREitALL LLC.  
Name: Ryan Butterfield  
Title: CEO  
Email: rmbutterfield@team-iia.com  
Signature: ______________________  Date: __________  

**Contractor — artificialBRIDGE LLC**  
I have authority to bind artificialBRIDGE LLC.  
Name: Michael Lang  
Title: Managing Member  
Email: lang@theartificialbridge.com  
Signature: ______________________  Date: __________  
