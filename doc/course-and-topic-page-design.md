# Folio — Course & Topic Page Design and Contents

Living design brief for student **Course home** and **Topic** surfaces.  
Names are learner-facing. Build against real API / DB fields only — no placeholders, clip art, or emoji.

| Field | Value |
|-------|--------|
| Product | Folio |
| Updated | 2026-10-15 |
| Companion | [`pages.md`](./pages.md) · theme: Verdigris Day / Carbon Night · [`UI_PHILOSOPHY.md`](../client/src/design/UI_PHILOSOPHY.md) |
| Course focus (example) | `/student/courses/{courseId}` e.g. ACC101 home |
| Topic focus (canonical) | `/student/courses/6ad754d8-112d-4753-b5ca-d8b069ad84bb/topics/6b4f7f25-594e-4b9c-8d02-aa338822d5c1` — use this topic as the visual/content centreline for **all** other topic pages |
| Viz stack (optional) | **D3** for analytical 2D; **Three.js** only where spatial depth earns clarity — never ornamental |

---

## Principles

1. **Hug the backend** — course, topic, materials, questions, progress, attempts only.  
2. **One job per section** — accounting study / practice / progress / help.  
3. **Ledger language** — asymmetric, hairline structure; not Bootstrap card stacks.  
4. **Reuse hub patterns** where they already work (continue blotter, ledger rows, peeks).  
5. **Obvious difference** when redesigning — subtle restyles fail acceptance.  
6. **No generic LMS filler** — no “welcome widgets,” calendars, tip carousels, or fake activity feeds.  
7. **Viz is instrument, not décor** — charts/scenes only when they explain mastery, attempts, or an accounting idea already in scope; respect `prefers-reduced-motion`; paint with Folio tokens only.

---

## A. Course home

**Route:** `/student/courses/[courseId]`  
**Job:** Course cockpit — identity, what to practise next *in this module*, topic spine, progress, light peeks into materials/practice/assistant.

### Current (implemented)

Modular under `client/src/features/courses/home/` — masthead, continue blotter (scoped), progress snapshot, topic ledger, materials/practice peeks, assistant rail. Real APIs only.

### Strong fits — sections

| # | Section | Purpose | Real data sources | Notes |
|---|---------|---------|-------------------|--------|
| 1 | **Course masthead** | Name the module clearly | `code`, `title`, `term`, `status`, `description` | Not “Welcome to the course” |
| 2 | **Continue in this course** | Next topic to practise *here* | `progress/me` for this course; topic title, sequence, mastery, weak/untried | Reuse continue blotter, scoped to one course |
| 3 | **Topic ledger** | Main spine of the module | Topics + per-topic progress when available | Replace boxed list; sequence, title, description peek, mastery/attempts |
| 4 | **Progress snapshot** | How this enrolment is going | Aggregates from `progress/me` | Attempted count, avg/weak mastery; link to full Progress |
| 4a | **Mastery spine (D3)** | See strength along the module at a glance | Same `progress/me` rows | Hairline sequence band — see §G |
| 5 | **Study materials peek** | Lecturer-approved reading for next/active topic | Materials for continue topic (or first topics) | Titles/types only — full list on Topic |
| 6 | **Practice foothold** | Jump into a real question | First published question on continue topic | Type + difficulty zone → Practice URL |
| 7 | **Learning assistant entry** | Ask about *this* module’s materials | Link to course Tutor | Quiet rail — not an embedded chat dump |

### Suggested page composition

```
[ Course masthead ]
[ Continue in this course ]
[ Progress snapshot + mastery spine (D3) ]
[ Topic ledger ]          ← primary volume
[ Materials peek | Practice foothold ]  (optional secondary row)
[ Learning assistant entry ]
```

### Build order (course)

1. Masthead + Topic ledger (kill boxed Panel) ✓  
2. Continue in this course + Progress snapshot ✓  
3. Materials peek + Practice foothold ✓  
4. Assistant entry ✓  
5. Mastery spine (D3) — next analytical layer  

