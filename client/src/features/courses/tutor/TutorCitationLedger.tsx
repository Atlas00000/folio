import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { IndexedMaterial, TutorCitation } from './types';

export function TutorCitationLedger({
  courseId,
  citations,
  materials,
}: {
  courseId: string;
  citations: TutorCitation[];
  materials: IndexedMaterial[];
}) {
  if (citations.length === 0) return null;

  const byId = new Map(materials.map((m) => [m.id, m]));

  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="lg">
            Sources
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Published materials that grounded this hint.
          </Text>
        </div>
        <Text as="p" face="label" tone="faint">
          {citations.length} citation{citations.length === 1 ? '' : 's'}
        </Text>
      </div>

      <ul className="list-none p-0">
        {citations.map((c, i) => {
          const mat = c.materialId ? byId.get(c.materialId) : undefined;
          const href = mat
            ? `/student/courses/${courseId}/topics/${mat.topicId}`
            : null;
          const row = (
            <div className="grid gap-1 border-b border-[var(--folio-hairline)] py-3 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-4">
              <Text as="span" face="mono" size="xs" tone="signal">
                {String(i + 1).padStart(2, '0')}
              </Text>
              <div className="min-w-0 space-y-1">
                <Text
                  as="span"
                  size="sm"
                  className={`block ${href ? 'group-hover:text-[var(--folio-signal)]' : ''}`}
                >
                  {c.title}
                </Text>
                <Text as="span" face="mono" size="xs" tone="faint">
                  {c.locator}
                  {mat ? ` · Topic ${String(mat.topicSequence).padStart(2, '0')} ${mat.topicTitle}` : ''}
                </Text>
              </div>
              {href ? (
                <Text as="span" face="label" tone="faint">
                  Open topic
                </Text>
              ) : null}
            </div>
          );

          return (
            <li key={`${c.materialId ?? c.title}-${i}`}>
              {href ? (
                <Link href={href} className="group block">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </PageEnter>
  );
}
