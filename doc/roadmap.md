# Folio — Implementation Roadmap

> Backend-first delivery plan: migrations and APIs land before UI; the frontend is built to **hug** a stable, documented backend contract.
> Living companions: [`system-profile.md`](./system-profile.md) · [`concept.md`](./concept.md)

| Field | Value |
|-------|-------|
| **Product name** | Folio |
| **Roadmap version** | 0.8.0 |
| **Created** | 2026-10-03 |
| **Updated** | 2026-10-12 |
| **Strategy** | Backend → contract freeze → frontend against real APIs |
| **Phase** | **B–D complete locally** (client + pilot harden + grounded tutor); hosting still paused |
| **Locked** | Stack = recommended · Auth = HTTP-only session cookies · Enrolment = university email |
| **Paused** | Hosting deploy, cloud accounts, privacy policy (after local dev OK) |
| **Deploy split (target)** | **Vercel** = `client/` · **Railway** = `server/` + Postgres (+ Redis) |
| **Horizon** | Phase 0–1 pilot (~12 weeks) + Phase 2 tutor (~4 weeks) |
| **Cadence** | Weekly goals · daily task table · Friday demos · **one file at a time** |

---

## 1. Project report (baseline)

### 1.1 What we are building

Folio is a mobile-friendly **PWA** for first-year accounting (ACC101 / ACC102). It combines lecturer-approved materials, a versioned question bank (MCQ, numerical, journal entries), deterministic marking, progress analytics, and (later) a grounded AI tutor.

**Primary outcome:** practise → precise error feedback → know what to study next. Lecturers retain control of content, keys, and assessment feedback.

### 1.2 Requirements summary (Phase 1 must-ship)

| Area | Requirements |
|------|----------------|
| **Accounts** | Roles (student, lecturer, TA, admin); university-email enrolment (+ CSV later); password reset; course-scoped permissions |
| **Materials** | Upload → validate/scan → tag → publish; version history; course isolation |
| **Questions** | CRUD + CSV import; MCQ, numerical, journal (multi-line, alternate accounts) |
| **Practice** | Attempts, component marks, hints, second attempt, configurable reveal |
| **Marking** | Separate deterministic grading service; decimal arithmetic; tolerances |
| **Progress** | Student progress; lecturer topic-struggle analytics; audit logs |
| **Platform** | Documented API; staging; CI; private file storage; phone-usable journeys |

Phase 2 adds the grounded tutor (hint-first, citations, no invented marks). Post-pilot items (adaptive revision, simulation, peer discussion, OCR) stay out of this roadmap’s critical path.

### 1.3 Constraints and invariants

1. Marking engine is authoritative; AI never invents marks or journal lines.  
2. Server-side permission checks on every course-scoped action.  
3. Migration-first schema changes only — no ad-hoc production DDL.  
4. Published content is versioned; replacements do not erase attempt evidence.  
5. Practice and summative modes remain separable.  
6. **Client never imports server DB code**; communication is HTTP/OpenAPI only.  
7. **Deploy roots stay fixed:** `client/` → Vercel, `server/` → Railway — no later split refactor.

### 1.4 Current repository state

```
folio/
  client/          # A0 stub (Vercel root later)
  server/          # NestJS + Drizzle + auth (A0 live locally)
  docker-compose.yml
  doc/
```

**A0 (2026-10-12):** Auth + users/sessions live locally.  
**A1 (2026-10-12):** Courses, enrolments, topics, materials, questions, audit, RBAC.  
**A2 (2026-10-12):** Marking engine + attempts + progress/analytics.  
**A3 (2026-10-12):** Contract **api-v1.0** / OpenAPI `1.0.0` at `server/openapi/openapi.json`; CORS allowlist (+ optional `*.vercel.app`); Redis rate limits (memory fallback); ACC seed users/course. Railway staging drill still **paused**.

---

## 2. Recommended tech stack