### Out of scope on course home

- Cohort / staff analytics  
- Join code / other courses (belongs on My Courses)  
- Full materials library or full question bank (belongs on Topic)  
- Motivational tips, schedules, notification centres  
- Particle fields, globe toys, or 3D that does not map to progress rows

---

## B. Topic page

**Route:** `/student/courses/[courseId]/topics/[topicId]`  
**Canonical focus URL:**  
`http://localhost:3000/student/courses/6ad754d8-112d-4753-b5ca-d8b069ad84bb/topics/6b4f7f25-594e-4b9c-8d02-aa338822d5c1`  

**Job:** Study *this* concept — approved materials, then practice questions, with topic-level progress and a path to help. Every other topic page should match this layout and section set.

### Current (implemented)

Modular under `client/src/features/courses/topic/` — masthead + crumb, topic progress signal, reading focus, materials ledger, practice start, question ledger, recent attempts (capped fetch), neighbours, assistant rail. Canonical focus URL sets the pattern.

### Strong fits — sections

| # | Section | Purpose | Real data sources | Notes |
|---|---------|---------|-------------------|--------|
| 1 | **Topic masthead** | Orient within the course | Topic `sequence`, `title`, `description`; parent course `code` / `title` | Breadcrumb: Courses → ACC101 → Topic |
| 2 | **Topic progress signal** | Mastery for *this* topic only | Matching row from `progress/me` | Attempts, correct, mastery, weak/untried/solid — same signal language as hub |
| 2a | **Attempt rhythm (D3)** | When you practised this topic | Attempt `submittedAt` + correct flags | Sparse timeline under the signal — see §G |
| 3 | **Study materials ledger** | Lecturer-approved content for this topic | Materials: `title`, `type`, `status`, `version`, body/url/download | Ledger rows, not equal cards; published only for students |
| 4 | **Reading focus** | Surface the primary summary / first material | First published text summary or featured material | Inline readable body when present — accounting notes, not lorem |
| 4a | **Concept instrument (D3 / rare Three)** | Teach *this* idea spatially when the topic warrants it | Topic `title`/`description` + material body; typed by topic kind | Opt-in per topic family (CVP, cost mix, T-accounts) — see §G |
| 5 | **Practice question ledger** | Attempt work for this topic | Questions: `type`, `prompt`, `difficulty`, `marks`, `status` | Zone badges (intro/core/stretch); link each to Practice |
| 5a | **Zone mix (D3)** | How hard the published bank is | Question `difficulty` counts | Tiny stacked hairline — intro / core / stretch |
| 6 | **Start / continue practice** | One clear next action | First untried or lowest-mastery path; or first published question | Deep-link to `/practice/[questionId]` |
| 7 | **Recent attempts on this topic** | What happened last time here | Attempts for questions in this topic (when fetchable) | Correct/incorrect + short feedback cues — no fake feed |
| 8 | **Learning assistant (topic-scoped)** | Hint-first help grounded in *these* materials | Tutor ask with topic context / link into Tutor | Optional; keep secondary to materials + practice |
| 9 | **Topic neighbours** | Move along the spine | Prev / next topic by `sequence` | Keeps ACC101 (and others) navigable without returning only to course home |

### Suggested page composition

```
[ Topic masthead + course crumb ]
[ Topic progress signal + attempt rhythm (D3) ]
[ Reading focus ]              ← primary study surface when a summary exists
[ Concept instrument ]         ← only when topic family has a typed viz
[ Study materials ledger ]     ← other / all materials
[ Start / continue practice ]
[ Practice question ledger + zone mix (D3) ]
[ Recent attempts on this topic ]  (when data exists)
[ Topic neighbours | Assistant entry ]
```

### Build order (topic)

1. Masthead + progress signal + materials ledger ✓  
2. Reading focus + practice question ledger + start/continue CTA ✓  
3. Neighbours ✓  
4. Recent attempts ✓  
5. Topic-scoped assistant entry ✓  
6. Attempt rhythm + zone mix (D3)  
7. Concept instruments (topic-family, one at a time)  

