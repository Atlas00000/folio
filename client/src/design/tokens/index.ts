/** JS-side token names — keep in sync with CSS + UI_PHILOSOPHY.md */

export const color = {
  void: 'var(--folio-void)',
  canvas: 'var(--folio-canvas)',
  plane: 'var(--folio-plane)',
  planeRaised: 'var(--folio-plane-raised)',
  hairline: 'var(--folio-hairline)',
  hairlineStrong: 'var(--folio-hairline-strong)',
  ink: 'var(--folio-ink)',
  inkMuted: 'var(--folio-ink-muted)',
  inkFaint: 'var(--folio-ink-faint)',
  signal: 'var(--folio-signal)',
  signalDeep: 'var(--folio-signal-deep)',
  signalDim: 'var(--folio-signal-dim)',
  warn: 'var(--folio-warn)',
  warnDim: 'var(--folio-warn-dim)',
  halt: 'var(--folio-halt)',
  haltDim: 'var(--folio-halt-dim)',
  ok: 'var(--folio-ok)',
  okDim: 'var(--folio-ok-dim)',
} as const;

export const toneClass = {
  ink: 'text-[var(--folio-ink)]',
  muted: 'text-[var(--folio-ink-muted)]',
  faint: 'text-[var(--folio-ink-faint)]',
  signal: 'text-[var(--folio-signal)]',
  warn: 'text-[var(--folio-warn)]',
  halt: 'text-[var(--folio-halt)]',
  ok: 'text-[var(--folio-ok)]',
} as const;

export type Tone = keyof typeof toneClass;
