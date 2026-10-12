# Folio

First-year accounting learning platform (local B–D).

| Path | Role |
|------|------|
| `client/` | Next.js PWA hugging the API (Vercel target later) |
| `server/` | NestJS API + Drizzle (Railway target later) |
| `doc/` | Concept, system profile, roadmap, UAT + security notes |
| `docker-compose.yml` | Local Postgres + Redis (+ MinIO profile) |

## Local run (hosting paused)

```bash
docker-compose up -d postgres redis

cd server
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm start

# other terminal
cd client
pnpm install
pnpm dev
```

- UI: http://localhost:3000  
- API docs: http://localhost:3001/docs  
- Gate: `cd server && pnpm test:a0-a3`

Demo: `lecturer@example.ac.uk` / `student@example.ac.uk` — `password123`

**Locked:** session-cookie auth · university email · recommended stack  
**Paused:** Vercel/Railway deploy, cloud accounts, privacy policy  
**Contract:** api-v1.1 (additive over api-v1.0 freeze)
