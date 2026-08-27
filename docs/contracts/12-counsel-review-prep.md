# Counsel review prep — anticipated redline

**INTERNAL ONLY. DO NOT SEND.** This file discloses our negotiating range and walk-away. Same handling class as 06 and 07.

**Reviewing counsel:** Andrew Warmus, McDermott Will & Emery LLP (Chicago) — awarmus@mwe.com, 312-803-8310. MWE has a top-tier health practice. Assume the BAA gets a real health-regulatory read, not a commercial-associate skim.

**Posture to expect.** The default institutional reaction to a single-member LLC's own paper is "this is vendor paper from a solo operator — put it on our form." Every mandatory element present and correctly cited makes that harder to justify. The pre-send fixes in §4 exist mostly to deny them that move.

All regulatory citations below verified against eCFR primary text (2026-08-01 snapshot), govinfo, and HHS OCR guidance on 2026-08-27.

---

## 1. The three items that actually decide this deal

Everything else is trading. These three are the deal.

### 1.1 — BAA §2(3): de-identify-and-train (CRITICAL — this is the whole moat)

**What MWE does:** strikes it. Not narrows — strikes. It costs their client nothing and removes an unquantified data-rights exposure. The packet itself flags the carrier-BAA gap in its "Still outstanding" note, which is honest and correct, and also hands them the argument.

**Their strongest version of the argument, stated fairly:** a subcontractor BAA cannot grant more than the BA itself holds (45 CFR § 164.502(e)(1)(ii)). Carrier BAAs commonly permit the BA to use PHI for its own proper management and administration (§ 164.504(e)(2)(i)(A), (e)(4)) and to perform data aggregation *relating to the health care operations of the health care operations of the covered entity* (§ 164.504(e)(2)(i)(B)). Building a commercial training corpus for the subcontractor's own product is neither. And a BA may de-identify only to the extent its BAA authorizes it — that limit comes from HHS OCR de-identification guidance read against § 164.504(e)(2)(i), not from § 164.502(d), which addresses only the covered entity's own disclosure to a BA for that purpose.

**Our position:** the grant survives, expressly, with the Safe Harbor floor in License §4.3(B) and Schedule A as the guardrail. This is the entire consideration for a $0 license on a product valued at $2,500/mo. Note the structural point in our favor: License §4 already decouples the data right from the license grant — the de-identification right is a permitted use under the applicable BA instrument, *not* the price of the license. Hold that framing; it is the reason the license is not a disguised sale of PHI, and MWE will look for that.

**Fallback (acceptable):** §2(3) conditioned on written carrier-BAA confirmation, with a defined mechanism — IIA delivers the flow-down language within 30 days, and if it permits less, the parties narrow §2(3) to the permitted scope rather than deleting it. Keeps the right alive and puts a clock on the diligence.

**Walk-away.** If §2(3) is deleted outright, the $0 license goes with it. The license reprices to $2,500/mo per the AB-2026-001 valuation, or there is no design-partner deal. Say this early and plainly — it is much weaker said in round three.

### 1.2 — $5,000 cap vs. PHI exposure, from an uninsured single-member LLC (CRITICAL)

**What MWE does:** refuses the cap as written. They are right to, and this is the finding most likely to stall the deal.

The mismatch is real: ICA §10 caps total liability at fees actually paid ($5,000), expressly *including* indemnity, defense costs, and IP claims, carved out only for fraud and willful misconduct. Exhibit BAA §10 preserves that cap except for willful HIPAA violation. Meanwhile the counterparty is a single-member LLC that will hold PHI and has **not yet bound** the tech E&O and cyber coverage ICA §12 promises. A HIPAA breach's notification costs alone exceed $5,000 before anyone reaches damages. For a regulated client, that is an unacceptable counterparty risk profile, and no amount of drafting fixes it — only insurance does.

**Expect them to demand:** (a) data-security and HIPAA claims carved out of the cap entirely; (b) negligent, not just willful, HIPAA violations outside the cap; (c) coverage bound **before** signature, with a certificate of insurance, IIA as additional insured, and 30 days' notice of cancellation — ICA §12's "Client is not an additional insured unless a later writing says so" gets struck.