Chosen for TypeScript end-to-end, strong migration tooling, OpenAPI-friendly APIs, a PWA on Vercel, and an API + database on Railway — with **no shared runtime coupling** between client and server.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Repo layout** | Top-level `client/` + `server/` | Matches Vercel + Railway roots from day one |
| **Local DX** | pnpm in each app (`client`, `server`) | Independent installs/scripts; optional root scripts that `cd` into each |
| **Language** | TypeScript (strict) | Same language, separate packages — types shared via OpenAPI, not via DB imports |
| **API (server)** | NestJS (Fastify adapter) | Modules map to domains; guards for RBAC; OpenAPI via Swagger |
| **Validation** | Zod on server (+ DTO pipes); mirrored types on client from OpenAPI | Runtime-safe payloads |
| **ORM / SQL** | **Drizzle ORM** inside `server/` | SQL-visible schema; **migration-first** via `drizzle-kit` |
| **Database** | PostgreSQL 16 | Railway Postgres in prod; Docker Postgres locally |
| **Cache / queues** | Redis | Docker Redis locally; Railway Redis in prod (BullMQ jobs, rate limits, cache) |
| **Migrations** | Drizzle Kit (`generate` / `migrate`) run from `server/` | Schema-as-code; reviewable SQL in git under `server/` |
| **Auth** | **Locked:** HTTP-only session cookies | University email + password now; OIDC/SSO later; CORS for Vercel origin when hosted |
| **Files** | S3-compatible (MinIO local · R2 / S3 / Railway bucket prod) | Private buckets; signed downloads |
| **Marking** | `server/src/marking/` (pure modules) | Isolated, unit-tested, no AI dependency; stays on Railway |
| **API contract** | OpenAPI 3 exported from server | Client generates or hand-wraps fetch client; contract freeze before UI sprint |
| **Frontend (client)** | Next.js (App Router) + Tailwind | Responsive PWA on Vercel; talks only to Railway API URL |
| **PWA** | `@ducanh2912/next-pwa` or Serwist | Installable; offline/slow-network shells |
| **Testing** | Vitest (server + marking) · Supertest · Playwright (client E2E later) | Marking first; contract tests before UI |
| **CI/CD** | GitHub Actions → Vercel (client) + Railway (server) | Path filters: `client/**` vs `server/**` |
| **Observability** | Structured logs · Sentry | Rate limits, audit, tutor flags later |
| **AI (Phase 2)** | Explanation service on **server** + pgvector | Never in the Vercel client as authority |

### 2.1 Hosting matrix (fixed)

| Concern | Local | Production |
|---------|--------|------------|
| **Client** | `pnpm` in `client/` **or** `client/Dockerfile` | **Vercel** (Root Directory = `client`) |
| **Server (API)** | `pnpm` in `server/` **or** `server/Dockerfile` | **Railway** service from `server/` |
| **PostgreSQL** | **Docker** (`docker-compose`) | **Railway Postgres** |
| **Redis** | **Docker** (`docker-compose`) | **Railway Redis** |
| **Object storage** | MinIO via Docker Compose | R2 / S3 / Railway-compatible bucket |
| **Env** | `client/.env.local`, `server/.env` | Vercel env + Railway env (never commit secrets) |

**CORS / cookies:** server allows the Vercel origin; `NEXT_PUBLIC_API_URL` points at the Railway public API URL. Design this in Week 1 so prod auth does not need a rewrite.

### 2.2 Explicit non-choices (pilot)

| Avoid | Why |
|-------|-----|
| Next.js API routes as the main backend | Would blur Vercel vs Railway; all domain logic lives on `server/` |
| Client importing Drizzle / DB | Forces coupling and breaks the hosting split |
| Binary float for money | Use `numeric` / decimal.js |
| Prisma “push” to prod | Prefer reviewed migration SQL |
| Client-only auth checks | Every permission re-checked on server |
| Root-only Dockerfile for both apps | Each app owns its Dockerfile in its directory |
| AI inside marking | Hard invariant |

---

## 3. Target folder structure

Deploy-oriented split: **client** and **server** are independently buildable. Database schema, migrations, marking, and Redis usage live **only under `server/`**.

