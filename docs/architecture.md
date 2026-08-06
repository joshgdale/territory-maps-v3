# Architecture — Territory Maps v3

## Stack

- **AdonisJS 7** — HTTP, Ace, validators (Vine), sessions, Shield
- **Lucid** — MySQL ORM (PascalCase tables from Prisma heritage)
- **Inertia + React 19** — UI (pages under `inertia/pages`)
- **Tailwind CSS v4** — `@tailwindcss/vite` (official Adonis guide)
- **Drive (S3)** — DigitalOcean Spaces for map images
- **Chromiumly → Gotenberg** — PDF generation in-process (no separate PDF microservice)

## Domain

Multi-tenant by **congregation number**. Login is congregation number + shared password (not per-publisher accounts).

Main entities: Map (image + code/name), Activity (IN/OUT), Street (+ categories), Rural (geo / What3Words), DoNotCall, WorkingNote, WhatsNew (global dashboard announcements), MapType, Settings templates / security token on Congregation.

## Auth

Session guard `web` with Lucid provider → `Congregation` model (`withAuthFinder` on `number` + bcrypt).

Public map access uses `Congregation.securityToken` query param `?t=`.

**Session:** age `2h`, `httpOnly` / `secure` (prod) / `sameSite: 'lax'`. CSRF via Shield. Remember-me is **not** enabled (`useRememberMeTokens: false`) — same effective behaviour as v1 (UI existed, session maxAge was disabled).

**Pre-prod notes:** login has no rate limiter yet; map images on Spaces are `visibility: 'public'`; PDF jobs are in-memory (single process). See [`2026-08-06-preprod-audit.md`](./2026-08-06-preprod-audit.md).

## UI patterns

- **Tailwind CSS v4** via the official Adonis integration (`@tailwindcss/vite`) — see [Install Tailwind CSS with AdonisJS](https://tailwindcss.com/docs/installation/framework-guides/adonisjs)
- Entry CSS: `inertia/css/app.css` (`@import "tailwindcss"` + `@source` for `inertia/` and Edge views)
- UI primitives under `inertia/components/ui/` (Button, Card, Table, Panel, etc.) matching the v1 slate-700 look
- Create/edit forms in **slide-over Panels** (Headless UI Dialog + framer-motion; client state, no nested manage URLs)
- Toasts via sonner (bottom-right)

## Related packages

See `AGENTS.md` for sibling repos and agent documentation rules.