**Our position:** bind the coverage first. This is not a negotiating concession, it is the fix. Once ~$1M/claim tech E&O and cyber are actually in force, offer a **separate, higher cap for data-security and HIPAA claims set at the insurance limit**, while the general cap stays at fees paid. That structure is common, defensible, and gives MWE a real recovery source instead of a $5,000 number that reads as bad faith.

**Do not** agree to uncapped liability. A solo LLC with an uncapped HIPAA indemnity is an existential term, not a commercial one.

### 1.3 — The former-executive question (CRITICAL, and it is not in the packet at all)

Lang was Sr VP of Operations at INSUREitALL until the ~March 2026 termination, and built the artificialBRIDGE product line against the four operational gaps he owned there. MWE runs a conflicts and diligence check as a matter of course and will surface this immediately.

**The question they will ask:** was any Licensed System — BRIDGEt, Plan Choice Audit, the reconciliation engine, the corpus schema — conceived, developed, or derived using INSUREitALL confidential information, or during employment? What does the separation agreement say about non-compete, non-solicitation, confidentiality, and assignment of inventions?

Nothing in the packet addresses this. ICA §18's integration clause is scoped to "this engagement" and "this website" — it does not touch the employment relationship, and it should not be stretched to.

**Before the packet goes out:** pull the separation agreement and any employment agreement, offer letter, or IP-assignment document and read the restrictive covenants and invention-assignment language directly. Do not proceed on recollection. If there is an invention-assignment clause with a broad scope, that is a question for our own counsel before a single document is signed, because it goes to whether artificialBRIDGE owns what it is licensing.

**If it is clean,** volunteer a representation to that effect. Offering it unprompted is worth more than conceding it in round two, and it neutralizes the issue at the point where it is cheapest.

**Note the asymmetry:** this is the one item on this list where the downside is not a worse deal — it is a claim against artificialBRIDGE's ownership of its core IP. Treat it first.

---

## 2. High-severity findings

| # | Finding | What MWE says | Our position / fallback |
|---|---|---|---|
| H1 | **Breach notice = 5 business days** (BAA §6) | Too slow. IIA has its own downstream clock to the carriers, and the CE chain runs on § 164.410 (without unreasonable delay, no later than 60 calendar days, subject to the § 164.412 law-enforcement delay). Five business days across a holiday weekend is nine calendar days and can blow IIA's carrier obligation. | **Concede — they are right.** Offer 48 hours for a Breach of Unsecured PHI, 5 business days for a non-Breach Security Incident. **Ask in exchange** for the standard exclusion of unsuccessful security incidents (pings, scans, failed logins) from individual reporting. Cheap concession, real goodwill, better practice. |
| H2 | **Illusory defense obligation** (ICA §§10, 11(b), (d)) | A defense obligation capped at $5,000 inclusive of defense costs is not a defense obligation — $5,000 does not cover a week of counsel. Copyright-only indemnity with no patent and no trade-secret coverage compounds it. | Tie to §1.2. Once insured, exclude defense costs from the cap or set the IP/data cap at the policy limit. Hold the line on **no patent indemnity** — that is standard for a studio this size and defensible. |
| H3 | **Model survival is drafted weaker than intended** (License §4.7) | Current text says lawfully de-identified data "may remain in models that cannot reasonably be unwound." That phrasing implies unwinding is the default expectation wherever feasible — a concession we did not mean to make. | **Fix before sending.** The intended term (per the AB-2026-001 record) is artificialBRIDGE ownership and a perpetual license of the de-identified derivative **and the trained models**, surviving termination. Draft it affirmatively. Far easier to have present at the start than to add during a redline. |
| H4 | **3-year retention cap on de-identified records** (License §4.8) | Nothing — MWE will happily keep it. | **This one is self-inflicted.** De-identified data is not PHI and HIPAA imposes no retention limit on it. A 3-year horizon caps the longitudinal persistency corpus (90/180/365-day labels, rapid-disenrollment) that is the point of the exercise. Change to indefinite retention for de-identified data; keep the 72-hour destruction rule for identifiers received in error. If they push back, that is a fight worth having on the merits. |
| H5 | **Publicity clause is load-bearing** (ICA §15 + License §4) | Standard MWE move is to strike publicity or make it consent-required. | Do not let this pass as boilerplate. Reference availability and case-study rights are **stated consideration** for the $0 license. If §15 goes, the license is arguably gratuitous. Acceptable landing: consent not to be unreasonably withheld, with a defined review window. But say out loud that removing it reprices the license. |
| H6 | **"Design-partner feedback" is unenforceably vague** (License §5(iii)) | Correct — §5 makes withholding feedback an Early End trigger, but §4 defines no measurable obligation. IIA cannot breach an unmeasurable duty. | **Fix before sending, in our favor.** Tie the obligation to §5A: attendance at no fewer than one meeting per calendar month, written feedback within N business days of a written request, and one reference call or case-study approval per quarter. Now the trigger has teeth and §5A does double duty. |
| H7 | **BAA ends before the wind-down does** (BAA §8 vs. License §6) | Genuine drafting bug, and MWE will find it. The BAA ends on the License End Date (31 Mar 2027) with 30 days to return/destroy. But the License wind-down also runs to 30 Apr 2027, during which IIA may still be operating Licensed Systems — so PHI can flow while no BAA is in force. | **Fix before sending.** Extend the BAA through the later of the Wind-Down end and completion of return/destroy. Non-controversial, and finding it ourselves reads as competence. |

