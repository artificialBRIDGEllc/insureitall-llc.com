# Exhibit BAA — Business Associate Agreement

**Covered Entity (CE):** INSUREitALL LLC  
**Business Associate (BA):** artificialBRIDGE LLC (Wyoming single-member LLC)  
**Effective:** [DATE signed]  
**Ends:** with the Design Partner License End Date (**24 August 2027**), then PHI return/destroy in §8  
**Related:** ICA · SOW No. 1 · Design Partner License  

Not legal advice. This exhibit is the HIPAA business associate contract (45 CFR § 164.504(e)). Sign it if CE wants BA to host, support, or deidentify Limited PHI from the site. **It does not let BA train models on identifiable PHI.**

## 1. Limited PHI (the only PHI in scope)

Optional **doctor names**, **medication names**, and **notes** a person types (a) on insureitall-llc.com needs-analysis / lead forms, or (b) in **fileBRIDGE** (filebridge.theartificialbridge.com) after they grant INSUREitALL access to those fields. fileBRIDGE is owned and operated by BA. BA’s public privacy policy is /ab/privacy.

**Never in scope (still forbidden on the site and to BA):** Social Security numbers, Medicare Beneficiary Identifiers, bank accounts, card images, uploaded medical records, lab PDFs.

Contact-only leads (name, phone, email, zip, window) without health details are not treated as PHI under this exhibit.

## 2. Permitted uses and disclosures

BA may use and disclose Limited PHI only to:

1. Host and operate the Licensed Systems for CE (desk, portal, backup as configured)  
2. Provide support, security, and breach investigation  
3. **Create deidentified data** under 45 CFR §§ 164.502(d) and 164.514 (Safe Harbor or aggregation, License §4 and Schedule A), then use that deidentified data to train and improve BRIDGEt and related systems  
4. As required by law  

BA will **not**:

- Train a model on **identifiable** Limited PHI  
- Sell PHI  
- Use Limited PHI to market to a person  
- Combine Limited PHI with other data to identify someone after deidentification  
- Store SSN or MBI  

Minimum necessary: BA takes only what those four uses require.

## 3. Safeguards

BA will use administrative, physical, and technical safeguards required of a business associate (Security Rule). In this product that includes: TLS in transit, staff-email gate on `/console`, no SSN/MBI fields, lead-alert emails without doctors/meds/notes, widget cannot open the portal file, identifier scan on free text.

## 4. Subcontractors

BA may use subprocessors (including hosting, database, email) only if they are bound in writing to the same restrictions. **CE still signs each vendor’s own BAA** where that vendor offers one (Neon, and any email/voice host that will see Limited PHI). Vercel and similar hosts that only see encrypted traffic are not a substitute for a database BAA.

## 5. Individual rights and HHS

BA will, as CE reasonably directs and as the Security/Privacy Rules require: support access, amendment, and accounting of disclosures of Limited PHI in BA’s possession, and make BA’s relevant books available to HHS.

## 6. Incidents

BA will notify CE without unreasonable delay and no later than **five (5) business days** after BA discovers a Breach of Unsecured PHI or a Security Incident involving Limited PHI, with the facts BA then has (what, when, whose, what was done). CE remains responsible for any required individual/HHS/media notices unless a later writing says BA will send them.

## 7. CE duties

CE will not ask BA to use PHI outside this exhibit. CE will not send SSN or MBI to BA. CE’s privacy notice will match License §4. CE warrants it has the authority to share Limited PHI with BA for §2.

## 8. Term, return, destroy

This exhibit starts when both parties sign. It ends on the License End Date (or earlier if the License is revoked). Within **30 days** after end (the Wind-Down), BA will return Limited PHI to CE or destroy it so it is not readable, except:

- Deidentified Data already produced under License §4 may remain (it is not PHI)  
- Copies BA must keep by law, kept only as long as required, still under this exhibit  

If return/destroy is not feasible, BA will keep the remainder under this exhibit and stop using it except as that law requires.

CE may terminate this exhibit (and the License, if it wants) if BA materially breaches and does not cure in 10 days.

## 9. No extra fee

This exhibit covers the **existing** $5,000 SOW and $0 design-partner license. It is not a sale of PHI. Training remains on deidentified/aggregated data only. A later writing is required if CE wants BA to process identifiable PHI for any other purpose (including identifiable model training).

## 10. Conflict

If this exhibit and the License conflict on PHI, **this exhibit controls**. ICA indemnity, defense control, and the $5,000 cap still apply, except a party’s willful HIPAA violation.

## 11. Electronic signatures

This exhibit may be signed in counterparts, including by **electronic signature**. A signature transmitted as PDF, DocuSign, HelloSign, Adobe Sign, or a typed name preceded by `/s/` and sent from the signer’s email, is an original for ESIGN (15 U.S.C. § 7001) and Wyoming UETA (W.S. 40-21). Each party consents to do business electronically for this exhibit only. A fully signed PDF is the official copy.

**Covered Entity — INSUREitALL LLC**  
Ryan Butterfield, CEO, has full authority to bind INSUREitALL LLC.  
☐ I agree this electronic signature is my legal signature on this BAA, and I have authority to bind INSUREitALL LLC.  
/s/ Ryan Butterfield  Date: __________  
Name: Ryan Butterfield  
Title: CEO  
Email: rmbutterfield@team-iia.com  

**Business Associate — artificialBRIDGE LLC**  
Michael Lang, Managing Member, has full authority to bind artificialBRIDGE LLC.  
☐ I agree this electronic signature is my legal signature on this BAA, and I have authority to bind artificialBRIDGE LLC.  
/s/ ______________________  Date: __________  
Name: Michael Lang  
Title: Managing Member  
Email: lang@theartificialbridge.com  