### Out of scope on topic page

- Full course topic list dump (link back to course home)  
- Staff publish/withdraw controls (lecturer surfaces)  
- Summative exam framing — this is formative practice  
- Decorative illustration / emoji empty states — copy + skeletons only  
- Generic “knowledge graph” globes or mascot 3D unrelated to the topic

---

## C. Shared section → product map

Aligns with `pages.md` main sections:

| Product section | Course home | Topic |
|-----------------|-------------|--------|
| Study materials | Peek | Full ledger + reading focus |
| Practice questions | Foothold | Full ledger + start CTA + zone mix |
| Feedback & second chance | — | Via Practice; recent attempts + attempt rhythm |
| Progress snapshot | Yes + mastery spine | Topic signal + attempt rhythm |
| Learning assistant | Course entry | Topic-scoped entry |
| Course insight | Staff only | — |
| Concept instruments | — | Topic-family D3 / rare Three |

---

## D. Visual / interaction notes

- Match My Courses / continue blotter: hairline rules, asymmetric columns, tabular mastery, quiet outline actions.  
- Width: inherit app shell (~75vw content max).  
- Motion: `PageEnter` staging; `NumberTick` for mastery; respect `prefers-reduced-motion`.  
- Empty/loading: `EmptyState` / `Skeleton*` — never clip art.  
- Charts/scenes: stroke `--folio-hairline*`, fill `--folio-signal-dim` / `--folio-ok-dim` / `--folio-warn-dim` / `--folio-halt-dim`; mono labels; no purple neon, no glossy card chrome.

---

## G. Analytical & visual additions (D3 / Three.js)

Optional layer on top of the shipped ledgers. **Default library is D3.** Three.js only when a second spatial axis genuinely clarifies an accounting idea — and still painted like a blotter instrument, not a game.

### G.0 Guardrails (non-negotiable)

| Rule | Detail |
|------|--------|
| Real data | Bind only to `progress/me`, attempts, questions, topics, or numbers already in published materials — no fake series |
| One job | Each viz answers one question (where am I weak? when did I practise? where is break-even?) |
| Theme | Folio CSS variables only; hairline grids; tabular mono for ticks |
| Motion | Explain state; freeze or opacity-only under `prefers-reduced-motion` |
| Density | Compact — sit *inside* an existing section, do not become a dashboard wall |
| A11y | Visible text twin for every chart (table or sentence); keyboard focus on interactive marks |
| Bundle | Lazy-load viz modules; keep course/topic shells light without charts |
| Kill | Particle logos, earth globes, avatar 3D, “engagement heatmaps” without attempts, confetti |

### G.1 Course home — strong analytical fits

| Priority | Addition | Lib | Bound to | What the learner sees | Theme treatment |
|----------|----------|-----|----------|------------------------|-----------------|
| **P0** | **Mastery spine** | D3 | `progress/me` per topic sequence | Horizontal band: each topic a tick; height or fill = mastery; warn for weak, faint for untried; click → topic | Asymmetric under Progress snapshot; no axes chrome beyond faint baseline |
| **P1** | **Attempt load spark** | D3 | Sum of `attemptsCount` by topic | Tiny area/line along the same spine — volume of practice, not vanity “streak” | Hairline fill `--folio-signal-dim`; tooltip: `correct/attempts` |
| **P2** | **Module terrain (optional)** | Three | Same progress rows | Low extruded bars / ridge along sequence in perspective — depth = mastery | Orthographic-ish camera; no orbit gimmick; static under reduced motion; must duplicate spine data as text |

Skip Three on course home unless the D3 spine already ships and the 3D pass is clearly stronger in usability testing.

### G.2 Topic page — strong analytical fits

