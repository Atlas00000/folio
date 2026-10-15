# Folio — Pages

Living tracker for product surfaces. Update when pages or sections are **added**, **removed**, or **redesigned**.  
Names are what learners and staff see — not implementation detail.

| Field | Value |
|-------|--------|
| Product | Folio |
| Updated | 2026-10-15 |
| Shell | Dual layout: desktop top rail · mobile top bar + bottom dock (`design/shells/`) |
| Primary audience (pilot) | First-year accounting students; lecturers / TAs; limited admin |

---

## Main pages (5)

The spine of the student product. Homepage is included.

| # | Page | Purpose | Route (tracker) | Status |
|---|------|---------|-----------------|--------|
| 1 | **Homepage** | Entry redirect — guests → Sign in; signed-in → role courses | `/` | Live (redirect) |
| 2 | **My Courses** | Enrolment hub: portfolio mastery strip, ledger, continue, topics, recent practice, join | `/student/courses` | Live |
| 3 | **Course home** | Module cockpit: masthead, continue-in-course, progress snapshot, topic ledger, materials/practice peeks, tutor rail | `/student/courses/[courseId]` | Live (revamped) |
| 4 | **Practice** | Attempt a question (journal, multiple choice, or numerical) and get precise feedback | `/student/courses/[courseId]/practice/[questionId]` | Live |
| 5 | **My Progress** | Mastery instruments: full spine, attempt volume, correct-rate bars + topic ledger | `/student/courses/[courseId]/progress` | Live (revamped) |

---

## Main sections (6)

Reusable building blocks that appear inside main (and related) pages. Folio-specific — not generic marketing blocks.

| # | Section | What it does for the user | Typically appears on |
|---|---------|---------------------------|----------------------|
| 1 | **Study materials** | Open lecturer-approved notes, slides, summaries, and video links by topic | Course home, Topic |
| 2 | **Practice questions** | Choose and attempt published questions for a topic | Topic, Practice |
| 3 | **Feedback & second chance** | See what went wrong (account, debit/credit, amount); use a hint; retry; reveal a worked explanation when allowed | Practice |
| 4 | **Progress snapshot** | Scores and mastery cues; suggested next practice | My Progress, Course home (summary) |
| 5 | **Learning assistant** | Hint-first help grounded in approved course materials, with sources when available | Learning assistant page; may sit beside Practice later |
| 6 | **Course insight** | For teaching staff: where the cohort struggles by topic | Staff course views, Course insight |

---

## Other pages

### Access & account

| Page | Purpose | Route | Status |
|------|---------|-------|--------|
| Sign in | University email and password | `/login` | Live |
| Create account | Register with university email | `/register` | Live |
| Forgot password | Request a reset link | `/forgot-password` | Live |
| Reset password | Set a new password from a link | `/reset-password` | Live |
| Offline | Shown when the app cannot reach the network | `/offline` | Live |

### Student (beyond the main five)

| Page | Purpose | Route | Status |
|------|---------|-------|--------|
| Join a course | Enrol with a course join code | `/student/join` | Live |
| Topic | Study cockpit: masthead, progress signal, reading focus, materials + practice ledgers, neighbours, tutor | `/student/courses/[courseId]/topics/[topicId]` | Live (revamped) |
| Learning assistant | Hint-first tutor: charter, ask blotter, citations, coverage, weak footholds | `/student/courses/[courseId]/tutor` | Live (revamped) |

### Teaching staff

| Page | Purpose | Route | Status |
|------|---------|-------|--------|
| Staff courses | Courses the lecturer or TA manages | `/lecturer/courses` | Live |
| New course | Create a course for a term | `/lecturer/courses/new` | Live |
| Staff course home | Topics, enrolment overview, links to insight and assistant oversight | `/lecturer/courses/[courseId]` | Live |
| Staff topic | Upload materials; build and publish the question bank | `/lecturer/courses/[courseId]/topics/[topicId]` | Live |
| Course insight | Topic-level difficulty patterns for the cohort | `/lecturer/courses/[courseId]/analytics` | Live |
| Assistant oversight | Preview help behaviour; review responses that need attention | `/lecturer/courses/[courseId]/tutor` | Live |

### Administration

| Page | Purpose | Route | Status |
|------|---------|-------|--------|
| Admin courses | Course administration overview | `/admin/courses` | Live |

---

## How to maintain this file

1. **Add** a row when a new user-facing page ships (or is firmly planned).  
2. **Remove or mark retired** when a page is deleted.  
3. Keep the **Main pages (5)** and **Main sections (6)** lists tight — promote or demote only when the product spine changes.  
4. Put everything else under **Other pages**.  
5. Status values: `Live` · `In design` · `Planned` · `Retired`.

### Changelog

| Date | Change |
|------|--------|
| 2026-10-14 | Initial inventory from product docs and current client routes |
| 2026-10-14 | Homepage: guests → Sign in; signed-in → role courses |
| 2026-10-14 | My Courses: Course list → modular CourseLedger (real API fields) |
| 2026-10-14 | My Courses hub: SessionLine, Continue, Topics, Recent practice, JoinRail |
| 2026-10-14 | ACC101 curriculum: revamped topic 1 + 10 further FA topics (seed:acc101) |
| 2026-10-14 | ACC102–ACC110 suite seeded (9 courses × 4 topics); `pnpm db:seed:acc-suite` |
| 2026-10-15 | Course + topic page design brief: [`course-and-topic-page-design.md`](./course-and-topic-page-design.md) |