---

## 3. Medium-severity findings

- **M1 — Unilateral guideline changes.** License §2A.3 lets Licensor update brand and conduct guidelines on 15 days' notice, and §2A.6 makes non-conformance an Early End trigger. MWE calls this a unilateral right to amend. *Bound it:* changes prospective only, and may not materially increase Licensee's cost or obligations.
- **M2 — Inspection scope.** §2A.4 permits capture and retention of "screenshots, recordings, and logs of the deployment." A health practice will read that as a PHI-capture right. *Fix:* expressly exclude PHI from anything captured, and subject inspection to Licensee's security policies.
- **M3 — Ratification back to 25 Aug 2026.** License §5 ratifies pre-signature deployment. MWE will note their client ran licensed systems unlicensed for weeks. *Offer a mutual release for that period* — costs nothing, closes the gap cleanly, and is better than letting them raise it.
- **M4 — Vendor BAA allocation is backwards.** BAA §4 says "BA still signs each vendor's own BAA (Neon, and any email/voice host)." But Neon and Resend are contracted on **artificialBRIDGE's** accounts, which makes them our second-tier subcontractors under § 164.502(e)(1)(ii) and § 164.314(a)(2)(iii) — *we* sign those BAAs, not IIA. Fix the allocation to follow the contracting party. Separately: confirm whether Neon's BAA requires a specific paid plan tier before representing that it is available.
- **M5 — Mandatory BAA element missing.** § 164.504(e)(2)(ii) requires ten provisions, (A)–(J). Our exhibit covers all but **(H)** — "to the extent the business associate is to carry out a covered entity's obligation under this subpart, comply with the requirements of this subpart that apply to the covered entity in the performance of such obligation." Add it. Also thicken §5 by citing §§ 164.524, 164.526, and 164.528 by section rather than describing them generically, and cite § 164.314(a) alongside the Security Rule reference in §3. A complete, correctly-cited exhibit is the single cheapest way to change the tone of this review.
- **M6 — fileBRIDGE's structure invites a question we should be able to answer.** artificialBRIDGE owns the portal, holds the beneficiary accounts, and has a direct consent relationship with the beneficiary. Two questions follow, and we want answers ready rather than improvised: (a) for accounts held directly with the consumer rather than on IIA's behalf, does the FTC Health Breach Notification Rule (16 CFR Part 318) apply, given that it expressly does not reach an entity acting as a HIPAA business associate — meaning the two regimes may split across the same product depending on the capacity in which we hold the data; (b) does a lead-generating consumer portal operated for an agency itself fall inside the TPMO definition at 42 CFR § 422.2260, which reaches entities compensated to perform lead generation as part of the chain of enrollment and expressly includes entities that are not FDRs. Neither is necessarily a problem. Both are questions a health practice asks, and "we've analyzed that" is a materially different answer than silence.
- **M7 — Acceptance window.** SOW §6's 7-day deemed acceptance will be pushed to 15–30 days with affirmative written acceptance. Minor; concede.
- **M8 — Assignment.** ICA §16 lets Contractor assign to a successor without consent. A regulated client will want consent, or notice plus a termination right, particularly for assignment to a competitor. Note also that assigning the BAA down a carrier chain may itself need carrier permission. Concede to notice-plus-termination-right.

