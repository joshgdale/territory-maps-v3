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
| P2 | Harden `getServiceYear` | Explicit Sept 1 → Aug 31 + inclusive compares |
| P2 | Street public toggle token guard | Align with rurals validation |
| P3 | Settings `withCount` | Perf polish |
| P3 | Enable CSP | After XSS fix (XSS escape done) |

Done (2026-08-06): working-note XSS escape + batched map lookups, login limiter, unique map code index, bring-back/street transactions, Coolify `trustProxy`, share links from `APP_URL`.

Full checklist: [`2026-08-06-preprod-audit.md`](./2026-08-06-preprod-audit.md).

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
