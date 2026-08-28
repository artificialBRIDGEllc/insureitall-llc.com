# INSUREitALL website

SOW No. 1 — **$5,000** website update for INSUREitALL LLC (NPN 20114179).  
Repo: [artificialBRIDGEllc/insureitall-llc.com](https://github.com/artificialBRIDGEllc/insureitall-llc.com).

Client owns the supplied **logos**. BRIDGEt, Plan Choice Audit, fileBRIDGE, and the staff console stay with **artificialBRIDGE LLC** (design-partner license through **24 August 2027**). **beneFIT** is not on this site.

## What shipped

Phone-first public site: home, needs analysis, Medicare Basics, Plan Choice Audit, BRIDGEt, contact, lead + TCPA, TPMO / non-affiliation, ident, legal pages.

fileBRIDGE (`/portal`) is a third-party app. IIA chrome sends people through `/leaving` first.

## Vercel

- **Root Directory:** repo root (not `artifacts/`). Framework: Vite / this app’s build.
- **Build:** `npm run build` (runs migrations when `DATABASE_URL` is set).
- **Env:** see `.env.example`. `npm run env:check` validates formats and never prints secrets.
- Production host: `insureitall-llc.com`. Optional later: `filebridge.theartificialbridge.com` → `/portal`.

Leads persist and email only with `DATABASE_URL` + Resend. Without them the site still markets and takes in-memory/PGLite data in preview.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run env:check
```

## Paper

| Doc | Path |
|---|---|
| SOW | `docs/contracts/03-sow-website-update.md` |
| ICA | `docs/contracts/02-independent-contractor-agreement.md` |
| License | `docs/contracts/04-design-partner-license.md` |
| BAA exhibit | `docs/contracts/08-baa-exhibit.md` |
| Invoice | `docs/invoice-IIA-2026-0825.html` |
| Acceptance | `docs/sow-acceptance.md` |

INSUREitALL LLC · +1 908-827-6223 · 41 states.
