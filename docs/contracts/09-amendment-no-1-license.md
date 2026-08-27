# Amendment No. 1 — Design Partner License

**Parties:** artificialBRIDGE LLC (Licensor) · INSUREitALL LLC (Licensee)
**Amends:** Design Partner License (Effective Date: the date all parties’ signatures are complete; End Date 31 March 2027)
**Status:** **MERGED into [04-design-partner-license.md](04-design-partner-license.md).** Items A–F, H, I, J, K are folded into the base License text; do not sign this file separately. Item G (HIPAA covered-entity status) remains an **open item**, carried forward as License §4.9's open-item note — resolve it before signature, in the base License, not here. Kept for the drafting record only. Not legal advice.

Capitalized terms have the meanings given in the License. Where this Amendment conflicts with the License, this Amendment controls.

---

## A. Ratification of prior deployment — CONFIRM BEFORE SIGNING

Insert after the "does not auto-renew" line:

> **Ratification of prior deployment.** The parties acknowledge that Licensed Systems were first deployed on Licensee's domain on ______________ [CONFIRM ACTUAL GO-LIVE DATE], and that all use from that date forward was and is under this License, which the parties ratify as of that date.

*Why:* the License's Effective Date is now the date of last signature. If BRIDGEt went live on Licensee's domain before that signature date, uncontrolled third-party use sits outside the License and contradicts the first-use date on any USPTO filing.

## B. Payment condition — add to §2

> **Payment condition.** The grant in this §2 is expressly conditioned on payment in full of Invoice IIA-2026-0825 by its due date. Non-payment when due is an Early End trigger under §5, and Licensor may suspend or disable the Licensed Systems on 5 business days' written notice until payment is received.

*Why:* the site is already delivered and accepted under SOW §6, Net 15. Without this, non-payment leaves an unsecured claim in Wyoming venue. With it, non-payment is a takedown right.

## C. New §2A — Marks, quality control, and goodwill

Insert immediately after §2. **This is the item that protects BRIDGEt as an asset.**

> **2A.1 Licensed Marks.** "Licensed Marks" means BRIDGEt (word mark, wordmark lockup, character face, clay render, voice, and facade), Plan Choice Audit, fileBRIDGE, and artificialBRIDGE, together with any other Licensor mark appearing in the Licensed Systems.
>
> **2A.2 Ownership and goodwill.** Licensee acknowledges that Licensor owns the Licensed Marks and all goodwill in them. All use of the Licensed Marks by Licensee, and all goodwill arising from that use, inures solely to Licensor's benefit. Licensee will not (a) claim any ownership or any license beyond §2; (b) register or attempt to register any Licensed Mark, or any confusingly similar mark, domain, social handle, or application name, in any jurisdiction; or (c) challenge, or assist any third party in challenging, Licensor's rights in the Licensed Marks, during the Term or after it.
>
> **2A.3 Quality standards.** Licensee will use the Licensed Marks only: (a) in the form and presentation as deployed by Licensor, without alteration to spelling, capitalization ("BRIDGEt"), color, proportion, character depiction, or voice; (b) on the agreed domains; (c) in connection with services meeting or exceeding the quality of the Licensed Systems as delivered; and (d) in compliance with §7 and with Licensor's written brand and conduct guidelines, which Licensor may update on 15 days' written notice. Licensee will not present BRIDGEt as a licensed insurance agent, as Medicare, CMS, HHS, or any government program or contractor, or as endorsed by any of them.
>
> **2A.4 Inspection and supervision.** Licensor may at any time access and review the public deployment, and on 5 business days' notice review staging environments, system prompts, scripts, configurations, and beneficiary-facing copy through which the Licensed Marks or Licensed Systems are presented. Licensee will provide reasonable access and records on request. Licensor may capture and retain screenshots, recordings, and logs of the deployment as evidence of controlled use.
>
> **2A.5 Approval of material changes.** Licensee will not materially change BRIDGEt's persona, name, voice, script, depiction, or the beneficiary-facing presentation of any Licensed System without Licensor's prior written approval. Configuration within options Licensor exposes is not a material change.
>
> **2A.6 Cure; non-conforming use.** On written notice from Licensor of use not conforming to this §2A, Licensee will cure within 5 business days or suspend the non-conforming use until cured. Failure to do so is a material breach and an Early End trigger under §5.
>
> **2A.7 Attribution.** Licensee will preserve Licensor's attribution and all trademark notices as deployed, and will not combine its own marks with the Licensed Marks in any way suggesting joint ownership, co-branding, or that BRIDGEt is Licensee's product.

*Why:* §1 licenses the BRIDGEt name, wordmark, face, and voice with no quality control anywhere in the kit. A licensor lacking both contractual control rights and evidence of supervision can be found to have abandoned the mark outright (naked licensing; see FreecycleSunnyvale v. Freecycle Network, 9th Cir. 2010).

**Operational note — the clause is only half the defense.** Screenshot the deployment monthly into a dated folder, and send at least one written brand or conduct note during the Term. A control right never exercised is the fact pattern that loses these cases.

## D. Replace the opening of §4 — decouple consideration from PHI

Delete "Consideration is **Deidentified Data**, **Aggregated Data**, and qualitative feedback" and substitute:

