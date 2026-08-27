# Freelance contract packet

Not legal advice. Have counsel review before you send.

Amendment No. 1 (License) and Amendment No. 1 (ICA/SOW) have been **merged into the base documents below** so the packet is single clean documents, not base + redline. The two amendment files stay in the repo as the drafting record, each marked **MERGED**, and are **not** part of the send list.

**Sign in this order:** ICA → SOW No. 1 → Design Partner License → **Exhibit R (Phase R)** → **Exhibit BAA** → send invoice.

| File | What it now includes |
|---|---|
| [01-cover-email.md](01-cover-email.md) | Send-with note |
| [02-independent-contractor-agreement.md](02-independent-contractor-agreement.md) | 1099, IP, $5k cap including indemnity, defense control, BAA pointer, **Phase R lock**, 30-day insurance bind, Texas venue |
| [03-sow-website-update.md](03-sow-website-update.md) | **$5,000** website only · one-time SEO in scope · Phase R gates block acceptance |
| [04-design-partner-license.md](04-design-partner-license.md) | Through **31 Mar 2027** from date of last signature · ratified go-live 25 Aug 2026 · trademark quality control (§2A) · decoupled consideration · monthly check-in (§5A) · change-billing split (§5B) · recurring costs excluded (§5C) · wind-down certification · TPMO/plan-type/recording/non-affiliation covenants (§7.1–7.4) |
| [08-baa-exhibit.md](08-baa-exhibit.md) · [08-baa-exhibit.html](08-baa-exhibit.html) | **Sign electronically.** Subcontractor BAA — INSUREitALL is BA of the carriers, artificialBRIDGE is INSUREitALL's subcontractor. Host Limited PHI; deidentify to train. Not identifiable training. No extra fee. ESIGN + Wyoming UETA. |
| [11-phase-r-regulatory-disclaimers.md](11-phase-r-regulatory-disclaimers.md) | **Strict operating phase.** Agent MUST pass **RA + R0–R16**. Source-locked TPMO/TCPA. No paraphrase. R9 (leave-site) currently not applicable — see note 2 below. |
| [11a-site-compliance-audit.md](11a-site-compliance-audit.md) | **Existing websites.** Audit before edit. Severity + worksheet. Audit-only SOWs stop here. |
| [09-amendment-no-1-license.md](09-amendment-no-1-license.md) | **MERGED into 04** — drafting record only, do not send |
| [10-amendment-no-1-ica-sow.md](10-amendment-no-1-ica-sow.md) | **MERGED into 02/03** — drafting record only, do not send |
| [05-blank-freelance-kit.md](05-blank-freelance-kit.md) | Next client — **internal only** |
| [06-indemnification-options.md](06-indemnification-options.md) | Indemnity options — **internal only, do not send** |
| [07-defense-control.md](07-defense-control.md) | Defense control — **internal only, do not send** |
| [../invoice-IIA-2026-0825.html](../invoice-IIA-2026-0825.html) | **$5,000 due 9 Sep 2026** — bank, account, routing, EIN filled in; check remit address still blank |
| [../cco-confirmation.md](../cco-confirmation.md) | Ryan Butterfield — TPMO / states / TCPA sign-off |
| [../audits/AUD-20260825-insureitall-llc.com.md](../audits/AUD-20260825-insureitall-llc.com.md) | RA audit of the live host + 27 Aug addendum — production-deploy parity now confirmed via Vercel |

## Resolved since the last pass

1. **HIPAA structure confirmed.** INSUREitALL is a business associate of the Medicare insurance carriers/plans (the covered entities), not itself a covered entity here; artificialBRIDGE is INSUREitALL's **subcontractor**. Exhibit BAA is rewritten as the subcontractor BAA 45 CFR § 164.502(e)(1)(ii) requires — see its "Still outstanding" note: INSUREitALL still needs to hand artificialBRIDGE the deidentification/downstream-use language from its own carrier BAA(s), since a subcontractor agreement can't flow down more than INSUREitALL itself is authorized to give.
2. **Go-live date confirmed** — 25 August 2026. License §5's ratification clause is filled in.
3. **Production deployment parity confirmed.** Vercel's production alias for `www.insureitall-llc.com` currently serves commit `13c020be034ac088bd1382102a0d539ecfde59e7` on `main` — the same commit this packet's PR branches from, which contains `/hipaa`, `/glba`, and `/ab/privacy`. Direct HTTP checks of the live URLs weren't possible from this environment (network policy blocks the domain); do one manual pass over `/hipaa`, `/glba`, `/ab/privacy` before calling Phase R fully PASS. Separately, `/portal` no longer links out to fileBRIDGE (it's a "coming soon" placeholder), so Exhibit R gate R9 (leave-site interstitial) is not applicable right now — re-open it if that integration goes live.
4. **Invoice remit block filled in** — bank (Coastal Community Bank, Everett WA), account name, routing, account number, and EIN are all in. Only the check-payer mailing address (`[REMIT ADDRESS]`) is still a placeholder.

## Pre-signature blockers — still open

1. **ICA §12 insurance is a 30-day-bind obligation, not yet bound.** Actually bind tech E&O + cyber (~$1,000,000 per claim each) within 30 days of the Effective Date so the representation stays true.
2. **Invoice check remit address** (`[REMIT ADDRESS]`) is still a placeholder — only relevant if Client might pay by check rather than ACH.
3. **Carrier BAA flow-down language** — INSUREitALL should send artificialBRIDGE the deidentification/permitted-downstream-use language from its carrier BAA(s) per Exhibit BAA's "Still outstanding" note, so §2(3) is confirmed within what INSUREitALL is actually authorized to flow down.

## Send list

Attach **02, 03, 04, 08, 11, and the invoice.** Never attach 05, 06, 07, or the amendment files (09, 10) — they're merged and internal.

They still need **vendor BAAs** (Neon, any host that stores doctor/med names). Exhibit BAA is only artificialBRIDGE ↔ INSUREitALL.
