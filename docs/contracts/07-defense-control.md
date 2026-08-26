# Defense control — how the indemnity actually runs

Not legal advice. Pair with [06-indemnification-options.md](06-indemnification-options.md).

Indemnity without a **procedure** is a fight about who hires the lawyer. “Defend, indemnify, and hold harmless” is three jobs. **Defend** is the one that spends money first.

| Word | When it fires | What it costs |
|---|---|---|
| **Defend** | Claim is *alleged* (pleadings, demand letter) | Counsel from day one, even if the suit is junk |
| **Indemnify** | After a covered loss (judgment or allowed settlement) | The check |
| **Hold harmless** | Overlap; often treated as “don’t come after me” | First-party friction |

Some states (including California) imply a duty to defend from “indemnify” unless you negate it. If you do **not** want to defend garbage CMS letters on a $5k job, say so. Version B of §11 already says “defend” — so budget for counsel when *you* are the indemnitor (copyright claim on your tools). When *they* are the indemnitor (TCPA, TPMO, their logo), **they** should defend.

---

## The control stack

```
Claim hits Client or Contractor
        ↓
1. NOTICE (tender)     — written, with the papers
        ↓
2. ASSUMPTION          — indemnitor takes the file, or declines
        ↓
3. COUNSEL             — who picks the firm
        ↓
4. STRATEGY            — motions, discovery, experts
        ↓
5. SETTLEMENT          — who can write a check / admit fault
        ↓
6. COOPERATION         — facts, witnesses, no freelance letters
```

If you skip 1–3, you get “we hired Cravath, here is the bill.”

---

## 1. Notice (tender)

Indemnitee sends the complaint / demand **promptly**. “Prompt” without a prejudice rule lets them void your duty over a three-day delay.

**Use:** failure to notify relieves the indemnitor **only to the extent it is materially prejudiced** (lost evidence, default judgment, expired insurance).

Insurance analog: tender to the carrier. On this job, also tender to **their E&O / cyber** if a beneficiary or carrier sues. Your ICA should not become their insurance policy.

## 2. Right to assume

The party who **pays** should have the **right** (not always the duty) to assume and **solely control** the defense of claims *to which its indemnity applies*.

If they refuse to assume after a proper tender, you may defend and recover reasonable fees for the covered part.

If they assume, you stop running the case. You still get copies.

## 3. Counsel selection

| Model | Who picks | When to use |
|---|---|---|
| **Sole control** | Indemnitor | Default. You are paying. |
| **Approved counsel** | Indemnitor picks; other party can veto for cause | $5k job: skip unless they insist |
| **Independent / Cumis-style** | Indemnitee picks, indemnitor pays | Only if a **conflict**: indemnitor reserved the right to deny coverage *and* the conflict is about facts in the same case (e.g. “was this willful?”) |
| **Monitor counsel** | Indemnitee hires a second lawyer at **own** expense to watch | Fine; they don’t get to steer |

Do not volunteer independent counsel on a website SOW. That is insurance-policy machinery. If their counsel asks, limit it to: *actual conflict of interest, not a mere reservation that the claim might be uncovered.*

## 4. Mixed claims

A suit will mix “their logo” (they defend) with “BRIDGEt copied a face” (you defend) with “Medicare is confusing” (nobody).

**Mechanism:** indemnitor controls the **covered** counts. Indemnitee may defend uncovered counts at its own cost. Fees allocated reasonably. Do not let one firm bill you for the whole kitchen-sink complaint.

## 5. Settlement consent

Three different consents. Do not lump them.

| Settlement does… | Consent of the *other* party |
|---|---|
| Pay money the **indemnitor** is already on the hook for | Not required |
| Admit **fault** of the indemnitee, or impose an injunction / license / take-down of BRIDGEt | **Required**, not unreasonably withheld |
| Use the **indemnitee’s** money (above the cap, or uncovered) | **Required** |

Without the middle row, they can settle a CMS matter by agreeing to kill BRIDGEt on the site. That is how you lose the character.

