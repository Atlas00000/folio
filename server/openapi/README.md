# Folio API contract (A3 freeze)

| Field | Value |
|-------|--------|
| **Version** | `1.0.0` |
| **Tag** | `api-v1.0` |
| **Artefact** | `openapi.json` (regenerated on server start) |

## Rules

1. The client talks to this contract only (HTTP + cookie session).
2. **Breaking changes** (removed/renamed fields or routes) require a new major/minor contract version and an explicit note in `doc/roadmap.md`.
3. Additive endpoints/fields are allowed as `1.x` patches if documented.
4. Hosting deploy (Railway) remains paused until local A3 is accepted; CORS already allows local + optional `*.vercel.app` previews.

## Generate / refresh

```bash
cd server
pnpm build && pnpm start
# writes openapi/openapi.json
```

Or:

```bash
pnpm openapi:export
```
