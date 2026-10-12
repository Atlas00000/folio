# Folio — System Profile

> **Living source of truth** for product identity, features, capabilities, architecture, and constraints.
> Update this document whenever capabilities ship, change, or are deferred.
> Companion brief: [`concept.md`](./concept.md) (original proposal and requirements).

| Field | Value |
|-------|-------|
| **Product name** | Folio |
| **Name origin** | Accounting *folio* — the page/reference linking journal to ledger |
| **Profile version** | 0.6.0 |
| **Status** | Phase A3 complete locally — API contract frozen (api-v1.0) |
| **API contract** | `1.0.0` · `server/openapi/openapi.json` |
| **Last updated** | 2026-10-12 |
| **Stack (locked)** | NestJS + Drizzle + Postgres + Redis · Next.js client · Docker Compose for data |
| **Auth (locked)** | HTTP-only session cookies (password + uni email); SSO later |
| **Enrolment (locked)** | University email |
| **Hosting** | Paused until local dev is solid (Vercel client / Railway server still the target) |
| **Primary curriculum** | ACC101, ACC102 (first-year accounting) |
| **Delivery form (R1)** | Responsive Progressive Web App (PWA) |
| **Native apps** | Out of scope until after pilot evaluation |

---

## 1. Product identity

### 1.1 One-line purpose

Help first-year accounting students practise a concept, understand the precise reason for an error, and know what to study next — with lecturer-controlled content and an AI tutor that supports teaching without replacing assessment authority.

### 1.2 Problem it solves

| Stakeholder | Problem |
|-------------|---------|
| Students | Limited support outside class; hard to get precise feedback on journal entries and foundational mistakes |
| Lecturers | Little visibility into which concepts students struggle with; high cost of one-to-one explanation at scale |
| Institution | Need academically safe AI use: grounded answers, controlled content, auditable practice |

### 1.3 Non-goals (explicit)

- Replacing lecturers or becoming an unsupervised grading authority
- Ingesting third-party textbooks into AI without permission
- Opaque “black box” adaptive prediction in release one
- Native iOS/Android apps in the pilot
- Treating AI-generated feedback as an official summative grade unless institutionally approved

### 1.4 Success signals (pilot)

- Students complete practice journeys on a phone end-to-end
- Lecturers upload, preview, and publish materials/questions without developer intervention
- Tutor explanations cite approved materials and do not invent marks or journal lines
- Topic-level struggle patterns visible to lecturers
- Positive student/lecturer feedback + evidence of learning improvement before expansion

---

## 2. Users and roles

### 2.1 Role matrix

| Role | Can do | Must not |
|------|--------|----------|
| **Student** | View enrolled content; attempt published questions; use tutor; view own feedback, progress, saved materials | Access other students’ records, other courses’ files/attempts, unpublished content |
| **Lecturer** | Manage own course topics; upload/review/publish materials & questions; view course analytics and submissions (per access policy); preview AI answers; see flagged responses | Bypass institutional privacy/retention policy |
| **Teaching assistant** | Review flagged submissions/discussions in assigned courses; publish only if delegated | Independent course creation or unconstrained content publish |
| **Administrator** | Accounts, roles, enrolments, course creation, retention settings, audit logs | Routine access to private learning conversations |

### 2.2 Access principles

- Course-scoped role assignments
- Every permission check enforced **server-side**
- Least privilege by default
- Practice data and tutor chats private to the learner (and authorised staff under policy)

---

## 3. Capability catalogue

Status legend:

| Status | Meaning |
|--------|---------|
| `planned-r1` | Required for first working pilot (Phase 1) |
| `planned-r2` | Grounded tutor release (Phase 2) |
| `post-pilot` | Explicitly after classroom evaluation |
| `deferred` | Decided later / optional |
| `shipped` | Implemented and available *(update when true)* |
| `removed` | Retired — keep for history |

### 3.1 Accounts, courses, and navigation

| ID | Capability | Status | Notes |
|----|------------|--------|-------|
| ACC-01 | Student / lecturer / TA / admin accounts | `shipped` | Password reset (local token log) |
| ACC-02 | Enrol with university email (+ course code / CSV later) | `shipped` | **DEC-04 locked:** uni email; withdrawal supported |
| ACC-03 | Institutional SSO | `deferred` | After pilot if available |
| ACC-04 | Student home: topics, suggested practice, recent feedback, progress | `shipped` | Local UI |
| ACC-05 | Lecturer & admin dashboards with role-based nav | `shipped` | Local UI |
| ACC-06 | Course / term configuration for ACC101 & ACC102 | `shipped` | Topics/materials/questions UI |

