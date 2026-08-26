# Design Partner License

**Licensor:** artificialBRIDGE LLC  
**Licensee:** INSUREitALL LLC  
**Effective date:** 25 August 2026  
**End date:** **24 August 2027** (11:59 p.m. America/Chicago)  
**Wind-down end:** **23 September 2027** (30 days after the End Date)  
**Related:** Independent Contractor Agreement · SOW No. 1 · Invoice IIA-2026-0825  

This is a **license**. It is **not a sale** and **not an assignment**. ICA indemnity and defense-control terms apply to claims about Licensed Systems.

The Term is **one year**. It does **not** auto-renew.

## 1. Licensed systems (this phase)

Licensor owns and licenses, solely as hosted on Licensee’s agreed domains (insureitall-llc.com and agreed staging), except **fileBRIDGE**, which Licensor owns and operates at **filebridge.theartificialbridge.com**:

- BRIDGEt (name, face, wordmark, smile, clay, widget, voice, facade)
- Plan Choice Audit (type-level trade-off ledger)
- **Beneficiary portal** (artificialBRIDGE owned and operated). Licensee may **integrate** as a partner. Access to a beneficiary’s file is **only** by that beneficiary’s express, field-scoped consent, revocable at any time. Licensee does not own the portal, the accounts, or the files.
- Lead-alert / Resend kit as configured for Licensee
- Related UI that is not Client’s supplied logos

**Not licensed:** **beneFIT** (benefits screener). Not on this site. Phase 2 requires a new SOW and fee.

## 2. Grant

Royalty-free, **non-exclusive**, **non-transferable**, **non-sublicensable**, revocable license to **run** the Licensed Systems on the agreed domains **during the Term only**, solely for Licensee’s Medicare agency operations.

No white-label. No resale. No sublicense to a carrier, FMO, or other agency. No claim of ownership in a deck, contract, carrier form, or repo. Licensee will not remove Licensor attribution where it already appears (including the BRIDGEt name).

## 3. What Licensee does not get

- Source-code assignment or work-made-for-hire
- Right to fork, sell, or embed the systems in another brand
- Right to train a competing model on Licensor’s characters or engines
- Any right in **beneFIT**
- Patent license beyond running the deployed site
- Any right to use Licensed Systems **after the End Date**, except the Wind-Down in §6

## 4. Consideration — deidentified data and feedback

This license is **$0 during this Term only**. Consideration is **Deidentified Data**, **Aggregated Data**, and qualitative feedback, used only as this section allows.

### 4.1 Permitted use

Licensor may use Deidentified Data and Aggregated Data to:

- train, evaluate, and improve BRIDGEt and related models
- improve the Plan Choice Audit, Licensed Systems, and UX
- quality, security, and abuse detection for those systems
- write non-identifying research, benchmarks, and product notes

Licensor will **not**: sell the data; use it to market to a specific person; underwrite or price that person’s insurance; reidentify anyone; or combine it with other data for the purpose of identifying anyone.

### 4.2 What is not consideration

Licensee will not send, and Licensor will not accept as training or improvement data: Social Security numbers, Medicare Beneficiary Identifiers, medical record numbers, full-face photos of beneficiaries, or any Schedule A identifier.

Hashed or encrypted email, phone, name, or MBI **still counts as an identifier** if Licensor can reverse it or if it can be matched back. Do not send it.

A first name plus a 5-digit zip plus medications is **not** deidentified. Neither is a unique widget transcript tied to a portal login.

### 4.3 Deidentification methods (the floor)

The parties adopt these methods as the **contractual floor**, using HIPAA’s deidentification rule as the standard even where a record is not HIPAA PHI (insurance-agency / GLBA data included):

**(A) Aggregation.** Counts, rates, funnels, and other statistics that do not relate to a single person and that do not allow a person to be picked out of a small cell. Licensor will not publish a cell with fewer than **10** people.

