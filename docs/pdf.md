# PDF generation — Territory Maps v3

PDF export lives **inside** the Adonis app. The standalone `territory-maps-pdf-service` Hono app is obsolete for v3.

## Flow

1. Authenticated user requests S-12, S-13, or DNC worksheet export
2. `PdfGenService` builds payload, stores an in-memory job, asks Gotenberg (Chromiumly `UrlConverter`) to print a URL
3. Gotenberg fetches the secret-gated HTML route on this app
4. PDF bytes stream back to the browser

## Env

- `GOTENBERG_URL` — Gotenberg base URL (e.g. Coolify internal `http://gotenberg-…:3000`)
- `GOTENBERG_API_BASIC_AUTH_USERNAME` / `GOTENBERG_API_BASIC_AUTH_PASSWORD` — optional basic auth (Gotenberg ≥ 8.4)
- `GOTENBERG_SECRET` — query token for the HTML render route Gotenberg fetches from this app
- `GOTENBERG_ENDPOINT` — optional legacy alias; used only if `GOTENBERG_URL` is unset

## Forms

- **S-13** — Territory assignment record (service year activities)
- **S-12** — Territory map card (locality, terr no, map image URL)
- **Do Not Calls Worksheet** — A4 list of DNCs not worked in the current service year (`lastCalled` before 1 Sep), grouped by map type, oldest first, with print-only tick boxes

S-12 image URLs must be reachable from the Gotenberg container (Spaces public/signed URL).

Templates live in `resources/views/pages/pdf/` and intentionally mirror the v1 PDF microservice markup (Arial / serif + **Lekton** typewriter face from `public/Lekton-Bold.ttf`).

## Local Docker tip

Gotenberg runs in Docker and must HTTP-fetch this app to render HTML. Bind Adonis with `HOST=0.0.0.0` (not `localhost`/`::1` only) and keep `APP_URL=http://localhost:3333` — the PDF service rewrites that to `host.docker.internal` for the container callback.

## Health

`GET /healthcheck` should verify DB and Gotenberg `/health`.