```
folio/
├── client/                              # ▶ Vercel root · Next.js PWA
│   ├── Dockerfile                       # client image (local/staging parity)
│   ├── .dockerignore
│   ├── package.json                     # pnpm scripts: dev, build, start, lint
│   ├── pnpm-lock.yaml                   # lockfile owned by client
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── public/
│   ├── src/
│   │   ├── app/                         # routes only — thin pages
│   │   │   ├── (student)/
│   │   │   ├── (lecturer)/
│   │   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/                  # one component per file
│   │   │   ├── ui/
│   │   │   ├── student/
│   │   │   ├── lecturer/
│   │   │   └── admin/
│   │   ├── features/                    # feature folders; one concern per file
│   │   │   ├── auth/
│   │   │   ├── materials/
│   │   │   ├── practice/
│   │   │   └── progress/
│   │   ├── lib/
│   │   │   ├── api/                     # OpenAPI-backed fetch wrappers (no DB)
│   │   │   └── hooks/
│   │   └── styles/
│   └── README.md                        # Vercel + local/Docker client runbook
│
├── server/                              # ▶ Railway root · API + DB ownership
│   ├── Dockerfile                       # server image (API process)
│   ├── .dockerignore
│   ├── package.json                     # pnpm scripts: dev, build, start, migrate, seed
│   ├── pnpm-lock.yaml                   # lockfile owned by server
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   ├── openapi/                         # exported openapi.json (CI artefact)
│   ├── drizzle/                         # generated SQL migrations (committed)
│   ├── db/                              # schema-as-code (Postgres)
│   │   ├── schema/                      # one table/domain per file
│   │   │   ├── users.ts
│   │   │   ├── courses.ts
│   │   │   ├── materials.ts
│   │   │   ├── questions.ts
│   │   │   ├── attempts.ts
│   │   │   └── index.ts
│   │   ├── client.ts
│   │   └── index.ts
│   ├── scripts/
│   │   ├── migrate.ts
│   │   └── seed.ts
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── config/                      # one config module/file at a time
│   │   ├── common/                      # guards, filters, audit — one file each
│   │   ├── marking/                     # pure marking engine (no Nest HTTP)
│   │   │   ├── decimal.ts
│   │   │   ├── mcq.ts
│   │   │   ├── numerical.ts
│   │   │   ├── journal.ts
│   │   │   └── index.ts
│   │   ├── modules/                     # one Nest module folder per domain
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── enrolments/
│   │   │   ├── topics/
│   │   │   ├── materials/
│   │   │   ├── questions/
│   │   │   ├── attempts/
│   │   │   ├── progress/
│   │   │   ├── analytics/
│   │   │   ├── admin/
│   │   │   └── tutor/                 # Phase 2
│   │   └── jobs/                        # Redis/BullMQ processors — one job per file
│   ├── test/
│   ├── railway.toml                     # optional Railway config
│   └── README.md                        # Railway + local/Docker server runbook
│
├── docker-compose.yml                   # Postgres + Redis (+ MinIO) only — not the apps
├── .env.example                         # documents compose service URLs for server
├── doc/
│   ├── concept.md
│   ├── system-profile.md
│   └── roadmap.md
│
├── .github/workflows/
│   ├── ci-client.yml                    # paths: client/**
│   ├── ci-server.yml                    # paths: server/** · migrate-from-zero
│   └── migrate-check.yml
│
└── README.md                            # how to run compose + client + server
```

### 3.1 Separation rules (no later refactor)

| Rule | Detail |
|------|--------|
| **Two deploy roots** | Vercel Root Directory = `client`. Railway service root = `server`. |
| **DB owned by server** | All Drizzle schema, migrations, seeds live under `server/`. |
| **No client → DB imports** | Client uses `NEXT_PUBLIC_API_URL` + HTTP only. |
| **Dockerfiles in place** | `client/Dockerfile` and `server/Dockerfile` only — never a single root app image that mixes both. |
| **Compose = data plane** | Root `docker-compose.yml` runs **Postgres, Redis, MinIO** for local/dev. Apps run via **pnpm** or their own Dockerfiles. |
| **Independent package.json** | Each side has its own dependencies and lockfile so Vercel/Railway installs stay scoped. |
| **Contract is the bridge** | OpenAPI from `server/openapi/` is the only shared “API SDK” surface for the client. |

### 3.2 Local vs Docker run patterns

```text
# Data services (always Docker in local/dev)
docker compose up -d          # postgres, redis, minio

# App processes — pick one style per app
cd server && pnpm install && pnpm migrate && pnpm dev
cd client && pnpm install && pnpm dev

# Or containerised apps (parity / CI)
docker build -t folio-server ./server && docker run --env-file server/.env …
docker build -t folio-client ./client && docker run -e NEXT_PUBLIC_API_URL=… …
```

