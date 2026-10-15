import Link from 'next/link';
import { Badge, Text } from '@/design/primitives';
import { NumberTick, PageEnter } from '@/design/motion';
import type { RecentPracticeItem } from './types';

export function RecentPracticeStrip({ items }: { items: RecentPracticeItem[] }) {
  if (items.length === 0) return null;

  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <Text as="h2" face="display" size="xl">
          Recent practice
        </Text>
        <Text as="p" face="label" tone="faint">
          From your attempts
        </Text>
      </div>

      <ul className="divide-y divide-[var(--folio-hairline)]">
        {items.map(({ course, topic, href }) => {
          const attempts = Number(topic.attemptsCount);
          const correct = Number(topic.correctCount);
          const mastery = Number(topic.masteryScore);
          return (
            <li key={`${course.id}-${topic.topicId}`}>
              <Link
                href={href}
                className="group grid grid-cols-[1fr_auto] gap-4 py-4 transition-colors hover:bg-[var(--folio-plane)]/60 sm:grid-cols-[minmax(4rem,6rem)_1fr_auto_auto]"
              >
                <Text
                  as="span"
                  face="mono"
                  size="xs"
                  tone="muted"
                  className="hidden sm:block"
                >
                  {course.code}
                </Text>
                <div className="min-w-0 space-y-1">
                  <Text
                    as="span"
                    size="sm"
                    className="block group-hover:text-[var(--folio-signal)]"
                  >
                    {topic.title}
                  </Text>
                  <Text as="span" face="mono" size="xs" tone="faint">
                    {correct}/{attempts} correct
                  </Text>
                </div>
                <div className="text-right sm:px-2">
                  <NumberTick
                    value={mastery}
                    format={(n) => n.toFixed(0)}
                    className="text-lg text-[var(--folio-ink)]"
                  />
                  <Text as="span" face="label" tone="faint" className="mt-0.5 block">
                    Mastery
                  </Text>
                </div>
                <div className="flex items-center">
                  <Badge tone={topic.weak ? 'warn' : 'ok'}>
                    {topic.weak ? 'Revisit' : 'Solid'}
                  </Badge>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageEnter>
  );
}
