'use client';

import type { PointerField } from './usePointerField';
import { Text } from '@/design/primitives';

/**
 * Interactive "ledger row absent" — asymmetric, pointer-skewed, not a card.
 */
export function MissingBlotterRow({ pointer }: { pointer: PointerField }) {
  const skew = pointer.active ? pointer.nx * 4 : 0;
  const shift = pointer.active ? pointer.nx * 18 : 0;

  return (
    <div
      className="relative w-full max-w-xl"
      style={{
        transform: `translate3d(${shift}px, 0, 0) skewX(${skew}deg)`,
        transition: 'transform 120ms var(--folio-ease-out)',
      }}
    >
      <div className="grid grid-cols-[4rem_1fr_auto] items-end gap-4 border-y border-[var(--folio-halt)]/50 py-5">
        <Text
          as="span"
          face="mono"
          className="folio-special-flicker text-3xl leading-none text-[var(--folio-halt)]"
        >
          ——
        </Text>
        <div className="min-w-0 space-y-2">
          <div className="h-[2px] w-3/4 bg-[var(--folio-hairline-strong)]" />
          <div className="h-[2px] w-1/2 bg-[var(--folio-hairline)]" />
          <Text as="p" face="label" tone="faint">
            Ledger row missing
          </Text>
        </div>
        <Text as="span" face="mono" size="xs" className="text-[var(--folio-halt)]">
          NULL
        </Text>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 -inset-y-2 border border-dashed border-[var(--folio-halt)]/30"
      />
    </div>
  );
}