---

## 4. Fix before sending — do not wait for the redline

Each of these is either a gap in our own favor or a defect that costs credibility when opposing counsel finds it first.

1. **BAA:** add mandatory element § 164.504(e)(2)(ii)(H); cite §§ 164.524 / 164.526 / 164.528 by section in §5; cite § 164.314(a) in §3.
2. **BAA §8:** extend the term through the later of the Wind-Down end and completion of return/destroy (H7).
3. **BAA §4:** reallocate vendor BAAs to whoever contracts with the vendor (M4).
4. **License §4.7:** affirmative model-ownership-and-survival language (H3).
5. **License §4.8:** indefinite retention for de-identified data; keep 72-hour destruction for identifiers received in error (H4).
6. **License §4/§5A:** make the design-partner obligation measurable so the §5(iii) trigger is enforceable (H6).
7. **Invoice IIA-2026-0825 is dated due 9 September 2026.** An MWE review runs two to four weeks minimum. The invoice will be past due before the agreement is signed, and an already-overdue invoice attached to an unsigned agreement is a bad look and an easy point to score. Reissue with the due date keyed to signature (Net 15 from the Effective Date).
8. **The ICA effective date is 25 August 2026 — already past.** ICA §12's 30-day insurance clock therefore runs from a date that will be a month or more stale at signature, so the representation goes stale on delivery. Either bind the coverage now (preferred — see §1.2) or key the 30 days to the date of last signature.
9. **Two different effective dates across one engagement** (ICA: 25 Aug 2026; License: date of last signature). Reconcile or explain in the cover email before they ask.
10. **Pull the separation and employment documents** and read the restrictive covenants and invention-assignment language (§1.3). This one gates everything else.

---

## 5. Pre-committed trade

Decide this before the first call, not during it.

**We give:** the higher liability cap for data-security and HIPAA claims, set at the bound insurance limit — plus the fast breach clock, the acceptance window, venue, and the publicity consent qualifier.

**We get:** BAA §2(3) intact (narrowed to the carrier flow-down if the language requires it, never deleted), affirmative model-ownership survival, and indefinite de-identified retention.

That is the natural shape of this negotiation. MWE wants a real recovery source; we want the data rights. Both are available and they are not in conflict. Lead with the insurance — offering it before they demand it converts our weakest position into the thing we trade from.

**Venue.** Wyoming law with Texas venue has no nexus to either party or the transaction: artificialBRIDGE is a Wyoming LLC, INSUREitALL is a Delaware LLC operating from Fort Lauderdale, counsel is in Chicago. Texas gets struck in round one and looks arbitrary while it stands. Preferred landing: Wyoming law and Wyoming venue. Acceptable: Delaware law and venue. **Keep the existing carve-out permitting injunctive relief for IP and trademark misuse in any court of competent jurisdiction** — that clause protects the BRIDGEt marks and is worth more than the venue itself.

---

## 6. Have in hand before the packet goes out

- [ ] Separation / employment agreement and any invention-assignment document (§1.3) — **gating**
- [ ] Tech E&O and cyber bound, certificate of insurance issued (§1.2) — **gating**
- [ ] Carrier BAA de-identification and downstream-use language from INSUREitALL (§1.1)
- [ ] Neon and Resend second-tier BAAs executed on artificialBRIDGE's accounts (M4)
- [ ] Invoice reissued with a signature-keyed due date (§4.7)
- [ ] Manual pass over /hipaa, /glba, /ab/privacy to close out Phase R

Not legal advice. artificialBRIDGE should have its own counsel review this packet before it goes to MWE — the asymmetry of a solo operator negotiating unrepresented against a top-tier health practice is itself a risk factor, and it is the cheapest one on this list to remove.