---

## 4. Industry practices (non-negotiable)

### 4.1 Migration-first database governance

| Practice | How we do it |
|----------|----------------|
| Schema-as-code | All tables/indexes/FKs in `server/db/schema` (one domain file each) |
| Generate, never hand-edit prod | `drizzle-kit generate` in `server/` → review SQL → commit → `migrate` in CI/Railway release |
| No `db push` in shared envs | Allowed only on empty local throwaway DBs |
| Expand → migrate → contract | Additive columns first; dual-write if needed; drop only after release + backfill |
| Forward-only in production | Prefer new migrations over rewriting history; squash only on unused branches |
| Seed ≠ migrate | Seeds are idempotent scripts under `server/scripts`; migrations never contain prod demo users |
| Restore drills | Monthly restore from Railway backup to staging; document RPO/RTO |
| Naming | `YYYYMMDDHHMMSS_description.sql`; one logical change per migration |
| Review gate | Migration SQL reviewed like application code; require approval on `server/db/**` and `server/drizzle/**` |
| Ephemeral CI DB | `ci-server` spins Postgres, runs migrate from zero, runs tests |

### 4.2 API and security practices

- OpenAPI published on every server main build; breaking changes require version bump or explicit changelog  
- AuthN via session cookies or bearer; AuthZ via course-scoped guards on **server**  
- CORS allowlist = Vercel preview + production client origins  
- Idempotent writes where retries happen (imports, publish)  
- Rate limits (Redis) on auth, upload, tutor  
- Private object storage; short-lived signed URLs  
- Audit log for enrolment, publish, role, answer-key changes  
- Secrets only in Vercel / Railway env — never in git  

### 4.3 Modularity and single-file implementation discipline

Build in **small, modular files**. Prefer many focused modules over large multi-purpose files.

| Practice | Rule |
|----------|------|
| **One concern per file** | e.g. `journal.grader.ts`, `MaterialsUploadForm.tsx`, `courses.controller.ts` — not “god” files |
| **Nest modules** | Each domain folder owns `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts` as separate files |
| **React components** | One component per `.tsx`; compose pages from small components |
| **Schema files** | One Drizzle table/domain per file under `server/db/schema/` |
| **Implement one file at a time** | When coding (human or agent): finish **one** file (or one `.tsx`) before opening the next — avoids multi-file edit storms, timeouts, and half-applied changes |
| **No shotgun edits** | Do not touch client + server + migration in the same burst; sequence: migration file → server module file → (later) one client component |
| **Vertical slice, horizontal files** | A feature may need several files, but create/edit them **sequentially**, verify, then proceed |

### 4.4 Engineering quality

- Marking engine: property + fixture tests before any UI  
- Contract tests: API responses match OpenAPI  
- Feature flags for tutor and summative modes  
- Staging: Railway staging API + Vercel preview against it  
- Definition of Done includes migration + API test + capability ID update in `system-profile.md`  

### 4.5 Accounting-domain practices

- Store amounts as `numeric` / decimal strings in API  
- Configurable rounding and per-question tolerances  
- Accept alternate account labels only from lecturer-configured sets  
- Component marks: account · direction · amount separately  

---

## 5. Architecture sketch (backend-first, split hosting)

```
┌──────────────────────────┐         HTTPS / OpenAPI        ┌──────────────────────────┐
│  client/  (Vercel)       │ ─────────────────────────────► │  server/  (Railway)      │
│  Next.js PWA             │   NEXT_PUBLIC_API_URL           │  NestJS API              │
│  client/Dockerfile       │                                │  server/Dockerfile       │
└──────────────────────────┘                                └────────────┬─────────────┘
                                                                         │
                                      ┌──────────────────────────────────┼──────────────────────────┐
                                      ▼                                  ▼                          ▼
                             ┌─────────────────┐              ┌─────────────────┐        ┌─────────────────┐
                             │ PostgreSQL      │              │ Redis           │        │ Object storage  │
                             │ server/db +     │              │ cache / BullMQ  │        │ MinIO / R2 / S3 │
                             │ drizzle migrate │              │                 │        │                 │
                             │ (Railway PG)    │              │ (Railway Redis) │        │                 │
                             └─────────────────┘              └─────────────────┘        └─────────────────┘
                                      │
                                      │ Phase 2
                                      ▼
                             ┌─────────────────┐              ┌─────────────────┐
                             │ pgvector chunks │ ◄────────────│ tutor module    │
                             │ (on server DB)  │              │ (explain only)  │
                             └─────────────────┘              └─────────────────┘

Local data plane (Docker Compose):  Postgres + Redis + MinIO
Local/prod apps:                    pnpm OR per-app Dockerfiles
```