### 3.2 Study materials library

| ID | Capability | Status | Notes |
|----|------------|--------|-------|
| MAT-01 | Upload PDF, DOCX, slides, short video links, accessible text summaries | `shipped` | Scan stub; local storage |
| MAT-02 | Tag: course, topic, outcome, version, author, source, licence, publication state | `shipped` | |
| MAT-03 | Search / filter by course and topic; open on phone; download approved items | `shipped` | Topic-scoped lists |
| MAT-04 | File type/size checks, malware scan, course-limited access | `shipped` | Scan stub |
| MAT-05 | Replace or withdraw without erasing audit history | `shipped` | Reindex on publish/withdraw |
| MAT-06 | Block unauthorized third-party textbook ingest into AI | `shipped` | Course-ACL retrieval only |

### 3.3 Question bank and practice

| ID | Capability | Status | Notes |
|----|------------|--------|-------|
| QBA-01 | Create questions individually | `shipped` | |
| QBA-02 | Import via reviewed CSV template | `shipped` | Preview → commit |
| QBA-03 | Question metadata: type, prompt, topic, difficulty, marks, solution, hints, rationale, misconceptions, source, status | `shipped` | Versioned |
| QBA-04 | Multiple choice | `shipped` | |
| QBA-05 | Numerical answers | `shipped` | Decimal + tolerances |
| QBA-06 | Journal entries (account, debit/credit, amount; multi-line; alternate labels) | `shipped` | Core differentiator |
| QBA-07 | Immediate component-specific feedback (account, direction, amount) | `shipped` | |
| QBA-08 | Save attempts; second attempt after hint; configurable answer reveal | `shipped` | |
| QBA-09 | Topic quizzes, lecturer practice sets, untimed personal revision | `shipped` | Topic practice list |
| QBA-10 | Link misses to lesson; course-level analytics export | `shipped` | Analytics CSV |
| QBA-11 | Deterministic marking engine (authority for correctness) | `shipped` | Separate from tutor |

### 3.4 AI tutor

| ID | Capability | Status | Notes |
|----|------------|--------|-------|
| TUT-01 | Default sequence: attempt → error ID → one targeted hint → correction → worked explanation | `shipped` | Hint-first grounded reply |
| TUT-02 | Explain from reviewed solutions + retrieved approved materials only | `shipped` | Cite title + section |
| TUT-03 | Must not invent mark, journal entry, or citation | `shipped` | Hard rule in tutor copy |
| TUT-04 | Admit gaps; flag; offer lecturer escalation when content insufficient | `shipped` | |
| TUT-05 | Lecturer preview of AI answers; flagged response queue | `shipped` | |
| TUT-06 | Distinguish formative practice vs assessed work; honour reveal rules | `shipped` | Practice-scoped ask |
| TUT-07 | Retrieval: extract → page/section metadata → per-course/version index → access-checked retrieve → cite | `shipped` | Keyword chunks; reindex on publish |
| TUT-08 | Prompt-injection hardening (retrieved content = data, never instructions) | `shipped` | Excerpt-only composition |

### 3.5 Progress, analytics, and audit

| ID | Capability | Status | Notes |
|----|------------|--------|-------|
| PRG-01 | Student progress and weak-topic visibility | `shipped` | Derived from attempts |
| PRG-02 | Lecturer analytics: difficult concepts, submissions | `shipped` | |
| PRG-03 | Immutable audit logs: enrolment, publication, roles, answer-key changes | `planned-r1` | |
| PRG-04 | Configurable retention of tutor interactions | `planned-r1` | Institutional policy |

### 3.6 Post-pilot enhancements

| ID | Capability | Status | Prerequisite |
|----|------------|--------|--------------|
| ADV-01 | Adaptive revision from attempt history | `post-pilot` | Transparent rules first (not opaque ML) |
| ADV-02 | Business simulation (café/shop → ledgers → trial balance → statements) | `post-pilot` | Connected multi-stage exercises |
| ADV-03 | Explain-your-reasoning + rubric / optional AI draft feedback | `post-pilot` | Lecturer-reviewed rubric |
| ADV-04 | Moderated study groups / peer discussion | `post-pilot` | Protect individual attempt data |
| ADV-05 | Audio explanations, captions, optional local language | `post-pilot` | Quality review of accounting terms |
| ADV-06 | Photo of handwritten work | `deferred` | OCR + manual correction + confidence |

### 3.7 Platform qualities

