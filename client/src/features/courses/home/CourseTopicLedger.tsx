import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { EmptyState } from '@/design/patterns';
import type { TopicLedgerRow } from './types';
import { CourseTopicLedgerItem } from './CourseTopicLedgerItem';

export function CourseTopicLedger({ rows }: { rows: TopicLedgerRow[] }) {
  return (
    <PageEnter stage={1} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Topics
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Module spine — open a topic for materials and practice.
          </Text>
        </div>
        <Text as="p" face="label" tone="faint">
          Ledger
        </Text>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No topics yet"
          description="Your lecturer has not published topics for this course."
        />
      ) : (
        <ul className="list-none p-0">
          {rows.map((row, index) => (
            <li key={row.topic.id}>
              <CourseTopicLedgerItem row={row} index={index} />
            </li>
          ))}
        </ul>
      )}
    </PageEnter>
  );
}
