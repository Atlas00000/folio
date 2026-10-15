'use client';

import { Text } from '@/design/primitives';
import { NumberTick, StateCrossfade } from '@/design/motion';
import type { ContinueSignal } from './continue-types';

const SIGNAL_COPY: Record<
  ContinueSignal,
  { label: string; toneClass: string }
> = {
  untried: {
    label: 'Untried',
    toneClass: 'text-[var(--folio-ink-muted)]',
  },
  weak: {
    label: 'Revisit',
    toneClass: 'text-[var(--folio-warn)]',
  },
  reinforce: {
    label: 'Solid',
    toneClass: 'text-[var(--folio-ok)]',
  },
};

export function ContinueSignalMark({
  signal,
  mastery,
  attempts,
  correct,
}: {
  signal: ContinueSignal;
  mastery: number;
  attempts: number;
  correct: number;
}) {
  const copy = SIGNAL_COPY[signal];

  return (
    <div className="flex flex-col items-start gap-4 sm:items-end">
      <StateCrossfade stateKey={signal}>
        <Text
          as="p"
          face="label"
          className={copy.toneClass}
        >
          {copy.label}
        </Text>
      </StateCrossfade>

      <div className="text-left sm:text-right">
        <NumberTick
          value={mastery}
          format={(n) => n.toFixed(0)}
          className={`block text-5xl leading-none tracking-[var(--folio-tracking-tight)] sm:text-6xl ${copy.toneClass}`}
        />
        <Text as="p" face="label" tone="faint" className="mt-2">
          Mastery
        </Text>
      </div>

      <div className="flex gap-5 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] tabular-nums text-[var(--folio-ink-faint)]">
        <span>
          <span className="text-[var(--folio-ink)]">{attempts}</span> attempts
        </span>
        <span>
          <span className="text-[var(--folio-ink)]">{correct}</span> correct
        </span>
      </div>
    </div>
  );
}
