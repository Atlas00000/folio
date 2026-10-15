'use client';

import type { ReactNode } from 'react';

/**
 * Crossfades when `stateKey` changes. Opacity-only under reduced motion
 * (duration tokens collapse to 0).
 */
export function StateCrossfade({
  stateKey,
  className = '',
  children,
}: {
  stateKey: string | number | boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      key={String(stateKey)}
      className={`inline-block animate-[folio-fade_var(--folio-dur-base)_var(--folio-ease-out)] ${className}`}
    >
      {children}
    </span>
  );
}
