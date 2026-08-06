# Database — Territory Maps v3

## Source of truth

v1 production is still Remix + Prisma. Dev/staging for v3 uses a **restored dump** of that MySQL database.

What you see in the v3 DB before bootstrap is the **direct dump** — tables already exist. Create migrations must **not** be executed against it; they are only marked applied.

**Dev DB name:** `territory-maps-v3` (note the plural `maps`).

## One-time bootstrap

```bash
# Dump already restored into DB pointed at by .env (DB_*)
node ace db:bootstrap-from-dump
node ace migration:run
```

`db:bootstrap-from-dump`:

1. Verifies core Prisma tables exist
2. Creates `adonis_schema` / `adonis_schema_versions`
3. Marks Batch A **create** migrations as batch 1
4. Prints reminder to run `migration:run`

`migration:run` then applies Batch B **evolve** migrations:

- Move `SecurityToken` → `Congregation.securityToken`
- Consolidate `Address` → `DoNotCall` (handles pre-existing Prisma `DoNotCall` + drops `Rural`)
- Recreate `Rural` with geo fields + `isComplete` (see [`2026-08-06-rurals.md`](./2026-08-06-rurals.md))
- Create `WhatsNew` for dashboard feature announcements (see [`2026-08-06-whats-new.md`](./2026-08-06-whats-new.md))

## Final schema (after evolves)

| Table | Notes |
|-------|--------|
| Congregation | includes `securityToken` |
| MapType, Map, Activity | unchanged shape |
| DoNotCall | was Address; no `type` column |
| Street, StreetCategory, pivot | unchanged |
| Rural | latitude, longitude, what3words, description, isComplete |
| WorkingNote | unchanged |
| WhatsNew | global feature announcements (`content`, `addedAt`); dashboard banner for 30 days |

Gone: `SecurityToken` table, `Address`, unused Prisma `DoNotCall` stub (old Rural shape replaced by recreate migrate).

## Fresh empty database

If starting empty (no dump): run `node ace migration:run` without bootstrap — Batch A creates then Batch B evolves.

## Indexes / integrity (known gaps)

- Map code uniqueness is **app-level only** today — add `UNIQUE (congregationNumber, code)` before multi-user concurrent creates matter (see pre-prod audit).
- Consider `(status, outDate)` on `Activity` for overdue queries; `(mapId, outDate DESC)` for latest-activity patterns.

## Env keys

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` (parsed/synced from `DATABASE_URL` if present).