| ID | Capability | Status | Notes |
|----|------------|--------|-------|
| PLT-01 | Mobile-first responsive UI | `shipped` | Local PWA shell |
| PLT-02 | Offline / slow-network states; low data usage | `shipped` | `/offline` fallback |
| PLT-03 | Accessible text, keyboard support | `planned-r1` | Further a11y in ADV-05 |
| PLT-04 | Documented API + staging + automated deploy | `planned-r1` | |
| PLT-05 | Private object storage for uploads | `planned-r1` | Controlled downloads |

---

## 4. Key user journeys

### 4.1 Student learning loop

```
Sign in → choose enrolled course → open topic & approved material
  → attempt question → receive component-specific feedback
  → request hint → retry → view worked explanation
  → add weak topic to revision
```

### 4.2 Lecturer content loop

```
Create topic → upload & tag material → add/import question + model answer
  → preview as student → publish → review analytics & flagged explanations
  → revise content (version history preserved)
```

---

## 5. Domain model (canonical entities)

| Entity | Core fields / relations |
|--------|-------------------------|
| **User & role** | `user_id`, verified identifier, display name, role, status, `created_at`; roles scoped to course |
| **Course & enrolment** | `course_id`, code, term, owner; enrolment(`user_id`, `course_id`, role, status) |
| **Topic & outcome** | `topic_id`, `course_id`, sequence; `outcome_id`, `topic_id`, description |
| **Material** | `material_id`, `topic_id`, file ref, type, title, source, licence, version, status, uploader, timestamps |
| **Question & answer key** | `question_id`, `topic_id`, type, prompt, difficulty, marks, status; accepted solutions, hints, rationale, misconception tags, version |
| **Attempt & response** | `attempt_id`, `student_id`, `question_version`, response payload, component marks, feedback, hint events, `submitted_at` |
| **Tutor interaction** | `interaction_id`, `user_id`, `course_id`, retrieved material version/section, prompt, response, flag, timestamp; retention configurable |
| **Progress & audit** | Topic mastery summaries from attempts; immutable logs of enrolment, publication, role, answer-key changes |

**Storage:** managed relational DB for users, courses, metadata, attempts; protected object storage for files. Foreign keys, migrations, backups + restore tests. Secrets outside source control.

---

## 6. Architecture rules

### 6.1 Service boundaries

| Service | Responsibility | Must not |
|---------|----------------|----------|
| **Grading / marking engine** | Authoritative correctness for accounting answers | Call generative AI to decide marks |
| **AI explanation service** | Hints and explanations from keys + retrieved approved materials | Invent marks, journal lines, or citations |
| **API / auth layer** | Permissions, enrolment, CRUD, audit | Trust client-only checks |
| **Retrieval / indexing** | Course-scoped, versioned material search | Serve unpublished or out-of-course chunks |

### 6.2 Financial correctness

- Validate amounts with **decimal** arithmetic
- Configurable rounding and question-specific tolerances
- **Never** grade financial values with binary floating-point equality

### 6.3 Content lifecycle

- Uploads and imports start **unpublished**
- Publish is an explicit lecturer (or delegated) action
- Material replace → re-index for **future** tutor citations; preserve prior attempt evidence
- Question import: validate → dedupe → preview → all-or-nothing publish

### 6.4 Frontend / backend

- Frontend: accessible controls, clear offline/slow states, keyboard support
- Backend: documented API, server-side permission checks
- Environments: staging + production; automated pipeline
- Owner receives repo access, tech docs, admin instructions

---

## 7. Security, privacy, academic integrity

| Area | Rule |
|------|------|
| Data minimisation | Collect only needed student information |
| Transparency | Explain what is recorded, who sees it, retention, correction/deletion rights |
| Research use | Institutional review required for identifiable learning data |
| Auth | Secure auth; hashed passwords or managed identity; encrypted transport |
| Access | Least privilege; course-level checks on server; rate limits; monitoring |
| Audit | Backups, audit logs, role/publication/answer-key change trails |
| AI safety | Retrieved docs treated as data not instructions; restrict file types; log unsafe/unsupported answers |
| Isolation | Tutor must not expose other students’ records |
| Assessment | Separate practice vs summative modes; configurable reveal, attempt limits, variants |
| Grades | Do not present AI feedback as official grade unless approved |

---

## 8. Delivery roadmap

