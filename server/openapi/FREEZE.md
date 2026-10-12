# API contract — api-v1.1 (additive)

**Base freeze:** 2026-10-12 — `api-v1.0` / `1.0.0`  
**Additive bump:** 2026-10-12 — `api-v1.1` / `1.1.0`  
**Artefact:** `openapi/openapi.json`

## Included surface (1.0)

- Health, auth (register/login/logout/me)
- Courses, enrolments (join/withdraw/CSV)
- Topics, materials, questions
- Attempts (submit/hint/reveal)
- Progress + lecturer analytics

## Additive surface (1.1)

- Auth password-reset request/confirm
- Grounded tutor: ask / preview / flags / material reindex
- Material publish triggers retrieval reindex (keyword chunks)

## Explicitly out / paused

- Railway/Vercel production deploy (paused by owner)
- External embedding vendor lock-in (local keyword retrieval for pilot)

## Change policy

Additive changes may ship with a minor version bump.  
Breaking changes require bumping `API_CONTRACT_VERSION` and regenerating `openapi.json`.
