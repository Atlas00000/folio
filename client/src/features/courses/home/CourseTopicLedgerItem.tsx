import Link from 'next/link';
import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import type { TopicLedgerRow } from './types';

export function CourseTopicLedgerItem({
  row,
  index = 0,
}: {
  row: TopicLedgerRow;
  index?: number;
}) {
  const { topic, progress, href } = row;
  const attempts = progress ? Number(progress.attemptsCount) : 0;
  const correct = progress ? Number(progress.correctCount) : 0;
  const mastery = progress ? Number(progress.masteryScore) : 0;
  const signal =
    attempts === 0 ? 'Untried' : progress?.weak ? 'Revisit' : 'Solid';
  const signalClass =
    attempts === 0
      ? 'text-[var(--folio-ink-faint)]'
      : progress?.weak
        ? 'text-[var(--folio-warn)]'
        : 'text-[var(--folio-ok)]';
  const stage = Math.min(index, 3) as 0 | 1 | 2 | 3;

  return (
    <PageEnter stage={stage}>
      <Link
        href={href}
        className="group relative grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-1 border-b border-[var(--folio-hairline)] py-4 pl-2 transition-[background,padding] hover:bg-[var(--folio-plane)]/40 hover:pl-3 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:gap-x-6"
      >
        <span
          aria-hidden
          className="absolute bottom-2 left-0 top-2 w-[2px] origin-center scale-y-50 bg-[var(--folio-signal)] opacity-0 transition-[transform,opacity] duration-[var(--folio-dur-base)] group-hover:scale-y-100 group-hover:opacity-100"
        />
        <Text
          as="span"
          face="mono"
          className="text-xl leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-signal)] group-hover:text-[var(--folio-signal)]"
        >
          {String(topic.sequence).padStart(2, '0')}
        </Text>
        <div className="min-w-0 space-y-1">
          <Text
            as="span"
            face="display"
            size="xl"
            className="block leading-tight group-hover:text-[var(--folio-signal)]"
          >
            {topic.title}
          </Text>
          {topic.description ? (
            <Text as="span" size="sm" tone="muted" className="line-clamp-2 block">
              {topic.description}
            </Text>
          ) : null}
        </div>
        <div className="col-span-2 flex flex-wrap items-center gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:gap-1">
          <Text as="span" face="label" className={signalClass}>
            {signal}
          </Text>
          {attempts > 0 ? (
            <>
              <NumberTick
                value={mastery}
                format={(n) => n.toFixed(0)}
                className="text-lg text-[var(--folio-ink)]"
              />
              <Text as="span" face="mono" size="xs" tone="faint">
                {correct}/{attempts} correct
              </Text>
            </>
          ) : (
            <Text as="span" face="mono" size="xs" tone="faint">
              No attempts
            </Text>
          )}
        </div>
      </Link>
    </PageEnter>
  );
}
