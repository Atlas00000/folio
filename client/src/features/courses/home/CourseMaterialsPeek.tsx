import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { Material } from '@/lib/types';
import type { ContinueTarget } from '../hub/continue';

function labelForMaterialType(type: string) {
  if (!type) return 'Material';
  return type.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CourseMaterialsPeek({
  materials,
  continueTarget,
}: {
  materials: Material[];
  continueTarget: ContinueTarget | null;
}) {
  if (!continueTarget) return null;

  const topicHref = `/student/courses/${continueTarget.course.id}/topics/${continueTarget.topic.topicId}`;

  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="lg">
            Study materials
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            For {continueTarget.topic.title}
          </Text>
        </div>
        <Link
          href={topicHref}
          className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
        >
          Topic
        </Link>
      </div>

      {materials.length === 0 ? (
        <Text as="p" size="sm" tone="muted">
          No published materials on this topic yet.
        </Text>
      ) : (
        <ul className="list-none space-y-0 p-0">
          {materials.map((m) => (
            <li key={m.id}>
              <Link
                href={topicHref}
                className="group flex items-baseline justify-between gap-4 border-b border-[var(--folio-hairline)] py-2.5 transition-colors hover:border-[var(--folio-hairline-strong)]"
              >
                <Text
                  as="span"
                  size="sm"
                  className="min-w-0 truncate group-hover:text-[var(--folio-signal)]"
                >
                  {m.title}
                </Text>
                <Text as="span" face="label" tone="faint" className="shrink-0">
                  {labelForMaterialType(m.type)}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageEnter>
  );
}
