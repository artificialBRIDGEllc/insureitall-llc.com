# Freelance contract packet

Not legal advice. Have counsel review before you send.

Amendment No. 1 (License) and Amendment No. 1 (ICA/SOW) have been **merged into the base documents below** so the packet is single clean documents, not base + redline. The two amendment files stay in the repo as the drafting record, each marked **MERGED**, and are **not** part of the send list.

**Sign in this order:** ICA → SOW No. 1 → Design Partner License → **Exhibit R (Phase R)** → **Exhibit BAA (once blocker 1 below is resolved)** → send invoice.

| File | What it now includes |
|---|---|
| [01-cover-email.md](01-cover-email.md) | Send-with note; open items to confirm |
| [02-independent-contractor-agreement.md](02-independent-contractor-agreement.md) | 1099, IP, $5k cap including indemnity, defense control, BAA pointer, **Phase R lock**, 30-day insurance bind, Texas venue |
| [03-sow-website-update.md](03-sow-website-update.md) | **$5,000** website only · one-time SEO in scope · Phase R gates block acceptance |
| [04-design-partner-license.md](04-design-partner-license.md) | Through **31 Mar 2027** from date of last signature · trademark quality control (§2A) · decoupled consideration · monthly check-in (§5A) · change-billing split (§5B) · recurring costs excluded (§5C) · wind-down certification · TPMO/plan-type/recording/non-affiliation covenants (§7.1–7.4) |
| [08-baa-exhibit.md](08-baa-exhibit.md) · [08-baa-exhibit.html](08-baa-exhibit.html) | **Sign electronically** once blocker 1 below is resolved. Host Limited PHI; deidentify to train. Not identifiable training. No extra fee. ESIGN + Wyoming UETA. |
| [11-phase-r-regulatory-disclaimers.md](11-phase-r-regulatory-disclaimers.md) | **Strict operating phase.** Agent MUST pass **RA + R0–R16**. Source-locked TPMO/TCPA. No paraphrase. R9 (leave-site) currently not applicable — see blocker 3. |
| [11a-site-compliance-audit.md](11a-site-compliance-audit.md) | **Existing websites.** Audit before edit. Severity + worksheet. Audit-only SOWs stop here. |
| [09-amendment-no-1-license.md](09-amendment-no-1-license.md) | **MERGED into 04** — drafting record only, do not send |
| [10-amendment-no-1-ica-sow.md](10-amendment-no-1-ica-sow.md) | **MERGED into 02/03** — drafting record only, do not send |
| [05-blank-freelance-kit.md](05-blank-freelance-kit.md) | Next client — **internal only** |
| [06-indemnification-options.md](06-indemnification-options.md) | Indemnity options — **internal only, do not send** |
| [07-defense-control.md](07-defense-control.md) | Defense control — **internal only, do not send** |
| [../invoice-IIA-2026-0825.html](../invoice-IIA-2026-0825.html) | **$5,000 due 9 Sep 2026** — ACH routing/account on file; bank name and EIN still blank |
| [../cco-confirmation.md](../cco-confirmation.md) | Ryan Butterfield — TPMO / states / TCPA sign-off |
| [../audits/AUD-20260825-insureitall-llc.com.md](../audits/AUD-20260825-insureitall-llc.com.md) | RA audit of the live host + 27 Aug addendum — production-deploy gap still open, see blocker 3 |

## Pre-signature blockers — still open

Everything that could be resolved by drafting alone has been folded into the base documents. What's left needs a fact or a decision only Contractor or Client can supply:

1. **Exhibit BAA / License §4.9 — HIPAA covered-entity status is still an open item.** Confirm whether INSUREitALL is a HIPAA covered entity, a business associate/downstream entity of a carrier, or neither, and pick the right instrument (Exhibit BAA as drafted, a flow-down BA agreement, or a data processing addendum). Exhibit BAA is not ready to sign until this is confirmed.
2. **License §5 ratification clause has a blank go-live date** (`[CONFIRM ACTUAL GO-LIVE DATE]`) — fill in the date Licensed Systems (BRIDGEt, etc.) first went live on Licensee's domain, so it doesn't contradict any USPTO first-use date.
3. **Production deployment parity is unverified.** This repo (`artificialBRIDGEllc/insureitall-llc.com`) contains `/hipaa`, `/glba`, `/ab/privacy`; the 25 Aug live audit found those 404 on `www.insureitall-llc.com`. Confirm the Vercel production deployment is this repo's current `main` before treating Phase R as PASS or signing SOW acceptance. Separately, `/portal` no longer links out to fileBRIDGE (it's a "coming soon" placeholder), so Exhibit R gate R9 (leave-site interstitial) is not applicable right now — re-open it if that integration goes live.
4. **ICA §12 insurance is now a 30-day-bind obligation, not yet bound.** Actually bind tech E&O + cyber (~$1,000,000 per claim each) within 30 days of the Effective Date so the representation stays true.
5. **Invoice remit block is missing the bank name and EIN.** Routing/account are filled in; `Bank [NAME]`, `[EIN XX-XXXXXXX]`, and `[REMIT ADDRESS]` (for check payers) still need real values before sending.

## Send list

Attach **02, 03, 04, 08 (once blocker 1 is resolved), 11, and the invoice.** Never attach 05, 06, 07, or the amendment files (09, 10) — they're merged and internal.

They still need **vendor BAAs** (Neon, any host that stores doctor/med names). Exhibit BAA is only artificialBRIDGE ↔ INSUREitALL.
