import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { IndexedMaterial } from './types';

export function TutorCoveragePeek({
  courseId,
  materials,
}: {
  courseId: string;
  materials: IndexedMaterial[];
}) {
  const shown = materials.slice(0, 5);

  return (
    <PageEnter stage={3} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="lg">
            What this tutor can see
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Published materials indexed for this course only.
          </Text>
        </div>
        <Text as="p" face="mono" size="xs" tone="faint">
          {materials.length} published
        </Text>
      </div>

      {materials.length === 0 ? (
        <Text as="p" size="sm" tone="muted">
          No published materials yet — the assistant will usually refuse until
          your lecturer publishes readings.
        </Text>
      ) : (
        <ul className="list-none p-0">
          {shown.map((m) => (
            <li key={m.id}>
              <Link
                href={`/student/courses/${courseId}/topics/${m.topicId}`}
                className="group flex items-baseline justify-between gap-4 border-b border-[var(--folio-hairline)] py-2.5"
              >
                <Text
                  as="span"
                  size="sm"
                  className="min-w-0 truncate group-hover:text-[var(--folio-signal)]"
                >
                  {m.title}
                </Text>
                <Text as="span" face="mono" size="xs" tone="faint" className="shrink-0">
                  {String(m.topicSequence).padStart(2, '0')}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageEnter>
  );
}
