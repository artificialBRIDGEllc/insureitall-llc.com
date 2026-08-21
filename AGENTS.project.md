# INSUREitALL website — agent brief

Operate on the **current elite site** (TanStack Start at repo root). Full map: `CLAUDE.md`. This file is the working contract.

GitHub: `copperlang2007/insureitall-website`. Visual work is on `elite-bridget-ident` ([PR #49](https://github.com/copperlang2007/insureitall-website/pull/49)). **Portals get their own PR** — do not start that rebuild unless the user asks.

---

## Mission

Phone-first Medicare agency site. Licensed agents. No pressure. No scripts. BRIDGEt is the advocate on the way to a human — never the closer.

Success = the live preview looks like a luxury navy/cream Medicare house, CTAs dial `+1 888-459-4842`, TPMO copy is present, BRIDGEt stays on-voice.

---

## Stack

React 19 · TanStack Start · Vite · Tailwind v4. Tokens only in `src/styles.css` `@theme`. No ad-hoc hex in JSX.

Dev: `npm run dev` (this sandbox already serves the preview). `npm run typecheck` before you call it done.

Two trees exist. **Edit root `src/` + `public/`.** The Next.js app under `artifacts/insureitall-website/` is the older Vercel copy — do not “fix” it instead of the preview.

---

## Visual system

- Navy `#0A1D3D`, blue `#0072CE`, gold `#C9A227`, mist/cream type on navy
- Fraunces display, Inter body
- 3D shadows from `src/styles/shadows.css`; hover raise `translateY(-6px)`
- Ident: luxury navy stage (grain, gold line, vignette) — not a black void, not a door
- Widget: gold ring + nameplate + optional “Need a hand?” — must stay findable on mobile

**Rolled back, do not restore:** door page-transition, paper die-cut / Bridget-behind-the-page.

---

## BRIDGEt rules

- Locked standing figure: `public/brand/bridget/avatar-clean.png`
- Widget bust: `public/brand/bridget/avatar-bust.png`
- Wordmark: `BridgetWordmark` (BRIDGE + italic `t` + gold smile). Do not redraw.
- Voice: older sister — humor, then the next right step. Never cute, never salesy.
- She is **not** a licensed agent and **not** Medicare. Say so wherever she appears.
- Clay orbit objects are the six Medicare frustrations (parts, mail, windows, gap, drugs, doctor). Keep captions accurate; no scare tactics.
- Widget auto-opens **once per session** after the ident (`iia-widget-greeted`), then closes unless touched. Do not nag every pageview.
- Ident is silent (`iia-ident-seen`). Ring MP3 only inside `CallLink` on click.

---

## Compliance

Use `src/lib/compliance.ts`. Do not paraphrase TPMO into something softer.

Must remain true:

1. We do not offer every plan in the area (14 orgs / 14 products until CCO updates).
2. Not connected with or endorsed by the U.S. Government or federal Medicare program.
3. Calls recorded. Lead TCPA consent is opt-in, not a purchase condition.
4. Compare page = plan **types**, not “every plan in your zip.”
5. No PHI in BRIDGEt, analytics, or clay copy (no Medicare numbers, no SSNs).

---

## Pages you may touch

`/`, `/bridget`, `/compare`, `/contact`, `/lead`, `/medicare-basics`, `/needs-analysis`, `/screener`, `/privacy`, plus chrome (`site-shell`, header, footer, widget, ident).

`/portal` (consumer file) and `/team` (staff) exist so the site does not 404. **Leave a deeper portal redesign for the next PR.**

Staff emails: `team-iia.com`, `insureitallins.com`, `insureitall-llc.com`, `insureitall.com` (`src/lib/staff.ts`).

---

## How to change things

1. Match existing components (`PageHero`, `CtaBand`, `CallLink`, `Button` variants). Do not add a second card language.
2. Prefer CSS classes in `src/styles.css` over long Tailwind arbitrary values.
3. Motion is CSS, interruptible where the user can hover/click. Keyframes only for one-shot ident / pop.
4. Keep `prefers-reduced-motion` exceptions when you add animation.
5. After UI work: load the preview, screenshot desktop + ~390px, no horizontal overflow, tap targets ≥ 44px.

---

## Do not

- Quote or enroll from the LLM
- Autoplay sound
- Invent carriers, plan names, or star ratings
- Swap the locked BRIDGEt statue or the official INSUREitALL SVG lockup
- Overwrite `AGENTS.md` in this sandbox (builder contract). Update **this file** and `CLAUDE.md` when the site state changes.
