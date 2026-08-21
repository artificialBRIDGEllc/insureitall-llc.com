# INSUREitALL website — current state

Last aligned: 21 Aug 2026. Preview app is the **TanStack Start** tree at repo root. GitHub: [copperlang2007/insureitall-website](https://github.com/copperlang2007/insureitall-website). Open visual PR: [#49](https://github.com/copperlang2007/insureitall-website/pull/49) (`elite-bridget-ident`). A dedicated **portals** PR is next — do not rebuild `/portal` or `/team` in this visual track unless asked.

This file is the site map for Claude. Agent operating rules live in `AGENTS.project.md` (this workspace) / `AGENTS.md` on GitHub.

---

## What it is

Public Medicare agency site for **INSUREitALL LLC**. Phone-first. Licensed agents, no scripts, no pressure. Compensation from carriers, never from the consumer.

| | |
|---|---|
| Legal | INSUREitALL LLC · NPN **20114179** |
| Phone | **+1 888-459-4842** · TTY 711 · recorded |
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
- Motion: CSS only (hover raise, ident, widget pop, clay bob). Respect `prefers-reduced-motion`.

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

Medicare **advocate**, not a licensed agent, not a plan, not affiliated with CMS/Medicare. Facade LLM — training has not shipped. No PHI in the widget. She never enrolls. She walks people to a licensed agent.

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

`BrandSplash` + `IdentMark`. Official lockup SVG `public/brand/insureitall-ident.svg`. Beats: swoosh wipe → IIA rise → wordmark → “it” land → gold rules extend → tagline. ~2.5s at the site tempo, then fade. Session key: `iia-ident-seen`. Luxury navy/gold wash, grain, vignette. **Silent** — do not autoplay ring audio.

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
| `/screener` | Anonymous benefits screener (no name, no phone) |
| `/compare` | Plan **types**, not every plan in a zip. TPMO limits apply |
| `/bridget` | Advocate + clay orbit + 3-question warm-up |
| `/medicare-basics` | Original / Advantage / Supplement / Part D, jargon down |
| `/contact` | Phone, email, HQ |
| `/lead` | Call-back request + TCPA consent |
| `/privacy` | Privacy policy |
| `/portal` | **Consumer** coverage file (no cost). Not for agents/agencies |
| `/team` | **INSUREitALL staff only** (email domain allow-list) |
| `/login` | Auth entry |

Nav (header): Needs Analysis, Benefits Screener, Plan Compare, BRIDGEt, Medicare Basics, Contact. Phone CTA always present.

Home kicker under the consumer-portal paragraph: italic Fraunces **Welcome home.** (class `.welcome-home`).

---

## Compliance (non-negotiable)

Source of TPMO counts: Ryan Butterfield, acting CCO, 2026-08-20. Static until he confirms zip-level product counts.

- `TPMO_DISCLAIMER` — 14 organizations / 14 products, not every plan, send leftovers to Medicare.gov / 1-800-MEDICARE / SHIP
- `NON_AFFILIATION` — not connected with or endorsed by the U.S. Government or federal Medicare program
- BRIDGEt is **not** a licensed insurance agent
- Calls recorded for quality / training / compliance
- Lead form: express written consent (`LEAD_CONSENT`) — not a condition of purchase
- No PHI in BRIDGEt chat, clay copy, or analytics jokes

Copy lives in `src/lib/compliance.ts`. Footer always renders TPMO via `TpmoDisclaimer`.

---

## Portal split (as built vs. next PR)

**Now (included so `/portal` does not 404):**

- `/portal` — consumer file (zip, doctors, medications, budget, notes). Account required.
- `/team` — staff ops inbox. `isStaffUser` via `team-iia.com`, `insureitallins.com`, `insureitall-llc.com`, `insureitall.com`.
- Migrations `0002_portal.sql`, `0003_portal_shares.sql`, `0004_ops_requests.sql`.

**Next (separate PR, do not start unless asked):** real consumer vs. ops portal productization — auth hardening, sharing, inbound request workflow, no agency/agent tenancy.

---

## File map (elite layer)

```
src/components/brand-splash.tsx      first-load ident
src/components/ident-mark.tsx        SVG ident runner
src/components/bridget-orbit.tsx     clay frustrations
src/components/bridget-copilot.tsx   site widget
src/components/bridget-wordmark.tsx  BRIDGE + t + smile
src/components/call-link.tsx         tel: + pickup ring
src/components/site-shell.tsx        header, splash, footer, widget
src/lib/ring.ts                      pickup audio
src/lib/compliance.ts                TPMO / consent / states
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