**(B) Safe Harbor strip.** Individual-level records may be used only after **all** identifiers in **Schedule A** (45 CFR § 164.514(b)(2)) are removed, and Licensor has no actual knowledge that the rest could identify the person.

**(C) Not used on this license:** expert-determination deidentification (45 CFR § 164.514(b)(1)), limited data sets (city / 5-digit zip / dates), or pseudonyms Licensor can reverse. Those need a separate writing.

### 4.4 Who strips what

1. Licensee must not put Schedule A identifiers into feedback channels meant for Licensor (exports, email, Slack, “training dumps”).
2. Licensor will strip any Schedule A identifier that still appears, then **delete or irreversibly transform** the source row. Licensor does not keep a reidentification key.
3. If a record cannot be Safe-Harbor stripped, it is **not used**. It is deleted.
4. Qualitative notes (e.g. “seniors keep asking about the doughnut hole”) are allowed if they name no person.

### 4.5 No reidentification

Licensor will not try to identify anyone from Deidentified Data or Aggregated Data, and will not allow a subprocessor to, except if legally required — and then only to the extent required, with notice to Licensee if law allows.

### 4.6 Subprocessors and models

Licensor may use vendors (hosting, model training, evaluation) under a written duty at least as tight as this §4. Licensor will not feed Schedule A identifiers into a third-party model. Outputs must not be designed to emit identifiers.

### 4.7 License to the data

Licensee grants Licensor a non-exclusive, worldwide, royalty-free license to use Deidentified Data and Aggregated Data as §4.1 allows, including **after the End Date** for copies already lawfully deidentified. Licensee does not grant a license to identifiers.

If Licensee stops the bargain, or claims ownership of Licensed Systems, Licensor may revoke the product license under §5. Lawful Deidentified Data already in use may remain in models that cannot reasonably be unwound; Licensor will stop **new** collection.

### 4.8 Retention

Aggregated Data: as long as useful for §4.1.  
Deidentified individual-level records: no longer than **three (3) years** after receipt, then delete or reduce to Aggregated Data.  
Identifiers received in error: delete within **72 hours** of discovery.

### 4.9 BAA · who holds PHI

**Client (INSUREitALL) may collect Limited PHI on the site** — optional doctor names, medication names, and notes — so a licensed agent can prepare. That PHI stays in Client’s desk and portal. Lead-alert emails never include doctors, medications, or notes.

**If Exhibit BAA is signed:** Licensor is Client’s business associate for Limited PHI on Client’s own forms (needs analysis / lead notes) and, separately, for fields a beneficiary grants on **fileBRIDGE** (owned and operated by Licensor at filebridge.theartificialbridge.com; privacy: /ab/privacy). Permitted uses are host/support and **creating deidentified data** for the training loop in §4.1–4.3. Licensor still will **not** train on identifiable PHI, and still will **not** take SSN or MBI.

fileBRIDGE accounts are Licensor’s, not Client’s. Client sees them only with the beneficiary’s express, field-scoped consent.

**If Exhibit BAA is not signed:** Licensor does not receive identifiable PHI. Consideration is only Deidentified Data and Aggregated Data Client can share without a BAA.

A BAA is not a HIPAA certificate. Client still signs vendor BAAs (database, any host that holds Limited PHI).

### 4.10 Client notice

Licensee is responsible for its privacy notice and any consent needed to allow this §4. The public site already discloses that information (never SSN or Medicare numbers) may be used to train BRIDGEt or improve the site. Licensee will not promise the opposite.

## 5. Term, end date, early end

**Term:** 25 August 2026 through **24 August 2027** (the “End Date”).

The license **ends on the End Date** with no automatic renewal. Continued use after the End Date is not a renewal; it is unlicensed.

**Early end (revocation).** Licensor may end the Term earlier, on written notice, if Licensee (i) claims ownership of Licensed Systems, (ii) sublicenses or white-labels, (iii) stops the data/feedback bargain, or (iv) materially breaches the ICA or this License and does not cure in 10 days. The Wind-Down in §6 then starts on the notice date instead of the End Date.

