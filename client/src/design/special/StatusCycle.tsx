'use client';

import { useEffect, useState } from 'react';
import { Text } from '@/design/primitives';
import { StateCrossfade } from '@/design/motion';

const DEFAULT_LINES = [
  'Settling the ledger mesh…',
  'Indexing published materials…',
  'Warming mastery signals…',
  'Opening your enrolment blotter…',
];

/**
 * Rotating mono status line — Folio loading copy, not spinner chrome.
 */
export function StatusCycle({
  lines = DEFAULT_LINES,
  intervalMs = 2200,
}: {
  lines?: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [lines, intervalMs]);

  return (
    <StateCrossfade stateKey={index}>
      <Text as="p" face="mono" size="sm" tone="signal" className="tabular-nums">
        {lines[index]}
      </Text>
    </StateCrossfade>
  );
}
