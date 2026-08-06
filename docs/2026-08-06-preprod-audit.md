# Pre-prod audit — 2026-08-06

Full review of `territory-maps-v3` before production: migration parity vs v1/v2, auth/security, query patterns, and Adonis best practices.

**Verdict:** Ship after fixing the High items below. Feature migration is essentially complete (~95%+ day-to-day parity with v1; ahead of v2). Session auth baseline is solid. Remember-me does **not** work.

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


| Check                               | Status                      |
| ----------------------------------- | --------------------------- |
| `useRememberMeTokens`               | `false` in `config/auth.ts` |
| Remember-me tokens table / provider | Absent                      |
| Login UI checkbox                   | Absent                      |
| `auth.login(user, remember?)`       | One-arg only                |
| Session age                         | `2h` (`config/session.ts`)  |


**v1 parity:** v1 had a Remember-me switch, but `maxAge` in session commit was commented out — also effectively a no-op.

To implement properly later: enable `useRememberMeTokens`, add `remember_me_tokens` migration + `DbRememberMeTokensProvider` on `Congregation`, then `login(user, !!request.input('remember_me'))`. Do not “fake” it by only lengthening session age without tokens.

### Auth gaps (pre-prod)

1. **No login rate limiting** — add `@adonisjs/limiter` by IP + congregation number
2. **CSP disabled** — amplifies XSS impact (`config/shield.ts`)
3. Weak password policy on CLI create/reset (no min length)

---



## Migration completeness



### Complete (parity with v1+)

Auth, dashboard (notes, overdue, messages), maps CRUD, activities (+ bring-back SMS UX), streets, DNCs, search, settings, public `/go` + `/view`, S-12, S-13, healthcheck, congregation Ace commands.

### Improved / new in v3


| Feature               | Notes                                                 |
| --------------------- | ----------------------------------------------------- |
| Rurals                | Full geo / w3w / checkoff / CSV ingest (v1 stub only) |
| DNC worksheet PDF     | New                                                   |
| Records management    | v1 “coming soon” → implemented                        |
| Next maps to hand out | v1 stub → implemented                                 |
| What’s New            | Global 30-day dashboard announcements                 |
| PDF                   | In-app Edge + Gotenberg (no PDF microservice)         |
| Images                | DigitalOcean Spaces                                   |




### Intentionally omitted

- `/join` signup (dead in v1)
- `/addresses` empty stub
- Nested Remix manage URLs → slide-over panels
- Separate `SecurityToken` table → column on Congregation



### Optional product gap

- **New-user Welcome banner** (v1 showed when cong had no types/maps). v3 has What’s New instead — different purpose. Confirm whether first-run onboarding is still desired.



### Still open (ops)

- End-to-end QA against restored dump data

---



## Findings (prioritized)



### High — fix before / at prod cutover


| Item                  | Where                                            | Notes                                                                                                         |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Login rate limit      | `login_controller`, routes                       | Credential stuffing; cong numbers often guessable                                                             |
| Working-note XSS      | `working_note_service`, dashboard                | `dangerouslySetInnerHTML` without escaping content; escape HTML, inject only safe `<a>` for `{map CODE}`      |
| No unique map code    | Maps table                                       | App-level unique only; add `UNIQUE (congregationNumber, code)`                                                |
| No transactions       | Bring-back, street+categories, map upload        | Partial failure risk                                                                                          |




### Medium


| Item                               | Notes                                                                                                                                                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getServiceYear` fragile           | Same logic as v1 (Aug31/Sept1 endpoints). Exclusive `isAfter`/`isBefore` mostly compensates for S-13; DNC worksheet `lastCalled < start` can miss Aug 31 boundary day. Prefer explicit Sept 1 → Aug 31 + inclusive compares |
| Share links from `request.host()`  | Prefer `APP_URL` (PDF path already does)                                                                                                                                                                                    |
| CSP off                            | Enable when XSS is fixed                                                                                                                                                                                                    |
| Street public toggle token guard   | Weaker than rural/message paths — align validation                                                                                                                                                                          |
| Settings `preload` for emptiness   | Use `withCount` / `whereDoesntHave`                                                                                                                                                                                         |
| Working-note N+1                   | Batch map-by-code lookups                                                                                                                                                                                                   |
| Multiple concurrent OUT activities | Domain allows; UI assumes `activities[0]`                                                                                                                                                                                   |




### Low / polish

- Session 2h without remember-me → frequent re-login (product)
- bcrypt rounds 10 (acceptable)
- Healthcheck discloses dependency errors
- Settings delete-in-use: bare 400 redirect (no flash)
- Controllers still hit Lucid directly in places (Documents, Settings) — prefer services
- Lucid transformers over ad-hoc serialize (already noted in earlier audit)

---



## Query optimization targets

1. **Maps list / status filter** — latest activity via subquery or window; filter status in SQL
2. **Search** — `whereILike` / correlated publisher+notes; stop loading all maps
3. **Next maps** — SQL for available + `ORDER BY lastIn LIMIT n`
4. **S-13** — constrain activity preload to service-year date range
5. **Indexes** — `UNIQUE (congregationNumber, code)`; `(status, outDate)` on Activity; consider `(mapId, outDate DESC)`
6. **Non-compliant records index page** — aggregate counts in SQL when full rows not needed
7. **Atomic street/rural toggle** — `UPDATE … SET isComplete = NOT isComplete`

---



## Best-practice north star (unchanged)

**Vine validators → thin** `@inject` **controllers → services → Lucid models/transformers → Inertia DTOs.**

Avoid: Remix-style full-graph serialize; pre-hashing passwords outside `withAuthFinder`; host-derived absolute URLs for user-facing links.

---



## Pre-prod checklist



### Block / fix before prod

- [ ] `@adonisjs/limiter` on `POST /login`
- [ ] Escape working-note HTML; safe map-link rewrite only
- [ ] Migration: `UNIQUE (congregationNumber, code)`
- [ ] Document single-instance PDF queue (or Redis before multi-node)



### Soon after / scale

- [ ] SQL-filter maps list, search, next-maps, S-13
- [ ] Transactions on bring-back + street create
- [ ] Decide: private Spaces + signed URLs vs accept public URLs
- [ ] Share links from `APP_URL`; enable CSP
- [ ] Remember-me (Adonis tokens) if product wants stay-signed-in
- [ ] E2E QA against dump data
- [ ] Optional: restore new-user Welcome banner

---



## Related docs

- Earlier pass: `[2026-08-06-codebase-audit.md](./2026-08-06-codebase-audit.md)`
- Migration status: `[2026-08-06-migration-from-v1-v2.md](./2026-08-06-migration-from-v1-v2.md)`
- Architecture / auth overview: `[architecture.md](./architecture.md)`