**Build order:** `server/db` migrations → `server/src/marking` → `server` API modules → export OpenAPI → `client` screens that only call the API.

---

## 6. Roadmap phases

| Phase | Weeks | Focus | Exit criteria |
|-------|-------|-------|----------------|
| **A0 — Foundations** | W1 | `server/` + Compose (Postgres/Redis) + first migrations + auth; scaffold empty `client/` for Vercel root only | `migrate` from zero; health + register/login on Railway-shaped server |
| **A1 — Core domain API** | W2–W4 | Courses, topics, materials, questions, imports | Lecturer can publish via API/curl; files private |
| **A2 — Practice & marking** | W5–W6 | Attempts, journal marking, hints, progress, analytics | Acceptance tests 1–3 via API |
| **A3 — Contract freeze** | W6 end | OpenAPI freeze v1; seed ACC sample; harden CORS for Vercel | Tagged `api-v1.0`; client can point at Railway URL |
| **B — Frontend hugs API** | W7–W10 | `client/` on Vercel against Railway API | Phone journeys complete; no Next.js domain API |
| **C — Pilot harden** | W11–W12 | A11y, slow-network, audit, staging drill, docs | Phase 1 pilot-ready |
| **D — Grounded tutor** | W13–W16 | Retrieval + tutor on **server** first; then client UI | Phase 2 acceptance tests 4 & 6 |

Frontend feature work **does not** begin until **A3 contract freeze**. An empty `client/` shell may exist earlier solely so Vercel project linking is ready — no business UI until the API is frozen.

---

## 7. Weekly / daily implementation table

Assumes a **full-time developer** (or equivalent pair). Adjust dates to actual start; week numbers are relative.  
**Server = A\* · Client = B\***.  
**Implementation rule:** each day lists outcomes, but edits are applied **one file at a time** (see §4.3).

### Week 1 — Foundations (server + data Docker)

| Day | Focus | Deliverables (sequential files) |
|-----|--------|----------------------------------|
| Mon | Repo + data plane | Root `docker-compose.yml` (Postgres, Redis, MinIO); `server/package.json`; `server/Dockerfile`; empty `client/package.json` + `client/Dockerfile` stubs |
| Tue | Migration-first DB | `server/db/schema/users.ts` → generate migration → `server/scripts/migrate.ts` → `seed.ts` stub |
| Wed | API skeleton | `main.ts` → `app.module.ts` → config file → `/health` → Swagger setup (one file each) |
| Thu | Auth core | Auth module files one-by-one: dto → service → controller; session; password reset |
| Fri | CI + demo | `ci-server.yml`; migrate-from-zero; Swagger auth demo; document Railway service root = `server` |

**Week 1 done when:** `docker compose up` → migrate → register → login → `/me` works; server runs via pnpm **and** builds via `server/Dockerfile`.

---

### Week 2 — Courses, enrolment, RBAC (server)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Schema | `courses.ts` / `enrolments.ts` schema files → one migration |
| Tue | Courses API | courses module: dto → service → controller (one file at a time) |
| Wed | Enrolment | invite + CSV import flow (validate → preview → commit); withdrawal |
| Thu | Guards | course-scoped RBAC guard file; deny cross-course access |
| Fri | Audit + demo | audit log module; Bruno/Postman collection v0 |

---

### Week 3 — Topics & materials (server)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Topics/outcomes | schema files + module CRUD |
| Tue | Materials metadata | material entity + version fields; unpublished default |
| Wed | Upload pipeline | presigned upload to MinIO; type/size limits; scan job stub (Redis) |
| Thu | Publish/replace | publish, withdraw, replace version; signed download |
| Fri | Tests | isolation tests: student A cannot read course B files |

---

