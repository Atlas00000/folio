'use client';

import Link from 'next/link';
import { Text } from '@/design/primitives';
import { labelForZone, toneForZone } from '@/design/map/backend-ui';
import { toneClass } from '@/design/tokens';
import type { ContinueQuestionPeek, ContinueTarget } from './continue-types';

export function ContinueActionCluster({
  target,
  peek,
}: {
  target: ContinueTarget;
  peek: ContinueQuestionPeek | null;
}) {
  return (
    <nav
      aria-label="Continue actions"
      className="flex flex-col gap-3 border-t border-[var(--folio-hairline)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          href={target.href}
          className="group inline-flex items-baseline gap-2 font-[family-name:var(--folio-font-display)] text-lg tracking-[var(--folio-tracking-tight)] text-[var(--folio-ink)] transition-colors hover:text-[var(--folio-signal)]"
        >
          Open topic
          <span
            aria-hidden
            className="translate-x-0 text-[var(--folio-signal)] transition-transform duration-[var(--folio-dur-base)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
        <Link
          href={target.progressHref}
          className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] transition-colors hover:text-[var(--folio-signal)]"
        >
          Course progress
        </Link>
      </div>

      {peek ? (
        <Link
          href={peek.href}
          className="group max-w-md border-l border-[var(--folio-hairline-strong)] pl-4 transition-[padding] hover:pl-5"
        >
          <Text as="p" face="label" tone="faint" className="mb-1">
            First published question
          </Text>
          <Text
            as="p"
            size="sm"
            className="line-clamp-2 group-hover:text-[var(--folio-signal)]"
          >
            {peek.question.prompt}
          </Text>
          <div className="mt-1 flex flex-wrap gap-3">
            <Text as="span" face="mono" size="xs" tone="muted">
              {peek.question.type}
            </Text>
            {peek.question.difficulty ? (
              <Text
                as="span"
                face="mono"
                size="xs"
                className={toneClass[toneForZone(peek.question.difficulty)]}
              >
                {labelForZone(peek.question.difficulty)}
              </Text>
            ) : null}
          </div>
        </Link>
      ) : (
        <Text as="p" face="mono" size="xs" tone="faint">
          Open the topic to see published questions
        </Text>
      )}
    </nav>
  );
}
