# Folio local UAT checklist (Phase C)

Hosting remains paused. Run against localhost only.

## Prep

1. `docker-compose up -d postgres redis`
2. `cd server && pnpm db:migrate && pnpm db:seed && pnpm start`
3. `cd client && pnpm dev` → http://localhost:3000

## Journeys

| # | Check | Pass? |
|---|--------|-------|
| 1 | Student cannot open another course’s materials/questions | |
| 2 | Journal accepts alternate account label (Bank for Cash) | |
| 3 | Wrong debit/credit → hint → correct retry updates progress | |
| 5 | Lecturer creates topic, material, question and publishes without developer | |
| Auth | Login/logout cookie session; uni-email register reject for gmail | |
| Reset | Forgot password request returns ok; confirm with logged token | |
| Tutor | Ask covered topic → citations; ask unrelated → insufficient evidence | |
| A11y | Keyboard tab through login + practice submit; labels present | |
| Offline | `/offline` page reachable; online resume via home | |

## Automated gate

```bash
cd server && pnpm test:a0-a3
```

## Go / no-go

Phase 1 pilot-ready locally when rows 1–3, 5 and Auth pass on phone viewport plus `test:a0-a3` green.
