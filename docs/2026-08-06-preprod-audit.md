# Pre-prod audit — 2026-08-06

Full review of `territory-maps-v3` before production: migration parity vs v1/v2, auth/security, query patterns, and Adonis best practices.

**Verdict:** Ship after fixing the items in the checklist below. Feature migration is essentially complete (~95%+ day-to-day parity with v1; ahead of v2). Session auth baseline is solid. Remember-me does **not** work (same effective outcome as v1).

---

## Auth & remember-me

### What works

- Congregation session guard (`web`) + Lucid `withAuthFinder` (bcrypt)
- Guest middleware on login; auth middleware on admin group
- Session regenerate on login; logout clears session
- Cookie flags: `httpOnly`, `secure` in production, `sameSite: 'lax'`
- Shield CSRF enabled (XSRF cookie); HSTS; X-Frame DENY; nosniff
- Authenticated queries consistently scoped by `congregationNumber` — **no cross-congregation IDOR found**
- Password & `securityToken` use `serializeAs: null`; Inertia shares only `{ number, name }`

### Remember-me — does not work

| Check | Status |
|-------|--------|
| `useRememberMeTokens` | `false` in `config/auth.ts` |
| Remember-me tokens table / provider | Absent |
| Login UI checkbox | Absent |
| `auth.login(user, remember?)` | One-arg only |
| Session age | `2h` (`config/session.ts`) |

**v1 parity:** v1 had a Remember-me switch, but `maxAge` in session commit was commented out — also effectively a no-op.

To implement properly later: enable `useRememberMeTokens`, add `remember_me_tokens` migration + `DbRememberMeTokensProvider` on `Congregation`, then `login(user, !!request.input('remember_me'))`. Do not “fake” it by only lengthening session age without tokens.

---

## Migration completeness

### Complete (parity with v1+)

Auth, dashboard (notes, overdue, messages), maps CRUD, activities (+ bring-back SMS UX), streets, DNCs, search, settings, public `/go` + `/view`, S-12, S-13, healthcheck, congregation Ace commands.

### Improved / new in v3

| Feature | Notes |
|---------|--------|
| Rurals | Full geo / w3w / checkoff / CSV ingest (v1 stub only) |
| DNC worksheet PDF | New |
| Records management | v1 “coming soon” → implemented |
| Next maps to hand out | v1 stub → implemented |
| What’s New | Global 30-day dashboard announcements |
| PDF | In-app Edge + Gotenberg (no PDF microservice) |
| Images | DigitalOcean Spaces |

### Intentionally omitted

- `/join` signup (dead in v1)
- `/addresses` empty stub
- Nested Remix manage URLs → slide-over panels
- Separate `SecurityToken` table → column on Congregation

### Optional / ops (not blockers)

- New-user Welcome banner (v1 had it; What’s New is a different feature)
- End-to-end QA against restored dump data

---

## Remaining work (sorted)

### Done (before prod) — 2026-08-06

1. **Working-note XSS** — content escaped; only safe `<a>` injected for `{map CODE}`; map lookups batched
2. **Login rate limit** — `@adonisjs/limiter` multi-limiter (IP + IP/cong) with `penalize` on failed login; `LIMITER_STORE=memory|database`
3. **Unique map code** — migration `UNIQUE (congregationNumber, code)` (+ duplicate cleanup); create/update map unique violations → validation error
4. **Transactions** — bring-back clears streets/rurals in one txn; street create/update+categories in txn; map upload compensated on DB failure

### Still open

Ordered by impact: correctness, then consistency/perf.

### 5. `getServiceYear` fragile — correctness

**Where:** `document_service.ts`  
**Issue:** Same Aug31/Sept1 endpoints as v1. Exclusive date filters mostly compensate for S-13; DNC worksheet `lastCalled < start` can miss the Aug 31 boundary day.  
**Fix:** Explicit Sept 1 → Aug 31 window + inclusive comparisons.

### 6. Street public toggle token guard — consistency

**Where:** `streets_controller.ts` vs `rurals_controller.ts`  
**Issue:** Rural/message paths reject missing/invalid `t`; street passes `request.qs().t` through.  
**Fix:** Same string/presence guard as rurals.

### 7. Share links from `request.host()` — hardening

**Status:** Done — `getShareableLinkToMap` builds from `APP_URL` (Coolify-safe).

### 8. Working-note N+1 — performance

**Status:** Done with XSS fix (batch `whereIn` by code).

### 9. Settings emptiness checks — performance

**Where:** `settings_controller.ts`  
**Issue:** Full `preload('maps'|'streets')` only to check empty.  
**Fix:** `withCount` / `whereDoesntHave`.

### 10. CSP off — hardening (after #1)

**Where:** `config/shield.ts`  
**Issue:** No CSP; amplifies XSS impact.  
**Fix:** Enable once working notes are escaped.

---

## Pre-prod checklist

### Fix before prod

1. [x] Escape working-note HTML; safe map-link rewrite only
2. [x] `@adonisjs/limiter` on `POST /login`
3. [x] Migration: `UNIQUE (congregationNumber, code)`
4. [x] `db.transaction` on bring-back + street create (+ map upload where practical)

### Fix soon (correctness / consistency)

5. [ ] Harden `getServiceYear` (Sept 1 → Aug 31, inclusive)
6. [ ] Align street public toggle token validation with rurals
7. [x] Build share links from `APP_URL`

### Nice to have

8. [x] Batch working-note map lookups
9. [ ] Settings `withCount` / `whereDoesntHave`
10. [ ] Enable CSP after XSS fix

---

## Verification notes (2026-08-06)

Smoke-tested against running server:

| Check | Result |
|-------|--------|
| `npm run typecheck` (server) | Pass |
| `/healthcheck` | `{"status":"ok","db":"ok","gotenberg":"ok"}` |
| `/login` | 200 |
| `/` (unauth) | 302 → `/login` |
| `/go` (no params) | 302 → `/login` |
| `/view/map/…` (bad token) | 200 (map null) |

Fixed while verifying:

- Unused `endpoint` in `pdf_gen_service.checkHealth` (TS6133)
- `DncWorksheet` called with unused `currentServiceYear` prop
- `DatePicker` Headless UI `transition` boolean vs framer-motion conflict
- `maps/show` `onSuccess` page param implicit `any`
- `typecheck` script: server-only (`tsc --noEmit`). `typecheck:inertia` pulls Tuyau `schema.d.ts` → all controllers without route types and reports false `inertia.render(…, never)` errors — known tooling limitation

---

## Best-practice north star (unchanged)

**Vine validators → thin `@inject` controllers → services → Lucid models/transformers → Inertia DTOs.**

Avoid: Remix-style full-graph serialize; pre-hashing passwords outside `withAuthFinder`; host-derived absolute URLs for user-facing links.

---

## Related docs

- Earlier pass: [`2026-08-06-codebase-audit.md`](./2026-08-06-codebase-audit.md)
- Migration status: [`2026-08-06-migration-from-v1-v2.md`](./2026-08-06-migration-from-v1-v2.md)
- Architecture / auth overview: [`architecture.md`](./architecture.md)
