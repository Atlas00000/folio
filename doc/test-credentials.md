# Folio — local test credentials

For **local development only**. Do not use these passwords in production or shared hosting.

## Demo accounts (after `pnpm db:seed`)

| Role | Email | Password |
|------|-------|----------|
| Lecturer | `lecturer@example.ac.uk` | `password123` |
| Student | `student@example.ac.uk` | `password123` |

## Sample course

| Field | Value |
|-------|--------|
| Code | `ACC101` |
| Join code | printed by seed (often `acc101demo` on first create; check seed output if reused) |

Seed command:

```bash
cd server
pnpm db:seed
```

Example seed output:

```text
lecturer@example.ac.uk / password123
student@example.ac.uk / password123
ACC101 joinCode=<value>
```

## Local URLs

| Service | URL |
|---------|-----|
| Client | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/docs |

## Notes

- Registration requires a university-style domain (e.g. `@example.ac.uk` via `UNI_EMAIL_DOMAINS`).
- Password-reset tokens are logged to the **server console** in non-production (no email while hosting is paused).
- API integration tests create their own unique emails/course codes; they do not rely on changing these demo passwords.
