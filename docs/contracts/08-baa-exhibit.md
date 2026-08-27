# Exhibit BAA — Subcontractor Business Associate Agreement

**Business Associate (BA):** INSUREitALL LLC — a business associate of the Medicare insurance carriers/plans (the HIPAA covered entities) for enrollment-related PHI it handles on their behalf.
**Subcontractor (Sub-BA):** artificialBRIDGE LLC (Wyoming single-member LLC) — engaged by BA to host, support, and deidentify Limited PHI, and therefore itself a business associate under 45 CFR § 160.103 with respect to that PHI.
**Effective:** [DATE signed]
**Ends:** with the Design Partner License End Date (**31 March 2027**), then PHI return/destroy in §8
**Related:** ICA · SOW No. 1 · Design Partner License

Not legal advice. This exhibit is a HIPAA **subcontractor** business associate contract — governed the same way a covered-entity-to-BA contract is governed under 45 CFR § 164.504(e), per 45 CFR § 164.502(e)(1)(ii) (a business associate must bind its own subcontractors to the same restrictions and conditions that apply to the business associate). Sign it if BA wants Sub-BA to host, support, or deidentify Limited PHI from the site. **It does not let Sub-BA train models on identifiable PHI.**

**Confirmed structure (resolves License §4.9's open item):** INSUREitALL is not itself a HIPAA covered entity here — it is a **business associate of the insurance plans/carriers** for the PHI it collects to help beneficiaries enroll. artificialBRIDGE is INSUREitALL's **subcontractor**, and this exhibit is the subcontractor BAA required by 45 CFR § 164.502(e)(1)(ii).

**Still outstanding — BA to provide.** A subcontractor BAA cannot grant Sub-BA more than BA itself is permitted to do under BA's own BAA(s) with the carriers. Before or promptly after signature, BA (INSUREitALL) will provide Sub-BA the deidentification and permitted-downstream-use / subcontracting language from BA's carrier BAA(s), so Sub-BA can confirm this exhibit doesn't exceed what BA is authorized to flow down. If a carrier BAA bars downstream deidentification for the subcontractor's own use (a common restriction), §2(3) of this exhibit needs to be narrowed or removed before it can be relied on.

## 1. Limited PHI (the only PHI in scope)

Optional **doctor names**, **medication names**, and **notes** a person types (a) on insureitall-llc.com needs-analysis / lead forms, or (b) in **fileBRIDGE** (filebridge.theartificialbridge.com) after they grant INSUREitALL access to those fields. fileBRIDGE is owned and operated by Sub-BA. Sub-BA’s public privacy policy is /ab/privacy.

**Never in scope (still forbidden on the site and to Sub-BA):** Social Security numbers, Medicare Beneficiary Identifiers, bank accounts, card images, uploaded medical records, lab PDFs.

Contact-only leads (name, phone, email, zip, window) without health details are not treated as PHI under this exhibit.

## 2. Permitted uses and disclosures

Sub-BA may use and disclose Limited PHI only to:

1. Host and operate the Licensed Systems for BA (desk, portal, backup as configured)
2. Provide support, security, and breach investigation
3. **Create deidentified data** under 45 CFR §§ 164.502(d) and 164.514 (Safe Harbor or aggregation, License §4 and Schedule A), then use that deidentified data to train and improve BRIDGEt and related systems — **subject to the carrier-BAA confirmation above**
4. As required by law

Sub-BA will **not**:

- Train a model on **identifiable** Limited PHI
- Sell PHI
- Use Limited PHI to market to a person
- Combine Limited PHI with other data to identify someone after deidentification
- Store SSN or MBI

Minimum necessary: Sub-BA takes only what those four uses require.

## 3. Safeguards

Sub-BA will use administrative, physical, and technical safeguards required of a business associate (Security Rule). In this product that includes: TLS in transit, staff-email gate on `/console`, no SSN/MBI fields, lead-alert emails without doctors/meds/notes, widget cannot open the portal file, identifier scan on free text.

## 4. Subcontractors

Sub-BA may use its own subprocessors (including hosting, database, email) only if they are bound in writing to the same restrictions — a second-tier subcontractor BAA, same rule as this exhibit. **BA still signs each vendor’s own BAA** where that vendor offers one (Neon, and any email/voice host that will see Limited PHI). Vercel and similar hosts that only see encrypted traffic are not a substitute for a database BAA.

## 5. Individual rights and HHS

Sub-BA will, as BA reasonably directs and as the Security/Privacy Rules require: support access, amendment, and accounting of disclosures of Limited PHI in Sub-BA’s possession, and make Sub-BA’s relevant books available to HHS.

## 6. Incidents

Sub-BA will notify BA without unreasonable delay and no later than **five (5) business days** after Sub-BA discovers a Breach of Unsecured PHI or a Security Incident involving Limited PHI, with the facts Sub-BA then has (what, when, whose, what was done). BA remains responsible for any required individual/HHS/media/carrier notices unless a later writing says Sub-BA will send them.

## 7. BA duties

BA will not ask Sub-BA to use PHI outside this exhibit or outside what BA's own carrier BAA(s) permit BA to flow down. BA will not send SSN or MBI to Sub-BA. BA’s privacy notice will match License §4. BA warrants it has the authority, under its own agreements with the carriers, to share Limited PHI with Sub-BA for §2, and to authorize §2(3) specifically.

## 8. Term, return, destroy

This exhibit starts when both parties sign. It ends on the License End Date (or earlier if the License is revoked). Within **30 days** after end (the Wind-Down), Sub-BA will return Limited PHI to BA or destroy it so it is not readable, except:

- Deidentified Data already produced under License §4 may remain (it is not PHI)
- Copies Sub-BA must keep by law, kept only as long as required, still under this exhibit

If return/destroy is not feasible, Sub-BA will keep the remainder under this exhibit and stop using it except as that law requires.

BA may terminate this exhibit (and the License, if it wants) if Sub-BA materially breaches and does not cure in 10 days.

## 9. No extra fee

This exhibit covers the **existing** $5,000 SOW and $0 design-partner license. It is not a sale of PHI. Training remains on deidentified/aggregated data only. A later writing is required if BA wants Sub-BA to process identifiable PHI for any other purpose (including identifiable model training).

## 10. Conflict

If this exhibit and the License conflict on PHI, **this exhibit controls**. ICA indemnity, defense control, and the $5,000 cap still apply, except a party’s willful HIPAA violation.

## 11. Electronic signatures

This exhibit may be signed in counterparts, including by **electronic signature**. A signature transmitted as PDF, DocuSign, HelloSign, Adobe Sign, or a typed name preceded by `/s/` and sent from the signer’s email, is an original for ESIGN (15 U.S.C. § 7001) and Wyoming UETA (W.S. 40-21). Each party consents to do business electronically for this exhibit only. A fully signed PDF is the official copy.

**Business Associate — INSUREitALL LLC**
Ryan Butterfield, CEO, has full authority to bind INSUREitALL LLC.
☐ I agree this electronic signature is my legal signature on this BAA, and I have authority to bind INSUREitALL LLC.
/s/ Ryan Butterfield  Date: __________
Name: Ryan Butterfield
Title: CEO
Email: rmbutterfield@team-iia.com

**Subcontractor — artificialBRIDGE LLC**
Michael Lang, Managing Member, has full authority to bind artificialBRIDGE LLC.
☐ I agree this electronic signature is my legal signature on this BAA, and I have authority to bind artificialBRIDGE LLC.
/s/ ______________________  Date: __________
Name: Michael Lang
Title: Managing Member
Email: lang@theartificialbridge.com
