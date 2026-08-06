# AGENTS.md — Territory Maps v3

Instructions for AI agents (Cursor, Claude, and others) working in this repo.

## Read first

1. This file (`AGENTS.md`)
2. [`docs/architecture.md`](docs/architecture.md)
3. [`docs/database.md`](docs/database.md)
4. Recent dated notes under [`docs/`](docs/) (especially migration, Coolify, and [`docs/2026-08-06-preprod-audit.md`](docs/2026-08-06-preprod-audit.md))

## What this project is

Congregation-scoped territory management for Jehovah’s Witnesses congregations (UK). Not a GIS app — “maps” are uploaded raster images with activities (check-out/in), streets, rurals (geo/What3Words points), do-not-calls, share links, and S-12/S-13 PDF exports.

**Stack:** AdonisJS 7 + Lucid (MySQL) + Inertia + React + Tailwind. Auth user = **Congregation** (number + password), not a `User` table. Map images on DigitalOcean Spaces. PDFs via in-app Chromiumly → **Gotenberg sidecar** (no separate PDF microservice).

**Siblings (reference only):**

- `../territory-maps` — production Remix v1 + Prisma
- `../territory-maps-v2` — Adonis HTMX partial port
- `../territory-maps-pdf-service` — legacy Hono PDF app (obsolete for v3)

## Documentation rules (required)

- For **large migrations**, **schema changes**, or **architectural decisions**, create a dated file: `docs/YYYY-MM-DD-short-title.md`
- Keep [`docs/architecture.md`](docs/architecture.md) and [`docs/database.md`](docs/database.md) current when those areas change
- Prefer updating existing dated docs with a short “Update” section over silent drift
- Do not commit secrets (`.env`); document env **keys** in docs only
- If you add an Inertia page, also register its props in [`.adonisjs/server/pages.d.ts`](.adonisjs/server/pages.d.ts) (manual registry — auto `indexPages` is disabled)

## Database (critical)

Production v1 is still live. Local/dev v3 DB is typically a **restored v1 dump**.

1. Dump already restored → run `node ace db:bootstrap-from-dump` (one-time)
2. Then `node ace migration:run` (evolve migrations only)
3. Never point migrate/wipe at production without explicit human approval

See [`docs/database.md`](docs/database.md).

## UX conventions

- Form create/edit uses **slide-over panels** on the parent page (no nested manage URLs like Remix)
- Public map view stays simple (`/view/...`, `/go`)

## Ace commands of note

| Command | Purpose |
|---------|---------|
| `db:bootstrap-from-dump` | One-time: adonis_schema + mark create migrations applied |
| `congregation:create` | Create congregation + security token |
| `congregation:reset-password` | Reset congregation password |
| `rural:ingest` | One-time: ingest rurals from CSV |
| `whats-new:create` | Add a What’s New dashboard announcement (30 days) |
| `migration:run` | Apply pending evolve migrations |

## Do not

- Reintroduce a separate PDF microservice for v3
- Convert back to HTMX/Edge MPA for the main UI
- Drop or force-push production data
- Commit `.env` or credentials
