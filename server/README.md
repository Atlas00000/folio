# Folio server

NestJS + Drizzle + Postgres. Contract **api-v1.1** (additive over frozen api-v1.0). Railway is the eventual deploy root; hosting is paused.

## Quick start

```bash
# from repo root
docker-compose up -d postgres redis

cd server
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm start
```

- Health: `GET http://localhost:3001/health`
- Docs: `http://localhost:3001/docs`
- Auth: university email only (`UNI_EMAIL_DOMAINS` in `.env`)

Demo accounts: `lecturer@example.ac.uk` / `student@example.ac.uk` — password `password123`

## A0–A3 (+ C/D) verification

```bash
cd server
pnpm test:a0-a3
```

Ensures Postgres/Redis, migrate, seed, waits for `/health`, runs marking units + API suite (including password-reset and tutor).

| Script | Purpose |
|--------|---------|
| `pnpm test:unit` / `pnpm test:ci` | Marking + retrieval Vitest only |
| `pnpm test:api` | Live API suite |
| `pnpm test:prep` | Compose + migrate + seed |
| `pnpm test:a0-a3` | Full local gate |

Override API base for tests with `FOLIO_API_URL` (not `BASE_URL` — Vite reserves that).

## Logs

Local Nest/Fastify logs go to the process stdout. Password-reset tokens are printed only when `NODE_ENV` is not `production`.