**Non-renewal.** Either party may say in writing, at least 30 days before the End Date, that it will not discuss a successor license. Silence is not a renewal.

**Successor license.** A new writing, with a new end date and a **new fee** (not $0 unless Licensor agrees in that writing). Phase 2 products (including beneFIT) are never added by silence.

## 6. What happens after the End Date (Wind-Down)

From the End Date (or early-end notice) through the **Wind-Down end** (30 days):

| | After End Date |
|---|---|
| **Licensee may keep** | INSUREitALL logos Licensee supplied. Marketing pages paid under SOW No. 1 that do not run Licensed Systems (home, Medicare Basics **type table**, contact, lead, needs analysis, ident using **their** logo, legal pages). Lead records in **Licensee’s** database. |
| **Licensee must stop / remove** | BRIDGEt (page, widget, clay, wordmark, voice). Plan Choice Audit (`/compare` engine). Client portal, share codes, staff console. Lead-alert / Resend kit as a Contractor product. Any claim of a “BRIDGEt” or “Plan Choice Audit” offering. |
| **How** | Disable or delete those routes and assets. `/compare` may redirect to `/medicare-basics` or `/contact`. `/bridget`, `/portal`, `/console` must not serve Licensed Systems. |
| **Licensor may** | Disable or require take-down of Licensed Systems if Licensee misses the Wind-Down end. No refund of the $5,000 SOW fee. |
| **Data** | Licensee keeps its own leads. Licensor keeps Deidentified Data and Aggregated Data already lawfully processed under §4. No new identifiable collection after the End Date. |
| **After Wind-Down end** | Any remaining use of Licensed Systems is infringement, not a holdover license. ICA confidentiality, ownership, $5k cap, and indemnity **for claims that arose during the Term** survive. |

The $5,000 website update is **not** a perpetual license to BRIDGEt or the audit.

## 7. Compliance

Licensed Systems are educational. They do not enroll. They are not Medicare, CMS, or a licensed agent. Licensee remains the licensed agency of record and wears TCPA, TPMO, HIPAA, and sales risk (ICA §11(a)).

## 8. Warranty and liability

As deployed. ICA §§9–11 apply, including the **$5,000 cap**, copyright-only Contractor indemnity, defense control, and no patent indemnity.

**Licensor — artificialBRIDGE LLC**  
Name: Michael Lang  
Title: Managing Member  
Email: lang@theartificialbridge.com  
Date: __________  

**Licensee — INSUREitALL LLC**  
Name: Ryan Butterfield  
Title: CEO (authorized to bind Licensee)  
Email: rmbutterfield@team-iia.com  
Date: __________

---

## Schedule A — Safe Harbor identifiers

Removed before any individual-level record is Deidentified Data. Source: 45 CFR § 164.514(b)(2).

1. Names  
2. Geographic subdivisions smaller than a state (street, city, county, precinct, **5-digit zip**). First **3** zip digits only if the combined area has more than 20,000 people; otherwise zip is stripped entirely  
3. Dates (except year) tied to a person — birth, admission, discharge, death; ages **90+** grouped as 90 or older  
4. Telephone numbers  
5. Fax numbers  
6. Email addresses  
7. Social Security numbers  
8. Medical record numbers  
9. Health plan beneficiary numbers, including **Medicare Beneficiary Identifiers (MBI)**  
10. Account numbers  
11. Certificate / license numbers  
12. Vehicle identifiers and license plates  
13. Device identifiers and serial numbers  
14. URLs  
15. IP addresses  
16. Biometric identifiers (fingerprints, voiceprints, etc.)  
17. Full-face photographs and comparable images of a person  
18. Any other unique identifying number, characteristic, or code (Licensor will not keep a reidentification key)

**Also treated as identifiers under this License:** hashed/encrypted forms of 1–18 that Licensor can reverse or match; portal user IDs; session IDs that map to an account; voice recordings of a beneficiary.