| Priority | Addition | Lib | Bound to | What the learner sees | Theme treatment |
|----------|----------|-----|----------|------------------------|-----------------|
| **P0** | **Attempt rhythm** | D3 | Recent attempts’ `submittedAt` + `correct` | Sparse time axis with ok/halt marks — “when I last worked this topic” | Under progress signal; empty = omit entire viz |
| **P1** | **Zone mix** | D3 | Published questions’ `difficulty` | Stacked hairline (intro / core / stretch counts) | Beside question ledger header; labels via `labelForZone` |
| **P1** | **Marking pulse** | D3 | Latest attempts correct ratio | Single radial or arc gauge 0–100 beside mastery NumberTick | Shares signal colours (untried/weak/solid); not a second competing KPI |

### G.3 Concept instruments (topic-family, opt-in)

Only when the **topic title / description / material** is clearly in that family. One instrument per topic max. Prefer D3; Three only for the journal spatial case.

| Family | Example topics | Lib | Instrument | Inputs | Why it belongs |
|--------|----------------|-----|------------|--------|----------------|
| **CVP / break-even** | Cost–volume–profit | D3 | Revenue vs total cost lines; break-even mark; optional contribution wedge | Price, VC, FC from material body or a published numerical stem (parse carefully — no invented numbers) | Classical managerial accounting figure; interactive scrub of volume |
| **Cost behaviour** | Cost classification | D3 | Fixed / variable / mixed total-cost vs activity | Schematic from reading focus (labelled slopes) | Reinforces reading; static diagram first, drag activity second |
| **Flexible budget / variance** | Flexible budgets | D3 | Static vs flexible vs actual bars | Figures only if present in materials or a journal/numerical key the student already saw | Variance as signal bars (ok / warn / halt), not rainbow |
| **Journal / T-accounts** | Double-entry topics | D3 first; **Three optional** | Two-column T-account ledger; optional shallow 3D planes for Debit / Credit sides when lines animate in | Student attempt lines or worked reveal | Spatial debit/credit is the rare Three justification — still hairline, not neon glass |
| **Mix / contribution** | Pricing, product mix | D3 | Stacked contribution or mix pie **only if ≤4 segments** and numbers are real | Material or question marks | Prefer stacked bar over pie; kill if it becomes decoration |

Do **not** invent instruments for every ACC code. Unlisted topics keep reading + practice only.

### G.4 Practice page (adjacent — document for later)

Not part of course/topic build order, but same viz grammar:

| Addition | Lib | Use |
|----------|-----|-----|
| Debit–credit balance meter | D3 | Live sum of journal lines — imbalance = halt tone |
| Numerical tolerance band | D3 | Accepted range vs student value (when key exposes it post-submit) |
| MCQ option residual | D3 | After mark: quiet bar of option popularity **only if** we ever expose cohort stats (staff insight) — students stay personal |

### G.5 Suggested module map (code)

```
client/src/features/courses/viz/     ← lazy islands only
  tokens.ts                          ← map Folio CSS vars → D3/Three colours
  MasterySpine.tsx                   ← course home P0
  AttemptRhythm.tsx                  ← topic P0
  ZoneMix.tsx                        ← topic P1
  instruments/
    CvpBreakEven.tsx
    CostBehaviour.tsx
    JournalTAccount.tsx              ← D3; Three variant behind flag
```

### G.6 Build order (viz)

1. **Mastery spine** (course) + **Attempt rhythm** (topic) — pure progress/attempt analytics  
2. **Zone mix** + marking pulse  
3. **CVP instrument** on the canonical managerial topic that already teaches break-even  
4. **Journal T-account** (D3) on practice/topic where type=`journal` dominates  
5. Three.js terrain / T-account depth **only after** 1–4 prove useful  

### G.7 Explicit non-fits

- Cohort leaderboards or social heatmaps on student course/topic pages  
- Decorative WebGL backgrounds behind mastheads  
- “AI brain” meshes for the tutor rail  
- Force-directed graphs of all materials/questions  
- Any viz that needs mock data to look alive  

---

## H. Learning assistant (student tutor)

