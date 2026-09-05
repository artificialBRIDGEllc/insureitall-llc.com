# AUD-20260903-insureitall-llc.com

**Date of audit:** 2026-09-03
**Surface audited:** `insureitall-llc.com` (live production)
**Also checked:** `insureitallins.com` → canonicals to `insureitall-llc.com`; one surface, not two
**Auditor:** artificialBRIDGE (site builder, not agency owner or operator)
**Route to:** Ryan Butterfield, CEO INSUREitALL — this is agency compliance, not
an artificialBRIDGE decision. Owner of remediation is the agency; artificialBRIDGE
can execute the code change on instruction.

**Governing authority:** 42 CFR 422.2267(e)(41), 423.2267(e)(41) — standardized
content, must be used verbatim in the form CMS provides.

---

## String currently served to the public

Verbatim, appearing twice on the homepage (mid-page block and footer "Legal"):

> We do not offer every plan available in your area. Currently we represent 14
> organizations which offer 14 products in your area. Any information we provide
> is limited to those plans we do offer in your area. Please contact Medicare.gov,
> 1-800-MEDICARE, or your local State Health Insurance Program (SHIP) to get
> information on all of your options.

---

## Findings

### F1 — CRITICAL — Standardized content is not verbatim; two variants spliced

The served string is a hybrid. It contains the numeric form's second sentence
("Currently we represent [N] organizations which offer [N] products in your area")
**and** the older generic form's sentence ("Any information we provide is limited
to those plans we do offer in your area"). Neither standardized variant contains
both sentences.

This is a defect **regardless** of how the effective-date question in F4 resolves,
because no version of the reg produces this string. Standardized content is not a
template to combine — it is used as provided.

**Fix:** serve exactly one variant, unmodified.

### F2 — CRITICAL — The counts are implausible on their face and unprovable

"14 organizations which offer 14 products" asserts that each represented parent
organization offers exactly one plan benefit package in the visitor's area. That
does not occur in practice — an appointed parent org typically offers several PBPs
per county.

The most likely cause is the organization count being duplicated into the product
field. I cannot confirm the number is wrong without the agency's appointment data;
I can confirm it is **not provable from any source**, which is the operative
problem. If a carrier or CMS asks what supported "14 and 14" on a given date, there
is currently no answer.

**Fix:** recompute from appointment data before any number is published again.

### F3 — HIGH — One static number serving 41 states, with no ZIP or county input

The footer states the agency is licensed in 41 states. MA service areas are
county-keyed; representation varies by county. A single hardcoded pair of numbers
cannot be accurate for the visitor's area in more than a narrow slice of that
footprint, and the site collects no ZIP or county to narrow it.

FMO website policy in circulation states the disclaimer must be specific to the
beneficiary's service area. A static site-wide number does not meet that.

**Fix:** the `bridge_disclosure` resolver, once real appointment data is loaded.
42 CFR 422.2265 permits requiring ZIP, county, or state entry for this purpose.

### F4 — HIGH, conditional — SHIP language retained

The served string includes the SHIP referral. CMS removed SHIP from the
standardized text at 91 FR 17583 (Apr 6, 2026) and moved the verbal timing
requirement from "within the first minute" to "prior to the discussion of any
benefits."

Whether the retained SHIP language is currently non-compliant depends on the
amendment's applicability date — the single open item in `bridge_disclosure`.
Flagging as HIGH because it resolves to either "wrong now" or "wrong shortly."

**Adjacent, out of scope of this audit:** the same amendment changes call-script
timing. The site states calls are recorded and monitored for compliance, so there
is a script and a QA process that also need the new timing rule. Not audited here.

### F5 — MEDIUM — Two hardcoded copies, no single source

The string appears twice in the page with no shared source. Any correction must be
applied in both places, and drift between them is silent.

**Fix:** one server-rendered component reading from the resolver.

### F6 — INFO — Legacy content may still be indexed

Search results surfaced an `insureitallins.com/about` page whose copy does not
match the current deploy. The live fetch canonicals to `insureitall-llc.com`, so
this is likely a stale index rather than a second live surface — but confirm no
legacy deploy or subdomain is still serving Medicare content with its own
disclaimer.

---

## Remediation ruling

**Today, before anything else:** replace both instances with the generic
no-numbers variant. It requires no data, resolves F1 and F2 immediately, and is
defensible for anonymous pages that collect no ZIP. A generic disclaimer is not a
violation; an unprovable number is.

**Then, once appointment data is loaded:** switch to the numeric variant served
per-county by the resolver, with the ZIP prompt and fail-closed behavior already
built and tested.

**Do not** simply correct "14 and 14" to a different static pair. That fixes the
implausibility and leaves F2 and F3 intact — still unprovable, still not
area-specific.

## Residual risk after the stopgap

The generic no-numbers text itself traces to the 2023 form of the reg plus CMS
informal guidance for anonymous landing pages, not to current standardized
content. It is the better of the two available positions today, not a verified
one. It needs the same sourcing as F4 — both hang on the same unanswered
applicability question.

## Not examined

Interior pages (`/compare`, `/bridget`, `/needs-analysis`, `/lead`,
`/medicare-basics`) — the Plan Choice Audit and BRIDGEt flows are the highest-risk
surfaces, since interactive comparison tools are more likely to constitute
marketing and may collect location. Audit those next. Call scripts, email
templates, and paid ad copy also carry the disclaimer requirement and are outside
this pass.
