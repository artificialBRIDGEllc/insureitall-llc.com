# INSUREitALL website — current state

Last aligned: 29 Aug 2026 (staff console extracted to a separate multi-tenant product, BRIDGEt Console). Preview app is the **TanStack Start** tree at repo root. GitHub: [artificialBRIDGEllc/insureitall-llc.com](https://github.com/artificialBRIDGEllc/insureitall-llc.com). Staff admin now lives in **BRIDGEt Console**, a separate repo/product ([copperlang2007/BRIDGEt](https://github.com/copperlang2007/BRIDGEt) — pending transfer to the `artificialBRIDGEllc` org). `/console` and `/team` here just redirect to it (`VITE_BRIDGET_CONSOLE_URL`). `/portal` is now a **beneficiaryCONNECT** "client portal coming soon" placeholder — beneficiaryCONNECT is a separate product, not yet live.

This file is the site map for Claude. Agent operating rules live in `AGENTS.project.md` (this workspace) / `AGENTS.md` on GitHub.

---

## What it is

Public Medicare agency site for **INSUREitALL LLC**. Phone-first. Licensed agents, no scripts, no pressure. Compensation from carriers, never from the consumer.

| | |
|---|---|
| Legal | INSUREitALL LLC · NPN **20114179** |
| Phone | **+1 813-742-6798** · TTY 711 · recorded |
| Hours | Mon–Fri 9am–6pm ET |
| HQ | 3550 Buschwood Park Dr, Ste 180, Tampa, FL 33618 |
| Email | info@team-iia.com |
| License | 41 states — list in `src/lib/compliance.ts` |

Live marketing domains historically: insureitallins.com / insureitall-llc.com.

---

## Stack (this preview)

- React 19 · **TanStack Start** · Vite · Tailwind **v4** (`@theme` in `src/styles.css`)
- Auth: existing Grok/Better-auth wiring (`src/lib/auth/`)
- Fonts: **Fraunces** (display) + **Inter** (body)
- Icons: lucide-react
- Motion: CSS only (hover raise, ident, widget pop, clay bob). Ident auto-plays on `/` once per session (`iia-ident-v11`) with Skip intro + optional Play sound. Escape skips. `prefers-reduced-motion` short-circuits.

### Dual trees (do not mix blindly)

| Tree | Role |
|---|---|
| Repo **root** (`src/`, `public/`) | Current elite site. This preview. PR #49. |
| `artifacts/insureitall-website/` | Older **Next.js App Router** copy. Some Vercel projects still pointed `rootDirectory` here. Do not assume it matches the preview. |

---

## Brand

Locked. Do not invent a second palette or a new BRIDGEt face.

| Token | Value | Use |
|---|---|---|
| Navy | `#0A1D3D` | Heroes, header strip, footer, launcher |
| Navy deep | `#07142B` | Ident stage, vignette |
| Blue | `#0072CE` | Primary CTA, links |
| Gold | `#C9A227` | BRIDGEt smile, ident rules, widget ring, Welcome home hairline |
| Mist / cream | `#D6EBF8` / `#F7F4EE` | Reverse type, ident fill |
| Surface | `#F7F9FC` | Page ground |

Official lockups: `public/brand/insureitall-*.svg` (primary / wordmark / monogram). Component: `src/components/logo.tsx`.

**3D language:** layered navy-tinted shadows (`src/styles/shadows.css`), hover raise `translateY(-6px)`, not blobs, not purple, not emoji illustrations.

**Removed on purpose:** door page-transition, paper die-cut / cutout-behind-page. Do not bring them back.

---

## BRIDGEt (locked)

Medicare **advocate**, not a licensed agent, not a plan, not affiliated with CMS/Medicare. We may use information consumers share (never SSN or Medicare numbers) to train BRIDGEt or improve the site. She never enrolls. She walks people to a licensed agent.

**Voice:** older sister you trust. Laid-back, wise, humor then on-task.

| Asset | Path | Role |
|---|---|---|
| Standing statue (locked) | `public/brand/bridget/avatar-clean.png` | Hero / orbit center |
| Bust (circle crop) | `public/brand/bridget/avatar-bust.png` | Widget launcher |
| Wordmark | `BridgetWordmark` | `BRIDGE` + italic blue `t` + gold smile |
| Mark | `BridgetMark` | `B` + gold smile |
| Flat icon | `public/brand/bridget/icon-flat.svg` | App / true icon (forward-facing, not 3/4 clay) |
| Clay frustrations | `public/brand/bridget/clay/*.jpg` | Orbit objects |

### Clay orbit (`/bridget`)

Six polymer-clay objects around her. Tap for her take. Hover/focus raise.

| Slot | File | Frustration |
|---|---|---|
| `parts` | `parts.jpg` | Alphabet soup (A/B/C/D) |
| `mail` | `mail.jpg` | Plan junk mail vs. ANOC |
| `windows` | `windows.jpg` | Enrollment windows |
| `gap` | `gap.jpg` | Coverage gap / “doughnut hole” |
| `drugs` | `drugs.jpg` | Formulary / will my drugs be covered |
| `doctor` | `doctor.jpg` | Can I keep my doctor |

### Ident splash

`BrandSplash` + `IdentMark`. Lockup layers in `public/brand/ident/*.svg`. Gold ring → stamp monogram → wipe wordmark → “it” pop → rules → tagline. ~4.4s hold, 0.7s fade. Session key: `iia-ident-v11`. Auto-plays on `/` only. Skip intro + Escape. Sound is opt-in (`Play sound`). Rest of the page is `inert` until it closes.

### Copilot widget

`BridgetCopilot`. Gold-bezel bust, `BRIDGEt` nameplate, “Need a hand?” chip when closed. After ident, **first launch pops open ~5.6s then self-closes** unless the visitor touches it. Session key: `iia-widget-greeted`. Page-aware greetings. CTAs: Talk with me → `/bridget`, Call, call-back → `/lead`.

### Call audio

`CallLink` + `playPickup()`. `/audio/ring-pickup.mp3` plays only on **user click**. Never autoplay.

---

## Pages (current)

| Route | Purpose |
|---|---|
| `/` | Navy hero, phone card, plan types, FAQ, **Welcome home.** portal band, BRIDGEt teaser |
| `/needs-analysis` | Guided needs flow → licensed agent |
| `/screener` | Redirects home. **beneFIT held** — not on this site, next billing phase. |
| `/compare` | Plan **types**, not every plan in a zip. TPMO limits apply |
| `/bridget` | Advocate + clay orbit + 3-question warm-up |
| `/medicare-basics` | Original / Advantage / Supplement / Part D, jargon down |
| `/contact` | Phone, email, HQ |
| `/lead` | Call-back request + TCPA consent |
| `/privacy` | Privacy policy |
| `/hipaa` | **HIPAA & PHI** — public control map (not a certificate) |
| `/glba` | **GLBA Privacy Notice** — NAIC 672 sharing table |
| `/security` | **NAIC 673** written ISP + BAA policy |
| `/terms` | Terms of use |
| `/ai-disclosure` | How BRIDGEt / AI is used — not an agent, no PHI |
| `/accessibility` | Accessibility statement |
| `/portal` | **beneficiaryCONNECT** client portal — "coming soon" placeholder. Not live. |
| `/ab` `/ab/privacy` `/ab/terms` | Legacy Wyoming single-member LLC entity/privacy/terms pages for the retired fileBRIDGE product. Unlinked from nav; kept for historical/legal reference. |
| `/console` | Redirects to BRIDGEt Console (`VITE_BRIDGET_CONSOLE_URL`) when configured; otherwise an in-app "the console moved" page. No staff data lives in this repo anymore. |
| `/team` | Redirects to `/console` |
| `/login` | Redirects to `/portal` |

Nav (header): Needs Analysis, Plan Choice Audit, BRIDGEt, Medicare Basics, Contact. Phone CTA always present.

Home kicker under the consumer-portal paragraph: italic Fraunces **Welcome home.** (class `.welcome-home`).

---

## Compliance (non-negotiable)

Source of TPMO counts: Ryan Butterfield, acting CCO, 2026-08-20. **Static count retired 2026-09-05** — a compliance audit (`docs/audits/AUD-20260903-insureitall-llc.com.md`) found the "14 organizations / 14 products" string was a spliced, unprovable non-standard variant. `TPMO_DISCLAIMER` now serves a generic no-numbers interim sentence pending Ryan's sign-off on `docs/cco-confirmation.md` and real per-county appointment data. See `docs/decisions/ADR-0013-tpmo-disclaimer-stopgap.md`. The numeric resolver (ZIP → county → CMS-standardized text, hash-chained evidence, fail-closed) is staged and tested at `tools/bridge-disclosure/` (`python3 tools/bridge-disclosure/test_resolver.py`) but **not wired into the live site** — no real `agency_appointments` feed or ZIP-capture UI exists yet.

- `TPMO_DISCLAIMER` — generic no-numbers interim form, not every plan, send leftovers to Medicare.gov / 1-800-MEDICARE (SHIP dropped — CMS removed it from the standardized text at 91 FR 17583, eff. CY2027 marketing 10/1/2026)
- `NON_AFFILIATION` — not connected with or endorsed by the U.S. Government or federal Medicare program
- BRIDGEt is **not** a licensed insurance agent
- Calls recorded for quality / training / compliance
- Lead form: express written consent (`LEAD_CONSENT`) — not a condition of purchase
- No PHI in BRIDGEt chat, clay copy, or analytics jokes

Copy lives in `src/lib/compliance.ts`. Footer always renders TPMO via `TpmoDisclaimer`.

---

## Portal split

- `/portal` — public, no auth. Static "beneficiaryCONNECT — client portal coming soon" page. The old fileBRIDGE consumer app (file/agency/share/help, sign-in gate) has been removed.
- `/console` — no longer a staff desk in this repo. Redirects to **BRIDGEt Console** (separate multi-tenant product, own repo/DB, auth scoped per tenant). `/team` redirects here too.
- Staff can still open legacy share codes at `/console/leads`'s old backend — `src/lib/portal.ts` (`TeamShareLookup` component still exists in `src/components/portal-share.tsx` but currently has no route rendering it since `/console/leads` was removed; it is untouched and could be re-mounted somewhere if that lookup is still needed) — `staffMiddleware`/`isStaffEmail` (`src/lib/staff.ts`, `src/lib/staff-middleware.ts`) stay for that and for the header's staff-only "Console" link.
- Migrations `0002_portal.sql`, `0003_portal_shares.sql`, `0004_ops_requests.sql`, `0005_ops_lead_status.sql` remain (untouched) for the staff-side share-code lookup above and for `ops_requests`/`lead_events`, which this repo still writes to on every public lead submission (`src/lib/ops.ts` → `submitOpsRequest`) — kept as the local system of record for email/webhook alerts. Every new lead is ALSO forwarded to BRIDGEt Console (`src/lib/bridget-console.ts` → `forwardLeadToBridget`, best-effort, needs `VITE_BRIDGET_CONSOLE_URL` + server-only `BRIDGET_INGEST_API_KEY` set) so it shows up in the tenant-scoped staff desk there. No new UI reads these tables in this repo — that's BRIDGEt's job now.

---

## File map (elite layer)

```
src/lib/plan-audit.ts               Plan Choice Audit compute (cms-app 2026 figures)
src/lib/medicare-2026.ts             CMS dollar anchors
src/components/plan-type-table.tsx   Advantage / Supplement / Part D type table
src/lib/hipaa.ts                    HIPAA control map (public proof)
src/lib/glba.ts                     GLBA / NAIC 672 privacy notice copy
src/lib/isp.ts                      NAIC 673 information-security program + BAA policy
scripts/lead-alert.mjs              team webhook/email on new lead (no PHI in the alert)
scripts/env-validate.mjs            Vercel env format + Resend cluster checks
npm run env:check                   validate env (no secret values logged)
emails/                             paste-ready Resend dashboard templates
scripts/commercial-guard.mjs        lead validation + rate limit + MBI/SSN reject
src/lib/bridget-console.ts          BRIDGEt Console URL + best-effort lead forwarding (POST /api/ingest/leads)
public/robots.txt
public/sitemap.xml
src/lib/debt.ledger.json            named debt items (scanner source of truth)
src/lib/debt.p0.json                P0 restore playbooks (numbered steps)
scripts/debt-scan.mjs               automated gates (`npm run debt`)
scripts/production-drift-guard.mjs  detects prod deployed behind main (ADR-0014); scheduled in
                                     .github/workflows/production-drift-guard.yml, needs VERCEL_TOKEN secret
src/components/brand-splash.tsx      first-load ident
src/components/ident-mark.tsx        SVG ident runner
src/components/bridget-orbit.tsx     clay frustrations
src/components/bridget-copilot.tsx   site widget
src/components/bridget-wordmark.tsx  BRIDGE + t + smile
src/components/call-link.tsx         tel: + pickup ring
src/routes/portal.tsx                beneficiaryCONNECT "coming soon" placeholder
src/lib/auth/tanstack-cookies.ts     static-import replacement for better-auth's
                                     tanstackStartCookies (upstream's dynamic import
                                     breaks the prod SSR bundle — 500 on every route)
src/lib/ring.ts                      pickup audio
docs/neon-nerd.md                  Neon catalog + Wyoming LLC tax schedule (0009)
migrations/0009_wy_llc_license_tax.sql
src/lib/wy-llc-tax.ts              W.S. 17-29-209 floor $60 / rate 0.0002
src/styles.css                       tokens, ident, clay, widget, welcome-home
src/styles/shadows.css               3D elevation snippets
public/brand/insureitall-ident.svg
public/brand/bridget/
public/audio/ring-pickup.mp3
```

---

## Do not

- Enroll from BRIDGEt, quote a specific plan as “the one,” or imply she is an agent
- Autoplay audio
- Restore door transitions or die-cut layout
- Recolor the lockup or replace the locked standing avatar
- Collect SSN / Medicare number in the widget
- Treat `artifacts/insureitall-website` as the source of truth for this preview
- Expand the staff portal in this visual PR
- Rebuild a staff console UI in this repo — that product now lives in BRIDGEt Console (separate repo, multi-tenant, its own DB). `/console` here is a redirect only.
