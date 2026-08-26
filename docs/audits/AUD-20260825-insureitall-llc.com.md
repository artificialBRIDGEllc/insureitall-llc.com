# AUD-20260825-insureitall-llc.com

Host: https://www.insureitall-llc.com (apex 307 → www)  
Date: 25 August 2026  
Agent: Grok Build (Phase R / RA)  
Mode: audit + BUILD (Exhibit R)  
CCO: Ryan Butterfield, CEO / acting CCO  

Repo (`artificialBRIDGEllc/insureitall-llc.com`) is **ahead** of this live host. Findings below are **live HTML**, not the workspace tree.

## Hosts crawled

- https://insureitall-llc.com/ → 307 → https://www.insureitall-llc.com/
- /lead /compare /bridget /ai-disclosure /privacy (200)
- /hipaa /glba /leaving /ab/privacy (404)

## Summary

Critical: 0  
Major: 4  
Minor: 1  
Pass: 7  
Unable: 2  

Live is **not** Phase R PASS. BUILD in this workspace already contains the remediations; they are not on www until that tree is the production deploy.

## Findings

| ID | Check | Grade | URL | Quote (exact) | Map to R-gate | Status |
|---|---|---|---|---|---|---|
| F-01 | A2 TPMO | Pass | / /lead /compare /bridget | “We do not offer every plan available in your area. Currently we represent 14 organizations which offer 14 products…” | R2 | pass |
| F-02 | A1 non-affiliation | Pass | footer on those pages | “Insure It All is not connected with or endorsed by the U.S. Government or the federal Medicare program.” | R3 | pass |
| F-03 | A5 TCPA | Pass (HTML) | /lead | “express written consent” present on lead | R5 | pass (DOM) |
| F-04 | A6 server TCPA | Unable | /lead POST | Not posted in this audit (no live PII). Repo enforces via `parsePublicLead`. | R5 | unable → treat Major until production POST test |
| F-05 | A7 recording | Pass | / | footer “recorded and monitored” | R6 | pass |
| F-06 | A8 identifiers | Pass (HTML) | /lead /privacy | No SSN/MBI fields in lead HTML; privacy mentions Medicare number as not collected | R8 | pass |
| F-07 | A10 AI | Pass | /bridget /ai-disclosure | “not a licensed” on both | R12 | pass |
| F-08 | A11 leave-site | Major | /leaving | **404**. Footer/fileBRIDGE cannot show third-party interstitial on this deploy. | R9 | open — in repo, not live |
| F-09 | A12 HIPAA proof | Major | /hipaa | **404**. No proof page on this deploy. | R10 | open — in repo, not live |
| F-10 | A9/A12 GLBA | Major | /glba | **404**. | R11 | open — in repo, not live |
| F-11 | A13 privacy split | Major | /ab/privacy | **404**. AB entity page not on this deploy. | R13 | open — in repo, not live |
| F-12 | A14 TTY | Minor | /lead | TTY 711 in home footer; not confirmed in lead extract | R7 | open / verify |
| F-13 | A3 counts | Pass | footer | 14 / 14 — matches unpublished CCO form default (Ryan has not signed zip-level Yes) | R14 | pass (static) |
| F-14 | A16 extra landers | Unable | ads/GHL | No other hosts named this session | A16 | unable |

## Unable tests

| Check | Why | Follow-up |
|---|---|---|
| A6 POST without consent | Did not hit production API with a body | After www = this repo, POST `consent:false` expect reject |
| A16 other landers | Client did not list funnels | Ryan: list any GHL / ads URLs |

## CCO / Client

☐ Log received  Date: ____  
☐ Critical/Major accepted as residual risk (list IDs): ____  
☐ Proceed to BUILD — **BUILD already done in workspace; remaining work is deploy this tree to www**  

Name / title: Ryan Butterfield, CEO  

## Agent sign-off (RA)

Filed `docs/audits/AUD-20260825-insureitall-llc.com.md`. Do not call live Phase R PASS until F-08–F-11 are 200 on www.
