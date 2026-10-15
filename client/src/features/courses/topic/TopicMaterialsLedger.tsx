import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { EmptyState } from '@/design/patterns';
import type { Material } from '@/lib/types';
import { TopicMaterialsLedgerItem } from './TopicMaterialsLedgerItem';

export function TopicMaterialsLedger({
  courseId,
  materials,
  focusMaterialId,
}: {
  courseId: string;
  materials: Material[];
  focusMaterialId?: string | null;
}) {
  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Study materials
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Lecturer-approved sources for this topic.
          </Text>
        </div>
        <Text as="p" face="label" tone="faint">
          Ledger
        </Text>
      </div>

      {materials.length === 0 ? (
        <EmptyState
          title="No published materials"
          description="Your lecturer has not published materials for this topic yet."
        />
      ) : (
        <ul className="list-none p-0">
          {materials.map((m, index) => (
            <li key={m.id}>
              <TopicMaterialsLedgerItem
                material={m}
                courseId={courseId}
                index={index}
                dimmed={m.id === focusMaterialId}
              />
            </li>
          ))}
        </ul>
      )}
    </PageEnter>
  );
}
