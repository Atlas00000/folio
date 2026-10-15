import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import type { ProgressStats } from './types';

export function ProgressStatsStrip({ stats }: { stats: ProgressStats }) {
  const metrics = [
    { label: 'Topics', value: stats.topicCount },
    { label: 'Attempted', value: stats.attempted },
    { label: 'Weak', value: stats.weak },
    { label: 'Untried', value: stats.untried },
    { label: 'Attempts', value: stats.totalAttempts },
    {
      label: 'Correct',
      value: stats.totalCorrect,
    },
  ];

  return (
    <PageEnter stage={1} className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Text as="h2" face="display" size="xl">
          Enrolment signal
        </Text>
        <div className="text-right">
          <NumberTick
            value={stats.avgMastery}
            format={(n) => n.toFixed(0)}
            className="block text-3xl leading-none text-[var(--folio-ink)]"
          />
          <Text as="p" face="label" tone="faint" className="mt-1">
            Avg mastery
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--folio-hairline)] bg-[var(--folio-hairline)] sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[var(--folio-canvas)] px-4 py-3">
            <Text as="p" face="label" tone="faint">
              {m.label}
            </Text>
            <NumberTick
              value={m.value}
              className="mt-1 block text-2xl leading-none text-[var(--folio-ink)]"
            />
          </div>
        ))}
      </div>
    </PageEnter>
  );
}
