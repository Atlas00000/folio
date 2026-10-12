# Folio client

Next.js App Router PWA that **hugs** the Folio API (`api-v1.1`). Vercel is the eventual deploy root; hosting is paused — run locally.

## Local run

```bash
# terminal 1 — API (Docker Postgres/Redis already up)
cd server
pnpm start

# terminal 2 — UI
cd client
pnpm install
pnpm dev
```

Open http://localhost:3000  

Env: `NEXT_PUBLIC_API_URL=http://localhost:3001` (see `.env.local`).

Demo accounts (after `pnpm db:seed` on server):

- `lecturer@example.ac.uk` / `password123`
- `student@example.ac.uk` / `password123`

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next.js turbo dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |

No Next.js route handlers call the database — HTTP + cookie session only.
