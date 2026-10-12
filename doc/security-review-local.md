# Local security review (Phase C)

Date: 2026-10-12 · Scope: local Docker + Nest API + Next client (hosting paused)

## RBAC matrix (spot-check)

| Action | Student | Lecturer/owner | Admin |
|--------|---------|----------------|-------|
| Join course by code | allow | allow | allow |
| Create course | deny | allow | allow |
| Publish material/question | deny | allow | allow |
| Submit attempt | allow (enrolled) | — | allow |
| Analytics | deny | allow | allow |
| Tutor ask | allow (enrolled) | allow | allow |
| Tutor flags / preview | deny | allow | allow |
| Cross-course read | deny | deny | allow |

Covered by API suite: `courses.a1`, `content.a1`, `attempts.a2`, `analytics.a2`, `tutor.d`.

## Cookies / CORS

- Session cookie `folio_session`: httpOnly, sameSite=lax, secure only in production
- CORS allowlist: `CLIENT_ORIGINS` (defaults localhost + 127.0.0.1:3000); credentials required
- Client uses `credentials: 'include'` and `NEXT_PUBLIC_API_URL`

## Files

- Upload size cap 15MB; mime allowlist per material type
- Downloads require enrolment; students only published
- Local disk storage under `server/storage/` (swap to object storage when hosting resumes)

## Password reset

- Opaque token hashed at rest; expiry 2h; single use; revokes sessions on confirm
- Request always returns `{ ok: true }` (no email enumeration)
- Local Dev: token printed to server log (no mailer while hosting paused)

## Rate limits

- Redis-backed Fastify rate limit with memory fallback; `/health` and `/docs` skipped
