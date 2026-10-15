# Folio UI Philosophy — Ledger Noir + Signal Teal

## North star

Folio should feel like an **executive trading OS for accounting practice**: dark, precise, hairline-structured, signal-driven. Every screen reads as one instrument panel — not a Bootstrap admin, not a campus brochure, not crypto-neon, not AI-purple. Content planes lift off a void canvas; accent appears only when the system has something to say (CTA, state, gate).

## Feel adjectives

Precise · Quietly intense · Instrumental · Asymmetric · Ledger-clean · Signal-led · High-trust

## Kill list (never ship)

- Equal card stacks / boxed admin grids as the default language
- Cream/paper academic wash, forest-green campus brochure accents
- Purple-indigo gradients, neon cyan glow walls, glassmorphism stacks
- Clip art, stock illustrations, emoji, decorative Lorem
- Motion that entertains instead of explaining state
- One-off page art that bypasses tokens/primitives
- Flat white forms with thick gray borders

## Palette tokens

| Token | Role | Value (reference) |
|-------|------|-------------------|
| `--folio-void` | Deepest canvas | `#07090c` |
| `--folio-canvas` | App background | `#0c1014` |
| `--folio-plane` | Content plane | `#121820` |
| `--folio-plane-raised` | Lifted plane / chrome | `#181f2a` |
| `--folio-hairline` | Structure | `rgba(232,237,244,0.08)` |
| `--folio-hairline-strong` | Active edge | `rgba(232,237,244,0.16)` |
| `--folio-ink` | Primary text | `#e8edf4` |
| `--folio-ink-muted` | Secondary | `#8b97a8` |
| `--folio-ink-faint` | Tertiary / labels | `#5c6878` |
| `--folio-signal` | Accent / CTA / live | `#2ec4b6` |
| `--folio-signal-deep` | Pressed / deep | `#1a9e93` |
| `--folio-signal-dim` | Soft signal wash | `rgba(46,196,182,0.12)` |
| `--folio-warn` | Caution (sparingly) | `#d4a017` |
| `--folio-halt` | Error / stop | `#e85d5d` |
| `--folio-ok` | Confirmed correct | `#3ecf8e` |

Legacy aliases (`--paper`, `--ink`, `--accent`, …) remap to this system so existing pages inherit the shift immediately.

## Typography

| Role | Face | Notes |
|------|------|-------|
| Display | Instrument Serif | Brand, page titles — sober, distinctive |
| Body | IBM Plex Sans | UI copy, forms |
| Mono / metrics | IBM Plex Mono | Tabular nums, codes, scores (`font-variant-numeric: tabular-nums`) |

## Motion grammar

| Primitive | When | Rule |
|-----------|------|------|
| `PageEnter` | Route mount | Staged opacity + slight Y; 280–420ms ease-out |
| `NumberTick` | Metric change | Digits settle; no bounce |
| `StateCrossfade` | Badge / gate / status swap | Crossfade ≤200ms |
| Route continuity | Shell persists | Chrome stays; only main stages |

Respect `prefers-reduced-motion: reduce` → instant or opacity-only.

## Layout grammar

- **Asymmetric shells**: brand + action rail, not centered equal columns
- **Hairline structure** over heavy borders/shadows
- **Lifted planes** for interactive surfaces; void for canvas
- Accent = signal only (primary CTA, live state, gate allow)

## Modular file map

```
client/src/design/
  UI_PHILOSOPHY.md
  tokens/          color, space, type, motion, elevation (+ CSS entry)
  primitives/      Surface, Text, Button, Input, Badge, Icon
  motion/          PageEnter, NumberTick, StateCrossfade
  shells/          AppShell, PageHeader, ActionRail
  patterns/        MetricStrip, EmptyState, Skeleton
  map/             backend-ui.ts  (API enums → visual tokens)
```

Compose: **tokens → primitives → patterns → shells → pages**.

## Backend ↔ UI mapping

| Domain | API values | Visual |
|--------|------------|--------|
| Course lifecycle | `draft` / `active` / `archived` | faint / signal / muted |
| Publication | `unpublished` / `published` / `withdrawn` | warn-dim / ok / faint |
| Difficulty zone | `intro` / `core` / `stretch` | muted / ink / signal |
| Attempt gates | `canRetry` / `canRequestHint` / `canReveal` | signal allow vs faint skip |
| Mark outcome | `correct` true/false | ok / halt |
| User status | `active` / `pending` / `disabled` | ok / warn / faint |
| Enrolment | `active` / `withdrawn` | ok / faint |

Helpers live in `design/map/backend-ui.ts` — pages consume helpers, not raw color hex.

## Out of scope (this phase)

- Section-by-section content layout overhauls
- New product features, API changes, illustration systems
- Light-mode toggle (dark ledger is the locked system for now)
- Full icon library / chart redesign

Later workstreams restyle page interiors on top of this foundation.

## Acceptance checklist (UI-T10)

- [ ] Dark canvas + signal teal readable in under 2s vs old cream/green
- [ ] AppShell hairline chrome on student / lecturer / admin routes
- [ ] Login proves asymmetric split + Instrument Serif brand
- [ ] Legacy pages inherit via `--paper` / `--ink` / `--accent` aliases
- [ ] Keyboard `:focus-visible` uses signal ring
- [ ] `prefers-reduced-motion` collapses enter/tick durations
- [ ] Empty/loading use copy + skeletons only (no emoji/clip art)
- [ ] Token names in CSS match this document
- [ ] No section content layouts rewritten in this phase