**Route:** `/student/courses/[courseId]/tutor`  
**Focus example:** `/student/courses/e5ee72e9-1700-4b1b-b58e-4ab309c5173b/tutor`  
**Job:** Hint-first help grounded only in **published** materials for this enrolment — citations, honest refusal, path back to study/practice. Not a general chatbot.

### Build plan

| Step | Sections | Status |
|------|----------|--------|
| 1 | Masthead + grounding charter + Ask blotter + Reply instrument + Citation ledger | Done |
| 2 | Context chip (`topicId` / `questionId` query) + after-hint actions | Done |
| 3 | Coverage peek + weak/continue footholds + suggested prompts | Done |
| 4 | Practice-side “Ask for a hint” deep-link polish | Later |

### Strong fits

| # | Section | Real data | Notes |
|---|---------|-----------|--------|
| 1 | **Tutor masthead** | Course `code` / `title` / `term` | Crumb: Courses → ACC### → Tutor |
| 2 | **Grounding charter** | Product rules mirroring API | Hints only; no invented marks/journals; may refuse |
| 3 | **Context chip** | `?topicId=` / `?questionId=` + topic/question fetch | Optional; pass `questionId` into `ask` |
| 4 | **Ask blotter** | `POST …/tutor/ask` `message` | Kill Panel; Folio Field/Button |
| 5 | **Reply instrument** | `reply`, `state`, `insufficientEvidence` | Hint vs insufficient — not chat bubbles |
| 6 | **Citation ledger** | `citations[]` + `materialId` | Link into topic materials when mapped |
| 7 | **After-hint actions** | Citation topic + continue/practice | Open material topic · Practise · Course progress |
| 8 | **Coverage peek** | Published materials count / titles | What the tutor can see |
| 9 | **Weak / continue footholds** | `progress/me` + continue select | Prefill ask from real weak topic |
| 10 | **Suggested prompts** | Topic / material titles | Course-scoped stems only |

### Composition

```
[ Tutor masthead ]
[ Grounding charter ]
[ Context chip ]              ← when deep-linked
[ Ask blotter + suggested prompts ]
[ Reply + state ]
[ Citation ledger ]
[ After-hint actions ]
[ Coverage peek | Weak footholds ]
```

### Out of scope

- Staff flags / reindex / preview  
- Fake thread inbox (no student thread list API yet)  
- Open-web answers, avatars, “AI brain” décor  

---

## E. Acceptance (when we build)

- [x] Course home no longer reads as a single boxed topic list  
- [x] Topic canonical URL sets the pattern copied by all other topics  
- [x] Every section maps to a real API field or documented empty state  
- [x] Difference vs old UI is obvious in under 2 seconds  
- [x] No generic LMS chrome; Folio ledger language throughout  
- [x] Next: mastery spine + attempt rhythm use real progress/attempt fields only  
- [ ] Concept instruments gated by topic family; no orphan decorative Three scenes  
- [x] Every viz has a text alternative; reduced-motion safe  

---

## F. Changelog

| Date | Change |
|------|--------|
| 2026-10-15 | Initial course + topic strong fits; canonical topic focus URL locked |
| 2026-10-15 | Course home strong fits implemented (`features/courses/home/`) |
| 2026-10-15 | Topic page strong fits implemented (`features/courses/topic/`) |
| 2026-10-15 | §G analytical/visual additions (D3 primary, Three rare); strong-fit rows 4a/2a/4a/5a |
| 2026-10-15 | P0 viz: MasterySpine (course) + AttemptRhythm (topic) via `features/courses/viz/` |
| 2026-10-15 | Progress page: full MasterySpine + AttemptVolumeSpark + CorrectRateBars (`features/courses/progress/`) |
| 2026-10-15 | My Courses hub: PortfolioMasteryStrip (avg mastery per enrolment) |
| 2026-10-15 | §H Learning assistant plan + student tutor UI (`features/courses/tutor/`) |
| 2026-10-15 | Special surfaces: FolioLoadingScreen + FolioNotFound (`design/special/`) |
| 2026-10-15 | Dual shell: desktop top rail + mobile top bar / tab dock / more sheet |
