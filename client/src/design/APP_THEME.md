# Folio — App Theme Options

Status: **custom hybrid in use** (see Decision log). Options A–E below are the shortlist that led here.

Goal: refined, visually stunning, unmistakably Folio — **not** generic AI dark-mode (void + cyan/teal), not purple gradients, not cream-terracotta brochure, not crypto neon.

Product feel to preserve: executive ledger / practice instrument — precise, quiet confidence, metric-readable.

---

## Active — Custom hybrid (D light + B dark)

**Name:** Verdigris Day / Carbon Night  

**Vibe:** Daytime = museum graphite with restrained patina green. Night = editorial carbon with ink-blue signal. Same roles across modes; accent hue changes with theme on purpose.

| Role | Light (D — Graphite & Verdigris) | Dark (B — Carbon & Bone) |
|------|----------------------------------|---------------------------|
| Canvas | `#EFEFEB` | `#0E0F10` |
| Plane / raised | `#F7F7F4` / `#FFFFFF` | `#17181A` / `#1F2124` |
| Ink | `#161A18` | `#ECEAE6` |
| Muted | `#5E6661` | `#8B8F98` |
| Hairline | `#C8CBC5` | `#2C2E33` |
| Accent | `#3D6B5E` verdigris | `#7A9BC7` ink-blue |
| Accent deep | `#2F544A` | `#5A7A9E` |
| Warn | `#8F7328` | `#C4A035` |
| Halt | `#8C4038` | `#E07070` |
| OK | `#3D6B5E` | `#6FA88A` |

Implemented in `design/tokens/color.css`.

---

## Option A — Obsidian & Copper Ledger

**Vibe:** Private banking desk after hours. Warm metal on near-black; serious, tactile, grown-up finance. Accent is *metal*, not “tech glow.”

| Role | Light | Dark |
|------|-------|------|
| Canvas | `#F4F0EA` warm stone | `#12100E` obsidian |
| Plane / raised | `#FFFBF7` / `#EBE6DE` | `#1C1916` / `#25211D` |
| Ink | `#1A1612` | `#F2EDE6` |
| Muted | `#6B635A` | `#9A9186` |
| Hairline | `#D9D2C8` | `#3A342E` |
| Accent (copper) | `#9A5B2F` | `#C4844A` |
| Accent deep | `#7A4524` | `#A86B38` |
| Warn | `#A67C2D` | `#D4A84B` |
| Halt | `#9B3B32` | `#D1655A` |
| OK / confirm | `#3F6B4E` | `#7A9F82` |

**Typography pairing hint:** Display serif with slight warmth (e.g. Newsreader / Source Serif) + clean grotesque body; mono for figures in copper-muted ink.

**Why it wins:** Copper reads as ledger/brass hardware, not SaaS teal. Warm dark avoids “gaming HUD.”

---

## Option B — Carbon & Bone Editorial

**Vibe:** Financial Times meets a quiet terminal. High-contrast editorial; bone paper planes on carbon; one disciplined accent (ink-blue or oxblood — choose one and lock it).

| Role | Light | Dark |
|------|-------|------|
| Canvas | `#EDEAE4` bone wash | `#0E0F10` carbon |
| Plane / raised | `#F7F5F1` / `#E2DED6` | `#17181A` / `#1F2124` |
| Ink | `#121314` | `#ECEAE6` |
| Muted | `#5C5F66` | `#8B8F98` |
| Hairline | `#C9C5BC` | `#2C2E33` |
| Accent (ink blue) | `#1F3A5F` | `#7A9BC7` |
| Accent deep | `#152A45` | `#5A7A9E` |
| Warn | `#8A6A1F` | `#C4A035` |
| Halt | `#8C2F2F` | `#E07070` |
| OK | `#2F5D45` | `#6FA88A` |

**Alternate accent (oxblood, same structure):** Light `#6E2A2A` · Dark `#C45C5C`

**Why it wins:** Extremely restrained; looks like publishing + markets, not a startup template.

---

## Option C — Midnight Navy & Champagne

**Vibe:** Quiet luxury / executive suite. Deep navy (not pure black), champagne highlight, almost no “UI neon.” Soft gold used sparingly for CTA and key metrics.

