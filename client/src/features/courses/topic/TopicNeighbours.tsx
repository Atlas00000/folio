import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { TopicNeighbours as Neighbours } from './types';

export function TopicNeighbours({
  neighbours,
  courseHref,
}: {
  neighbours: Neighbours;
  courseHref: string;
}) {
  return (
    <PageEnter stage={3}>
      <nav
        aria-label="Topic neighbours"
        className="grid gap-6 border-t border-[var(--folio-hairline)] pt-6 sm:grid-cols-3"
      >
        <div>
          {neighbours.prev ? (
            <Link
              href={neighbours.prev.href}
              className="group block space-y-1"
            >
              <Text as="p" face="label" tone="faint">
                Previous
              </Text>
              <Text
                as="p"
                face="mono"
                size="xs"
                tone="signal"
                className="tabular-nums"
              >
                {String(neighbours.prev.topic.sequence).padStart(2, '0')}
              </Text>
              <Text
                as="p"
                face="display"
                size="lg"
                className="leading-tight group-hover:text-[var(--folio-signal)]"
              >
                {neighbours.prev.topic.title}
              </Text>
            </Link>
          ) : (
            <Text as="p" face="label" tone="faint">
              Start of module
            </Text>
          )}
        </div>

        <div className="sm:text-center">
          <Link
            href={courseHref}
            className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
          >
            All topics
          </Link>
        </div>

        <div className="sm:text-right">
          {neighbours.next ? (
            <Link
              href={neighbours.next.href}
              className="group block space-y-1"
            >
              <Text as="p" face="label" tone="faint">
                Next
              </Text>
              <Text
                as="p"
                face="mono"
                size="xs"
                tone="signal"
                className="tabular-nums"
              >
                {String(neighbours.next.topic.sequence).padStart(2, '0')}
              </Text>
              <Text
                as="p"
                face="display"
                size="lg"
                className="leading-tight group-hover:text-[var(--folio-signal)]"
              >
                {neighbours.next.topic.title}
              </Text>
            </Link>
          ) : (
            <Text as="p" face="label" tone="faint">
              End of module
            </Text>
          )}
        </div>
      </nav>
    </PageEnter>
  );
}
