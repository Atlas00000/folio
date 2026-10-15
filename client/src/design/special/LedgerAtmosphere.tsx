'use client';

import type { ReactNode } from 'react';
import type { PointerField } from './usePointerField';

/**
 * Full-bleed ledger void — drifting hairline mesh + pointer-reactive signal wash.
 * Not a card; the entire viewport is the instrument.
 */
export function LedgerAtmosphere({
  pointer,
  accent = 'signal',
  children,
}: {
  pointer: PointerField;
  accent?: 'signal' | 'halt' | 'warn';
  children?: ReactNode;
}) {
  const glow =
    accent === 'halt'
      ? 'var(--folio-halt)'
      : accent === 'warn'
        ? 'var(--folio-warn)'
        : 'var(--folio-signal)';

  const ox = pointer.nx * 36;
  const oy = pointer.ny * 28;

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[var(--folio-void)] text-[var(--folio-ink)]">
      <div
        aria-hidden
        className="folio-special-atmosphere pointer-events-none absolute inset-[-10%] opacity-[0.55]"
        style={{
          transform: `translate3d(${ox}px, ${oy}px, 0)`,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at ${50 + pointer.nx * 30}% ${40 + pointer.ny * 25}%, ${glow}22 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 80% 90%, var(--folio-void) 0%, transparent 60%),
            linear-gradient(180deg, var(--folio-void) 0%, var(--folio-canvas) 45%, var(--folio-void) 100%)
          `,
        }}
      />

      <div
        aria-hidden
        className="folio-special-glow pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{ background: `${glow}18` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{ background: 'var(--folio-plane)' }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