| Phase | Name | Deliverable | Approval gate |
|-------|------|-------------|---------------|
| **0** | Discovery & design | Course outline, user counts, hosting, budget, data policy, sample content; clickable screens; schema; API outline; 20–30 lecturer-reviewed pilot questions | Owner confirmation |
| **1** | Working pilot | Accounts, enrolment, materials, question bank, journal marking, progress, lecturer analytics | Full student + lecturer journeys on a phone |
| **2** | Grounded tutor | Hint-first AI on reviewed keys + materials; source citations; adversarial test set | Lecturer-approved correct / incorrect / ambiguous / adversarial questions |
| **3** | Classroom evaluation | One-course pilot; fix usability/marking defects; measure participation & topic improvement; gather feedback | Sign-off before expansion |

### 8.1 Acceptance tests (canonical)

1. Student cannot access another course’s files or attempts  
2. Valid alternative journal entry accepted when configured  
3. Incorrect debit/credit receives misconception-specific hint  
4. Replacing a PDF updates future tutor citations; preserves prior attempt evidence  
5. Lecturer uploads, previews, publishes questions without developer help  
6. Tutor states insufficient evidence when approved content does not answer  

### 8.2 Current implementation snapshot

| Layer | State |
|-------|-------|
| Repository | `client/` stub + `server/` A0–A1 + docs |
| Frontend | Stub only (Week 7+) |
| Backend / API | A3 freeze: auth → analytics; OpenAPI 1.0.0 |
| Database | Migrated through `0002_a2_attempts_progress`; Docker Postgres |
| Marking engine | Shipped (decimal.js; MCQ/numerical/journal) |
| AI / retrieval | Not started |
| Hosting / CI | Paused (CORS ready for Vercel previews) |

*(Update this table as components land.)*

---

## 9. Open decisions (owner / institution)

Track until resolved; move closed items to §11 changelog.

| ID | Decision | Status |
|----|----------|--------|
| DEC-01 | First institution and cohort | Open |
| DEC-02 | Approximate concurrent users | Open |
| DEC-03 | ACC101/102 topic map | Open |
| DEC-04 | University email vs course invitation | **Resolved — university email** |
| DEC-05 | Institutional vs independent ownership | Open (later) |
| DEC-06 | Hosting location | **Paused** until local dev OK (target remains Vercel + Railway) |
| DEC-07 | Privacy & retention rules | Open (later discussion) |
| DEC-08 | Offline downloads allowed? | Open |
| DEC-09 | Sample notes + five representative question types + marking rules + alternates | Open |
| DEC-10 | Who reviews question bank and AI responses | Open |
| DEC-11 | Milestone dates, budget ceiling, IP ownership, maintenance, support | Open |
| DEC-12 | Product branding / final name | **Resolved — Folio** |
| DEC-13 | Fixed-price estimate: phases 0–1 vs phase 2 | Open |

---

## 10. How to maintain this profile

1. **Ship a capability** → set status to `shipped`; note release/date in changelog  
2. **Change behaviour** → update the relevant capability row and architecture rule; bump profile version (semver: MAJOR = breaking product contract, MINOR = new capability, PATCH = clarification)  
3. **Defer or cut** → set `post-pilot`, `deferred`, or `removed`; never silently delete history of shipped features  
4. **Close a decision** → mark resolved in §9 and record outcome in changelog  
5. **Keep `concept.md`** as historical proposal; this file is the operational centre going forward  

---

## 11. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-10-03 | 0.1.0 | Initial system profile created from `concept.md` — Phase 0 baseline |
| 2026-10-03 | 0.2.0 | Product name set to **Folio**; DEC-12 closed |
| 2026-10-12 | 0.3.0 | Locked stack (recommended), session-cookie auth, uni-email enrolment; hosting/privacy paused; A0 started |
| 2026-10-12 | 0.4.0 | A1 domain API shipped locally (courses → questions) |
| 2026-10-12 | 0.5.0 | A2 marking + attempts + progress/analytics |
| 2026-10-12 | 0.6.0 | A3 api-v1.0 OpenAPI freeze; CORS + rate limits |

---

## 12. Quick reference — hard product invariants

These should not change without explicit owner + academic sign-off:

1. Lecturers control course content, answer keys, and assessment feedback.  
2. The **marking engine** is the authority for accounting correctness; AI explains, it does not invent marks.  
3. AI answers must be grounded in **approved, versioned** materials and reviewed solutions, with citations.  
4. Journal-entry practice with **component-level** feedback is a first-release requirement.  
5. Student learning records and tutor chats are private; admins do not routinely read conversations.  
6. Practice and summative assessment remain separable modes.  
7. Expand beyond the pilot only after classroom evaluation sign-off.  