> Consideration for the license is Licensee's participation as a design partner, including qualitative product feedback, roadmap input, reference availability, and case-study rights under ICA §15.
>
> Separately and independently, Licensor's right to create and use Deidentified Data and Aggregated Data is a permitted use under 45 CFR § 164.502(d) and the applicable business associate instrument, and is **not** consideration for, or the price of, this license. Nothing in this License conditions the grant on Licensee's disclosure of protected health information.

Conforming changes: retitle §4 to "Design-partner consideration; deidentified data and feedback"; retitle §4.2 to "What is never shared"; in §4.7, delete "If Licensee stops the bargain, or claims ownership of Licensed Systems, Licensor may revoke the product license under §5." and substitute "If Licensor revokes the product license under §5,"; in §5, replace Early End trigger (iii) with "withholds the design-partner feedback and reference participation described in §4".

*Why:* HIPAA's sale-of-PHI test reaches direct or indirect remuneration **including in-kind**, and expressly covers disclosures under license or access agreements. The License currently states that a $0 license plus (per SOW §2) a $21,510 discount is given in exchange for data. The substance is fine — Limited PHI only, Safe Harbor, no resale — but the drafting supplies the bad characterization. Decoupling removes it.

## E. Operational deadlines — §4.4(2) and §4.8

In §4.4(2), substitute:

> Licensor will use commercially reasonable automated and manual measures to detect Schedule A identifiers in received data, and will strip any such identifier, then **delete or irreversibly transform** the source row. Licensor's obligation is triggered by actual discovery, not by receipt. Licensor does not keep a reidentification key.

In §4.8, change "delete within **72 hours** of discovery" to "delete within **72 hours** of actual discovery."

*Why:* as written these are affirmative duties on a hard clock with no detection stack behind them. Licensor is the party most likely to breach them.

## F. Early End triggers — §5

Replace the trigger list with clauses (i), (ii), (iii as amended in D), (iv), plus:

> (v) uses the Licensed Marks in a manner not conforming to §2A and fails to cure or suspend within 5 business days of notice; or (vi) fails to pay Invoice IIA-2026-0825 when due.

## G. §4.9 — open item, resolve before signature

Insert at the head of §4.9:

> **OPEN ITEM.** The parties will confirm INSUREitALL's status under HIPAA (covered entity; business associate or downstream entity of a carrier; or neither) and select the correct instrument: Exhibit BAA, a subcontractor business associate agreement flowing down carrier terms, or a data processing addendum. Licensee will provide the deidentification and permitted-downstream-use language from any carrier BAA or downstream entity agreement that binds it.

Add at the end of the fileBRIDGE paragraph:

> On notice that a beneficiary has revoked consent to a field, Licensee will cease use of, and delete from its systems, the revoked field within 10 business days, except where retention is required by law or by carrier record-keeping obligations, in which case Licensee will isolate and stop using it.

*Why:* a Medicare agency is generally not a HIPAA covered entity, so Exhibit BAA likely names the wrong parties. More seriously, carrier BAAs commonly bar downstream deidentification for the downstream party's own commercial use — if that binds INSUREitALL, the warranty in Exhibit BAA §7 is false and the improvement loop has no lawful basis.

## H. Wind-Down — new §6.1

> **6.1 Certification of removal.** Within 5 business days after the Wind-Down end, Licensee will certify in writing, signed by an officer, that all Licensed Systems, Licensed Marks, and assets derived from them have been removed from all environments, including staging, backups reasonably capable of restoration, cached CDN assets, and marketing collateral. Licensor may verify by inspection.

## I. Compliance — new §§7.1–7.4

> **7.1 TPMO disclosure.** Licensee will display the CMS-required TPMO disclaimer and plan/organization-count representation on all beneficiary-facing pages hosting Licensed Systems, and is solely responsible for their accuracy and currency.
>
> **7.2 Plan-type education only.** Licensee will not configure, prompt, or hold out the Plan Choice Audit to name, rank, recommend, or compare specific plans, carriers, or benefit amounts. It is limited to plan-**type** education. Any specific-plan comparison requires prior carrier and CMS marketing material review, obtained by Licensee.
>
> **7.3 Recording consent.** Licensee will not enable, request, or configure recording of beneficiary voice through the Licensed Systems without capturing consent sufficient under CMS TPMO recording requirements and all applicable state two-party consent laws. Licensee is solely responsible for that consent.
>
> **7.4 Non-affiliation.** Licensee will not present the Licensed Systems in any manner that conveys an impression of approval, endorsement, or affiliation with Medicare, CMS, HHS, or the federal government, within the meaning of §1140 of the Social Security Act (42 U.S.C. § 1320b-10).

*Why:* Schedule A already contemplates beneficiary voice recordings existing, but nothing in the kit authorizes recording or allocates consent.

## J. Model-extraction terms — add to §3

> - Right to scrape, log, or extract BRIDGEt inputs or outputs for the purpose of training, fine-tuning, distilling, or evaluating any model, or to publish benchmarks or evaluations of the Licensed Systems without Licensor's prior written consent

## K. Signature blocks

Add "Name / title: ______________________" beneath each signature line. Both parties are LLCs; signing authority should appear on the face of the document.

---

**Licensor — artificialBRIDGE LLC**
Signature: ______________________ Date: __________
Name / title: ______________________

**Licensee — INSUREitALL LLC**
Signature: ______________________ Date: __________
Name / title: ______________________