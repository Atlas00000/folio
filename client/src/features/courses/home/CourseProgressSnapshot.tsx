import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import type { MasterySpinePoint } from '../viz';
import type { CourseProgressStats } from './types';

const MasterySpine = dynamic(
  () => import('../viz').then((m) => m.MasterySpine),
  { ssr: false },
);

export function CourseProgressSnapshot({
  courseId,
  stats,
  spine,
}: {
  courseId: string;
  stats: CourseProgressStats;
  spine: MasterySpinePoint[];
}) {
  const metrics = [
    { label: 'Topics', value: stats.topicCount },
    { label: 'Attempted', value: stats.attempted },
    { label: 'Weak', value: stats.weak },
    { label: 'Untried', value: stats.untried },
  ];

  return (
    <PageEnter stage={1} className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Your progress
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Mastery signals for this enrolment only.
          </Text>
        </div>
        <div className="flex items-end gap-4">
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
          <Link
            href={`/student/courses/${courseId}/progress`}
            className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
          >
            Full progress
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--folio-hairline)] bg-[var(--folio-hairline)] sm:grid-cols-4">
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

      {spine.length > 0 ? <MasterySpine points={spine} /> : null}
    </PageEnter>
  );
}
