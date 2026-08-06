# Codebase audit — 2026-08-06

Review of `territory-maps-v3` for bugs and AdonisJS 7 idioms (vs Remix/v1 leftovers).

## Fixed in this pass

### Critical
- **Public share-link token leak** — `Congregation.securityToken` is now `serializeAs: null`. Public map controller also ships an explicit DTO with only `{ name }` for congregation.
- **Ace password double-hash** — `congregation:create` / `congregation:reset-password` now assign a plain password; `withAuthFinder` hashes on save.
- **Working note map links** — service returns DTOs including `formattedContent` instead of relying on Lucid `serialize()` (which dropped the field).

### High
- PDF jobs cleaned up after generation (`completeJob` in `finally`)
- PDF template route returns proper 401/404 with timing-safe secret compare
- Healthcheck returns **503** when DB or Gotenberg is unhealthy
- `/go` with missing params redirects to **login**, not dashboard
- Map `typeId` and street category IDs validated as belonging to the congregation
- Servant messages rendered as text (no `dangerouslySetInnerHTML`)

## Still open (prioritized)

| Pri | Item | Notes |
|-----|------|--------|
| P1 | Unique index `(congregationNumber, code)` on Map | App-level unique only today |
| P1 | Escape/sanitize working-note HTML | Map-link HTML is intentional; still XSS if content has other tags |
| P1 | Login rate limiting | No `@adonisjs/limiter` on `POST /login` |
| P2 | Lucid transformers for Map/Activity/WorkingNote | Prefer over ad-hoc `serialize()`; transformers already enabled in `adonisrc` |
| P2 | Extract `SettingsService`; slim Documents S-13 builder into `DocumentService` | Controllers still talk to Lucid directly in places |
| P2 | Bouncer policies for map ownership / public token | Replace scattered `where('congregationNumber')` |
| P2 | Vine `unique` / `exists` rules | Move more domain checks into validators |
| P2 | PDF job store | In-memory queue is single-process only — document or move to Redis/DB before multi-instance deploy |
| P2 | Search / working-note N+1 | Prefer SQL `whereILike` and batch map-by-code |
| P2 | Load-all maps+activities then JS filter | List, search, next-maps, S-13 — filter in SQL |
| P2 | `db.transaction` on multi-step writes | Bring-back, street+categories, map upload |
| P3 | Settings delete flashes | Bare 400+redirect when type/category still in use |
| P3 | Login error mapping | Prefer auth exception over fake Vine validation error |
| P3 | Share links from `APP_URL` | `getShareableLinkToMap` uses `request.host()` |
| P3 | Remember-me | Disabled; implement Adonis tokens if product wants it |

## Already in good shape

- Congregation session auth, guest/auth middleware, Shield CSRF, env validation
- Auth-group services consistently scope by `congregationNumber`
- Thin `@inject` controllers for core map domain
- Dump bootstrap + evolve migration strategy
- Inertia share + `CongregationTransformer` for `user`
- Manual `pages.d.ts` registry (needed because `.layout` breaks ExtractProps)

## Adonis practice north star

Prefer: **validators (Vine) → thin controllers → services → Lucid models/transformers → Inertia DTOs**. Avoid Remix-style “serialize the whole model graph” and pre-hashing passwords outside `withAuthFinder`.

## Update — pre-prod audit (2026-08-06)

Superseding detail and ship checklist: [`2026-08-06-preprod-audit.md`](./2026-08-06-preprod-audit.md). Auth verdict: solid baseline; remember-me does not work; no authenticated cross-cong IDOR. Migration: ~95%+ v1 parity.