| Role | Light | Dark |
|------|-------|------|
| Canvas | `#EEF1F6` cool mist | `#0B1220` midnight |
| Plane / raised | `#F8FAFC` / `#E4E9F1` | `#121A2B` / `#1A2438` |
| Ink | `#141C2B` | `#E8EEF7` |
| Muted | `#5A6578` | `#8E9BB0` |
| Hairline | `#C5CDD9` | `#2A354A` |
| Accent (champagne) | `#8B7355` | `#D4C4A8` |
| Accent deep | `#6F5A42` | `#B8A68A` |
| Warn | `#9A7B2F` | `#E0C56A` |
| Halt | `#8E3A42` | `#E07A84` |
| OK | `#2E5A4C` | `#7EB5A0` |

**Why it wins:** Feels premium and institutional; champagne on navy is distinctive without shouting.

---

## Option D — Graphite & Verdigris (restrained)

**Vibe:** Museum archive + aged instrument. Cool graphite base; **muted** verdigris (patina green) — never neon teal, never cyan glow. Think oxidized copper on steel, not “AI signal.”

| Role | Light | Dark |
|------|-------|------|
| Canvas | `#EFEFEB` | `#101412` |
| Plane / raised | `#F7F7F4` / `#E3E3DD` | `#171C19` / `#1E2521` |
| Ink | `#161A18` | `#E6EBE7` |
| Muted | `#5E6661` | `#8D9690` |
| Hairline | `#C8CBC5` | `#2C3430` |
| Accent (verdigris) | `#3D6B5E` | `#6F9E8E` |
| Accent deep | `#2F544A` | `#557A6E` |
| Warn | `#8F7328` | `#C9A84A` |
| Halt | `#8C4038` | `#D0786E` |
| OK | `#3D6B5E` (same family) | `#8FBaa8` |

**Hard rule for this option:** No glow, no `#2ec4b6`-class brights, no radial teal blooms behind the hero.

**Why it wins:** Keeps a “ledger green” heritage without the tacky signal-teal we rejected.

---

## Option E — Warm Slate & Saffron Trace

**Vibe:** Contemporary academic instrument — calm warm slate, one sharp saffron trace for CTA/state. Energetic but composed; more “atelier” than “trading HUD.”

| Role | Light | Dark |
|------|-------|------|
| Canvas | `#F1EEE8` | `#141310` |
| Plane / raised | `#FAF8F4` / `#E7E2DA` | `#1C1B18` / `#26241F` |
| Ink | `#1C1A16` | `#F0ECE4` |
| Muted | `#6A645A` | `#9A9388` |
| Hairline | `#D4CEC4` | `#35322C` |
| Accent (saffron) | `#C47A1A` | `#E8A23A` |
| Accent deep | `#9A5E12` | `#C4842A` |
| Warn | `#B8860B` | `#E0B84A` |
| Halt | `#A33B32` | `#E06B60` |
| OK | `#3E6B4F` | `#7BA88A` |

**Why it wins:** Warm and memorable; saffron is rare in EdTech/SaaS templates and photographs well.

---

## Shared rules (all options)

1. **Accent is scarce** — CTA, active state, key metric only.  
2. **Hairlines over heavy shadows** — structure from edges, not card stacks.  
3. **Tabular nums** for scores/amounts; sober display type for brand.  
4. **Light and dark share the same roles** — remap tokens, don’t invent a second product.  
5. **Kill list still applies:** purple-indigo glow, cyan neon, equal Bootstrap cards, emoji/clip art.

## Decision log

| Field | Value |
|-------|--------|
| Chosen option | **Custom hybrid** — Light **D** (Graphite & Verdigris) + Dark **B** (Carbon & Bone, ink-blue) |
| Theme name | Verdigris Day / Carbon Night |
| Light default? | No (toggle available) |
| Dark default? | Yes |
| Date locked | 2026-10-14 (custom combo selected) |

Tokens: `design/tokens/color.css` (`data-theme="dark|light"`). Amend `UI_PHILOSOPHY.md` palette section when foundations are finalized.
