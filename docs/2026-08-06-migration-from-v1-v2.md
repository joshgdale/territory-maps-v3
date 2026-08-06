# Migration from v1/v2 — 2026-08-06

## Intent

Rebuild Territory Maps as **Adonis 7 + Inertia React** in `territory-maps-v3`, using Lucid work from v2, a restored **v1 production dump**, and in-app PDF (no HTMX, no separate PDF service).

## Completed

### Database
- Batch A create migrations (dump-shaped) + Batch B evolve migrations
- `ace db:bootstrap-from-dump` run successfully against restored dump DB `territory-maps-v3`
- Evolves applied: security token on Congregation; Address consolidated into DoNotCall; Rural dropped
- Final tables: Congregation, Map, MapType, Activity, DoNotCall, Street, StreetCategory, pivot, WorkingNote

### Backend
- Congregation session auth (bcrypt), Drive/Spaces, Gotenberg/chromiumly in-app
- Services + controllers for dashboard, maps, activities, streets, DNCs, search, documents (S-12 + S-13), settings, public view, healthcheck
- Ace: `congregation:create`, `congregation:reset-password`, `db:bootstrap-from-dump`

### Frontend
- Inertia React pages with slide-over form panels (no nested manage URLs)
- Settings, Documents, public map view

### Agent docs
- `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, `docs/*`

## Notes
- `.env` DB name is **`territory-maps-v3`** (plural “maps”)
- Inertia page prop types live in `.adonisjs/server/pages.d.ts` (manual; auto indexPages disabled)
- PDF still needs a reachable Gotenberg at `GOTENBERG_URL` (basic auth optional)

## Still open / polish
- ~~Bring-back confirmation SMS UX after activity IN~~
- ~~“Next maps to hand out” dashboard card~~
- ~~Stronger typed page props (replace `any[]` in pages.d.ts)~~
- ~~Rurals (geo + What3Words + checkoff + CSV ingest) — see [`2026-08-06-rurals.md`](./2026-08-06-rurals.md)~~
- End-to-end QA against dump data
- Optional: restore v1 new-user Welcome banner (What’s New is a different feature)
- Pre-prod hardening from [`2026-08-06-preprod-audit.md`](./2026-08-06-preprod-audit.md) (working-note XSS, login limiter, unique map code, transactions, service-year dates)

## Update — pre-prod migration check (2026-08-06)

Feature migration from v1 → v3 is **essentially complete** for production workflows (~95%+). v3 is ahead of v2 and adds Rurals, DNC worksheet, records management, next-maps, and What’s New. Dead v1 stubs (`/join`, `/addresses`) correctly omitted. Remaining work is QA + audit hardening, not missing modules.