### Week 4 — Question bank (server)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Question schema | one schema file; types MCQ / numerical / journal |
| Tue | Question CRUD | lecturer create/update; student list published only |
| Wed | CSV import | validation, duplicates, preview, all-or-nothing publish |
| Thu | Journal model | multi-line entries; alternate account labels |
| Fri | Seed | 20–30 sample questions via `server/scripts/seed.ts` |

---

### Week 5 — Marking engine & attempts (server)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Marking package | `decimal.ts` → `mcq.ts` → `numerical.ts` (one file each + tests) |
| Tue | Journal grader | `journal.ts` + golden fixtures |
| Wed | Attempts API | submit attempt; persist marks + feedback |
| Thu | Hints & retry | hint events; second attempt; reveal rules |
| Fri | Integration | API test: wrong credit → misconception hint → retry |

---

### Week 6 — Progress, analytics, contract freeze (server)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Progress | topic mastery summaries |
| Tue | Lecturer analytics | struggle-by-topic; CSV export |
| Wed | Harden | Redis rate limits; CORS for Vercel origins; OpenAPI polish |
| Thu | **API contract freeze** | tag `api-v1.0`; export `server/openapi/openapi.json` |
| Fri | Staging drill | deploy **server** to Railway; migrate against Railway Postgres; demo |

**Gate A3:** No breaking API changes without version note. Client sprint may start on Vercel.

---

### Week 7 — Client foundation (hug Railway API)

| Day | Focus | Deliverables (one `.tsx` / file at a time) |
|-----|--------|---------------------------------------------|
| Mon | Next.js app | scaffold `client/` App Router + Tailwind; env `NEXT_PUBLIC_API_URL` |
| Tue | API client | single `lib/api/client.ts` (then endpoint wrappers one file each) |
| Wed | Auth UI | login page → session provider → layout (sequential) |
| Thu | Role shells | student / lecturer / admin route layouts — one layout file per role |
| Fri | PWA shell | manifest + offline fallback page; verify Vercel deploy of `client/` |

---

### Week 8 — Lecturer UI (client)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Topics UI | one screen/component file at a time |
| Tue | Materials UI | upload/tag/publish components against API |
| Wed | Question editor | MCQ + numerical forms |
| Thu | Journal editor | multi-line answer key UI |
| Fri | CSV import UI | preview → confirm publish |

---

### Week 9 — Student practice UI (client)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Materials reader | search/filter/open |
| Tue | Practice list | entry points for quizzes/sets/revision |
| Wed | Attempt UI | MCQ + numerical feedback from API |
| Thu | Journal attempt UI | line editor; mobile layout |
| Fri | Hint/retry UX | hint CTA; second attempt; reveal |

---

### Week 10 — Progress UI + journey polish (client)

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Student progress | weak topics; suggested practice |
| Tue | Lecturer analytics UI | tables/charts from analytics API |
| Wed | Admin basics | accounts, enrolments, audit viewer |
| Thu | Phone QA | full journeys on small viewport |
| Fri | Bug bash | fix defects; update `system-profile` statuses |

---

### Week 11 — Pilot hardening

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | A11y pass | keyboard, labels, contrast (one component at a time) |
| Tue | Resilience | empty/error/offline states |
| Wed | Security review | permission matrix; signed URL expiry; CORS |
| Thu | Docs | root README + `client/README` + `server/README` (Vercel/Railway) |
| Fri | Staging UAT | Vercel preview ↔ Railway staging |

---

### Week 12 — Phase 1 pilot ready

| Day | Focus | Deliverables |
|-----|--------|--------------|
| Mon | Defect burn-down | P0/P1 from UAT |
| Tue | Seed real course | ACC101 pilot content on Railway DB |
| Wed | Monitoring | Railway logs/alerts; backup schedule |
| Thu | Acceptance checklist | tests 1–3, 5 |
| Fri | **Phase 1 gate** | pilot go/no-go |

---

### Weeks 13–16 — Phase 2 grounded tutor (server first, then client)

| Week | Days Mon–Fri (summary) |
|------|-------------------------|
| **W13** | Retrieval schema + extract/index jobs on **server**; Redis workers; ACL on chunks *(server only)* |
| **W14** | Tutor API on Railway; hint-first state machine; citations; flags — **no client until OpenAPI stable** |
| **W15** | Client tutor UI on Vercel hugging tutor endpoints (one component file at a time) |
| **W16** | Adversarial tests; acceptance #4 & #6; eval readiness |

