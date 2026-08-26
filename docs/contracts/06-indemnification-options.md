# Indemnification — options for this $5k job

Not legal advice. Counsel should pick a version before you send.

Indemnity is “if a third party sues *them* because of something *you* control, you pay the defense and the judgment.” It is separate from the liability cap unless you say it is not. On a **$5,000** SOW, an uncapped indemnity is how a website job becomes a career problem.

Market pattern in software services: mutual, but **not symmetric**. Each side covers what it actually controls. Vendors usually give a **narrow IP** indemnity. Customers cover their content, data, and how they use the product. About half of negotiated vendor deals include a customer indemnity; IP infringement and customer content are the two most common buckets.

---

## What you have now (ICA §11)

> Client indemnifies Contractor for claims arising from Client-supplied content, Client’s use of the site, insurance sales, and CMS/carrier actions. Contractor indemnifies Client for claims that Contractor-owned tools, as delivered, infringe a third-party copyright, excluding Client materials and third-party APIs.

**Good:** direction of risk is right. Medicare sales / CMS / TCPA sit on the agency. Your promise is copyright only, not patents.

**Missing:**
- **Defend** vs pay after — who hires the lawyer on day one
- **Notice** and **control of defense**
- **Settlement consent**
- Whether indemnity is **inside the $5k cap**
- Carve-outs: Client mods, combination with other software, ElevenLabs / Vercel / fonts
- TCPA / HIPAA / TPMO named (your “CMS/carrier” line is close, not explicit)
- Your own willful misconduct (they will ask)

---

## The levers

| Lever | Contractor-friendly (you) | Client-friendly (them) |
|---|---|---|
| Who | Mutual, each covers own lane | You indemnify “arising out of the services” (too wide) |
| Claims | **Third-party** claims only | First-party (they sue you and you pay their lawyers) |
| IP | U.S. **copyright** as delivered | “Any IP, including patents, worldwide, uncapped” |
| Cap | Indemnity **subject to fees paid** ($5k) | Indemnity **carved out** of the cap |
| Mods | No cover if they change the code or mix APIs | You cover combinations |
| Defense | You control defense of claims you indemnify | They pick counsel, you pay |
| Healthcare | They cover TCPA, TPMO, CMS, HIPAA, sales | You cover “compliance of the site” |

For this deal, do **not** accept: uncapped patent indemnity, “arising out of the website,” or indemnity outside the cap. The fee cannot fund a patent war. Licensors who own characters (BRIDGEt) should limit IP risk to the contract value unless they are charging enterprise SaaS money.

---

## Version A — keep (short)

What is in the ICA today. Fine if they sign without a lawyer. Thin if they negotiate.

## Version B — recommended drop-in (replace ICA §11)

```
11. Indemnity

(a) Client will defend, indemnify, and hold harmless Contractor and its
members from third-party claims, damages, and reasonable legal fees to
the extent arising from: (i) materials Client supplied (including logos
and copy); (ii) Client’s insurance sales, marketing, call/text practices,
and use of the site; (iii) Client’s representations to CMS, carriers,
beneficiaries, or regulators (including TPMO, TCPA, HIPAA, and
non-affiliation); and (iv) Client’s modification of Contractor systems
or combination with software Contractor did not supply.

(b) Contractor will defend, indemnify, and hold harmless Client from
third-party claims that Contractor-owned tools, as delivered by
Contractor and used as licensed, infringe a U.S. copyright, excluding
claims based on Client materials, third-party services (including
hosting, email, fonts, and voice APIs), Client modifications, or
combination with other software.

(c) The indemnifying party’s obligations require prompt written notice,
sole control of defense and settlement (no settlement that admits fault
or imposes a non-monetary duty on the other party without consent, not
unreasonably withheld), and reasonable cooperation.

(d) Amounts under this Section 11 are subject to Section 10 (cap at fees
paid under the SOW that gave rise to the claim). This Section does not
apply to a party’s fraud or willful misconduct.
```

## Version C — if their counsel pushes

You may: name TCPA/HIPAA on their side (already in B). Offer a **1× fees** super-cap on your copyright indemnity instead of “uncapped IP.” You may add: Contractor will, at its option, replace or remove the alleged infringing piece.

You do **not**: add patents, worldwide IP, first-party indemnity, or “uncapped except for Client.” Walk before you agree those on a $5k job.

---

## Procedure (why it matters)

**Defend** is broader than **indemnify**. Defend = pay counsel even if the suit is garbage. If you omit “defend,” they can still dump a CMS letter on you and argue you must pay.

**Control of defense** = you pick the lawyer when you are the one paying. Without it, they hire a downtown firm and send you the bill.

**Cap interaction:** ICA §10 caps “total liability.” Some courts still treat indemnity as outside that cap unless you say “including indemnity.” Version B says it.

---

## This industry, specifically

| Risk | Who should wear it |
|---|---|
| Logo they gave you is stolen | Client |
| Agent texted without TCPA consent | Client |
| TPMO count is wrong | Client (CCO owns 14/14) |
| “We are Medicare” claim | Client |
| BRIDGEt face copied from a stock shop you used | Contractor (copyright as delivered) |
| Vercel / Resend / ElevenLabs outage or ToS | Neither — third-party; exclude |
| Patent troll on “a website that compares plan types” | Nobody on a $5k SOW — do not take it |
| beneFIT (not on this site) | Not in this license; do not indemnify a product you held back |

---

Replace ICA §11 with Version B if you want the packet tightened. Leave A if you want it short and they are already signing.
