import type { HTMLAttributes, ReactNode } from 'react';
import type { Tone } from '@/design/tokens';

const tones: Record<Tone, string> = {
  ink: 'border-[var(--folio-hairline-strong)] text-[var(--folio-ink)] bg-[var(--folio-plane)]',
  muted:
    'border-[var(--folio-hairline)] text-[var(--folio-ink-muted)] bg-transparent',
  faint:
    'border-[var(--folio-hairline)] text-[var(--folio-ink-faint)] bg-transparent',
  signal:
    'border-[var(--folio-signal)]/35 text-[var(--folio-signal)] bg-[var(--folio-signal-dim)]',
  warn: 'border-[var(--folio-warn)]/35 text-[var(--folio-warn)] bg-[var(--folio-warn-dim)]',
  halt: 'border-[var(--folio-halt)]/35 text-[var(--folio-halt)] bg-[var(--folio-halt-dim)]',
  ok: 'border-[var(--folio-ok)]/35 text-[var(--folio-ok)] bg-[var(--folio-ok-dim)]',
};

export function Badge({
  tone = 'muted',
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--folio-radius-sm)] border px-2 py-0.5 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[0.08em] tabular-nums ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

/** Compact chip alias for filters / tags */
export function Chip(props: Parameters<typeof Badge>[0]) {
  return <Badge {...props} />;
}