---

## 8. Daily operating rhythm

| When | Activity |
|------|----------|
| **Start of day** | Pick **one** target file for the next edit; open related capability IDs in `system-profile.md` |
| **During day** | If schema changes: one migration path first; then one server file; only later one client `.tsx`. Do not batch-edit many files in one agent/tool turn |
| **End of day** | Short note: done / blocked / next; update capability status if shipped |
| **Friday** | Demo on Swagger (A\* weeks) or phone UI on Vercel (B\* weeks); tag risk for Monday |

**Priority if behind:** cut UI polish before cutting marking correctness, migrations, or RBAC.

---

## 9. Definition of Done (per feature)

A feature is done only when all apply:

1. Migration (if any) generated under `server/drizzle`, reviewed, and applied in CI from zero  
2. API behaviour covered by automated test on **server**  
3. OpenAPI updated (client wrappers updated only after server ships)  
4. Server-side permission cases covered (allow + deny)  
5. `system-profile.md` capability status updated  
6. No floating-point grading for money  
7. No new coupling from `client/` into `server/db` or Redis  

---

## 10. Tracking map (capabilities → weeks)

| Capability IDs | Target weeks |
|----------------|--------------|
| ACC-01 … ACC-05 | W1–W2, UI W7 |
| MAT-01 … MAT-06 | W3, UI W8 |
| QBA-01 … QBA-11 | W4–W5, UI W8–W9 |
| PRG-01 … PRG-04 | W6, UI W10 |
| PLT-01 … PLT-05 | W1, W6–W7, W11 |
| TUT-01 … TUT-08 | W13–W16 |

---

## 11. Risks and buffers

| Risk | Mitigation |
|------|------------|
| Journal edge cases explode W5 | Golden fixtures from lecturer early (DEC-09); spike day in W4 |
| Contract churn after UI starts | Freeze gate W6; additive-only changes |
| Cookie/CORS issues across Vercel ↔ Railway | Decide cookie vs bearer in W1; test with real Vercel preview URL in W6 |
| File/malware scanning complexity | Stub scanner W3; real scanner behind interface |
| SSO delay | Invite/password path is pilot-critical; SSO deferred |
| Scope creep (simulation, OCR) | Keep in post-pilot; do not schedule in W1–W12 |
| Accidental monorepo coupling | Independent `package.json` per side; CI path filters; ban client DB imports in review |

---

## 12. Immediate next actions (this week)

1. ~~Confirm stack + auth + enrolment~~ **Done.**  
2. Hosting / cloud accounts / privacy: **still paused.**  
3. ~~A0–A3 server~~ **Done** (base freeze api-v1.0; additive **api-v1.1** for password-reset + tutor).  
4. ~~Phase B–D local~~ **Done:** Next.js client, pilot harden docs/UAT, grounded tutor API + UI.  
5. Next when unpaused: Vercel client + Railway server staging drill; privacy policy.  

---

## 13. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-10-03 | 0.1.0 | Initial roadmap: stack, folder structure, practices, backend-first weekly/daily plan |
| 2026-10-03 | 0.2.0 | Split `client/` (Vercel) + `server/` (Railway + DB); Compose for Postgres/Redis; per-app Dockerfiles; modular single-file implementation discipline |
| 2026-10-03 | 0.3.0 | Product renamed to **Folio**; repo/docker naming aligned |
| 2026-10-12 | 0.4.0 | Locked recommended stack, session-cookie auth, uni-email enrolment; hosting paused; A0 started |
| 2026-10-12 | 0.5.0 | A1 core domain API: courses, enrolments, topics, materials, questions, audit, RBAC |
| 2026-10-12 | 0.6.0 | A2 marking engine + attempts + progress/analytics |
| 2026-10-12 | 0.7.0 | A3 OpenAPI freeze api-v1.0; CORS + Redis rate limits; ACC seed |
| 2026-10-12 | 0.7.1 | A0–A3 verification suite (`pnpm test:a0-a3`): marking units + cookie API integration |
| 2026-10-12 | 0.8.0 | Phase B–D local: Next.js PWA hugs API; password-reset; grounded tutor (api-v1.1); hosting still paused |