Without the last row, they settle using *your* $5k cap plus a promise you never made.

## 6. Cooperation

Indemnitee: send papers, make people available, do not talk to the plaintiff, do not settle behind the indemnitor’s back.

Breach of cooperation should cut the duty **only if it prejudices** the defense — same as notice.

## 7. Reservation of rights (the insurance cousin)

In insurance, the carrier defends while saying “we might not pay the judgment.” That can create a conflict and trigger independent counsel (California *Cumis*, some other states).

In a **freelance ICA**, you are not a carrier. If you defend a copyright claim “subject to the $5k cap,” that is a reservation. Spell it:

- You may defend **without waiving** the cap or the copyright-only scope.
- That reservation **does not** by itself give them a blank check for their own firm.

## 8. Failure to defend

If the indemnitor ignores a proper tender:

- Indemnitee may defend and settle reasonably
- Recover defense costs for covered claims
- In some states, a wrongful refusal to defend estops coverage fights

So: if they tender a TCPA class action to **you**, **decline in writing** (“this is Client’s indemnity under §11(a)”). Silence looks like assumption.

If someone tenders a BRIDGEt copyright suit to **them**, they should tender it back to you.

---

## Drop-in procedure (add as §11(c)–(f) or a short exhibit)

Replace the one-sentence procedure in Version B with this if you want it tight:

```
(c) Notice. The indemnified party will give prompt written notice
    (email is enough) and copies of the claim papers. Late notice
    relieves the indemnifying party only to the extent of material
    prejudice.

(d) Control. The indemnifying party may assume sole control of the
    defense and settlement of any third-party claim to which its
    indemnity applies, with counsel it selects. The indemnified
    party may hire monitoring counsel at its own expense. If the
    indemnifying party does not assume within 15 days after notice,
    the indemnified party may defend and recover reasonable covered
    defense costs.

(e) Settlement. The indemnifying party will not settle a claim in a
    way that (i) admits fault of the indemnified party, (ii) imposes
    a non-monetary obligation (including taking down or assigning
    Contractor IP), or (iii) requires payment by the indemnified
    party, without prior written consent, not unreasonably withheld.
    The indemnified party will not settle a covered claim without the
    indemnifying party’s consent.

(f) Mixed claims. Control and fees apply only to claims (or portions)
    actually covered. Uncovered counts stay with the party who owns
    that risk. A reservation that the cap or exclusions may apply is
    not, by itself, a conflict requiring independent counsel.

(g) No insurance. This Agreement is not liability insurance. Each
    party remains free to tender to its own carriers. Contractor’s
    defense obligation, when it exists, is subject to Section 10.
```

---

## How this plays on *this* job

| If this shows up | Who controls defense |
|---|---|
| Beneficiary: “your text messages” | **Client** (TCPA) — you tender to them, do not assume |
| Carrier: “TPMO count is wrong” | **Client** (CCO) |
| Stock-shop: “BRIDGEt face is our photo” | **You** (copyright as delivered) — you pick counsel, $5k cap |
| Patent troll: “plan comparison website” | **Decline** — not in your indemnity |
| Vercel / Resend outage | **Neither** — third-party; no assumption |
| They want to settle by giving the carrier BRIDGEt | **You must consent** — non-monetary + your IP |

On $5k, the mechanism that matters most is **(e)**: they cannot settle away your character. Second is **(d)**: they cannot pick the firm and send you the invoice.

---

## What not to sign

- “Client may assume the defense of any claim arising from the website” (too wide — includes their TCPA)
- “Contractor pays all attorneys’ fees of Client’s chosen counsel”
- Settlement consent **only** for money, not for injunctions
- Independent counsel **whenever** you reserve the cap
- Failure-to-notify = automatic forfeiture (use prejudice)

Insurance duty-to-defend law (Cumis, reservation letters, panel counsel) is a different animal. Do not import it wholesale into a freelance SOW.
