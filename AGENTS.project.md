# INSUREitALL website — agent brief

Operate on the **current elite site** (TanStack Start at repo root). Full map: `CLAUDE.md`. This file is the working contract.

GitHub: `artificialBRIDGEllc/insureitall-llc.com`. Preview is the TanStack tree at repo root. Staff admin now lives in **BRIDGEt Console**, a separate multi-tenant product/repo (`copperlang2007/BRIDGEt`) — `/console` here just redirects to it. `/portal` is now a beneficiaryCONNECT "client portal coming soon" placeholder (fileBRIDGE consumer app removed).

---

## Mission

Phone-first Medicare agency site. Licensed agents. No pressure. No scripts. BRIDGEt is the advocate on the way to a human — never the closer.

Success = the live preview looks like a luxury navy/cream Medicare house, CTAs dial `+1 813-742-6798`, TPMO copy is present, BRIDGEt stays on-voice.

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
- Ident: auto-plays on `/` only. Skip intro + Escape. Sound is a button, never autoplay. Ring MP3 on `CallLink` stays click-only.
- Widget: gold ring + nameplate + optional “Need a hand?” — must stay findable on mobile

**Rolled back, do not restore:** door page-transition, paper die-cut / Bridget-behind-the-page.

---

## BRIDGEt rules

- Locked standing figure: `public/brand/bridget/avatar-clean.png` (`BRIDGET_AVATAR.figure`)
- Widget bust: `public/brand/bridget/avatar-bust.png` (`BRIDGET_AVATAR.bust`)
- Wordmark: `BridgetWordmark` (BRIDGE + italic `t` + gold smile). Do not redraw.
- Voice: older sister — humor, then the next right step. Never cute, never salesy.
- She is **not** a licensed agent and **not** Medicare. Say so wherever she appears.
- Clay orbit objects are the six Medicare frustrations (parts, mail, windows, gap, drugs, doctor). Keep captions accurate; no scare tactics.
- Widget auto-opens **once per session** after the ident (`iia-widget-greeted`), then closes unless touched. Do not nag every pageview.
- Ident plays once per session (`iia-ident-v11`) on `/` only. Auto visual, Skip intro, optional Play sound. CallLink still uses the short pickup MP3 on click only.

---

## Compliance

Use `src/lib/compliance.ts`. Do not paraphrase TPMO into something softer.

Must remain true:

1. We do not offer every plan in the area (14 orgs / 14 products until CCO updates).
2. Not connected with or endorsed by the U.S. Government or federal Medicare program.
3. Calls recorded. Lead TCPA consent is opt-in, not a purchase condition.
4. Compare page = plan **types**, not “every plan in your zip.”
6. Public forms require TCPA consent on the server, reject honeypots, and rate-limit by IP. Do not thank the visitor if the save failed.
7. Error and 404 pages stay on-brand and phone-first. Do not leak stack traces.

---

## Pages you may touch

`/`, `/bridget`, `/compare` (Plan Choice Audit — type ledger, not every plan), `/contact`, `/lead`, `/medicare-basics` (includes plan-type table), `/needs-analysis`, `/privacy`, `/hipaa`, `/glba`, `/security`, `/terms`, `/ai-disclosure`, `/accessibility`, `/portal` (beneficiaryCONNECT — "coming soon" placeholder, no auth gate), `/console` (redirects to BRIDGEt Console, a separate repo — no staff UI here), plus chrome (`site-shell`, header, footer, widget, ident). **`/screener` (beneFIT) is held — not licensed this phase; old URL redirects home.**

`/portal` (beneficiaryCONNECT coming-soon placeholder) and `/console` (redirects to BRIDGEt Console). `/team` redirects to `/console`.

Staff emails: `team-iia.com`, `insureitallins.com`, `insureitall-llc.com`, `insureitall.com` (`src/lib/staff.ts`).

## Phase R (mandatory)

Regulatory disclaimers are a **strict operating phase**. Full contract: `docs/contracts/11-phase-r-regulatory-disclaimers.md`.

- Source lock: `src/lib/compliance.ts` — TPMO, counts, non-affiliation, states, TCPA. **Do not paraphrase.**
- Render TPMO with `<TpmoDisclaimer />`. Footer on every marketing page.
- TCPA enforced **server-side**. No SSN/MBI fields.
- Counts change only from a signed `docs/cco-confirmation.md`. Static 14/14 until Ryan marks zip-level Yes.
- **Audit first** if a site is already live: `docs/contracts/11a-site-compliance-audit.md`. File `docs/audits/AUD-YYYYMMDD-<host>.md`. Do not change TPMO/TCPA until the log exists.

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
