import Link from 'next/link';
import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import { EmptyState } from '@/design/patterns';
import type { MasterySpinePoint } from '../viz';

export function ProgressTopicLedger({
  points,
}: {
  points: MasterySpinePoint[];
}) {
  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Topic ledger
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Text twin of the charts — same progress rows.
          </Text>
        </div>
      </div>

      {points.length === 0 ? (
        <EmptyState
          title="No progress yet"
          description="Try a practice question to start building mastery signals."
        />
      ) : (
        <ul className="list-none p-0">
          {points.map((p) => {
            const signal =
              p.attempts === 0 ? 'Untried' : p.weak ? 'Revisit' : 'Solid';
            const signalClass =
              p.attempts === 0
                ? 'text-[var(--folio-ink-faint)]'
                : p.weak
                  ? 'text-[var(--folio-warn)]'
                  : 'text-[var(--folio-ok)]';
            return (
              <li key={p.topicId}>
                <Link
                  href={p.href}
                  className="group grid grid-cols-[3rem_1fr] gap-x-4 border-b border-[var(--folio-hairline)] py-3 sm:grid-cols-[3rem_1fr_auto_auto_auto] sm:items-center sm:gap-x-6"
                >
                  <Text
                    as="span"
                    face="mono"
                    className="text-[var(--folio-signal)]"
                  >
                    {String(p.sequence).padStart(2, '0')}
                  </Text>
                  <Text
                    as="span"
                    face="display"
                    size="lg"
                    className="min-w-0 truncate group-hover:text-[var(--folio-signal)]"
                  >
                    {p.title}
                  </Text>
                  <Text as="span" face="label" className={signalClass}>
                    {signal}
                  </Text>
                  <Text as="span" face="mono" size="xs" tone="faint">
                    {p.correct}/{p.attempts}
                  </Text>
                  <NumberTick
                    value={p.mastery}
                    format={(n) => n.toFixed(0)}
                    className="text-lg text-[var(--folio-ink)] sm:text-right"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageEnter>
  );
}
