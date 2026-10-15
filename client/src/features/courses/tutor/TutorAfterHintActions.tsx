import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { ContinueTarget } from '../hub/continue';
import type { IndexedMaterial, TutorReply } from './types';

export function TutorAfterHintActions({
  courseId,
  reply,
  materials,
  continueTarget,
  practiceHref,
}: {
  courseId: string;
  reply: TutorReply | null;
  materials: IndexedMaterial[];
  continueTarget: ContinueTarget | null;
  practiceHref: string | null;
}) {
  if (!reply) return null;

  const byId = new Map(materials.map((m) => [m.id, m]));
  const firstCite = reply.citations.find((c) => c.materialId);
  const mat = firstCite?.materialId
    ? byId.get(firstCite.materialId)
    : undefined;
  const sourceTopicHref = mat
    ? `/student/courses/${courseId}/topics/${mat.topicId}`
    : continueTarget?.href ?? null;

  return (
    <PageEnter stage={3}>
      <nav
        aria-label="After hint"
        className="flex flex-col gap-3 border-t border-[var(--folio-hairline)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {sourceTopicHref ? (
            <Link
              href={sourceTopicHref}
              className="group inline-flex items-baseline gap-2 font-[family-name:var(--folio-font-display)] text-lg tracking-[var(--folio-tracking-tight)] text-[var(--folio-ink)] hover:text-[var(--folio-signal)]"
            >
              Open related topic
              <span
                aria-hidden
                className="text-[var(--folio-signal)] transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : null}
          {practiceHref ? (
            <Link
              href={practiceHref}
              className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
            >
              Practise
            </Link>
          ) : continueTarget ? (
            <Link
              href={continueTarget.href}
              className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
            >
              Continue topic
            </Link>
          ) : null}
          <Link
            href={`/student/courses/${courseId}/progress`}
            className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
          >
            Progress
          </Link>
        </div>
        <Text as="p" face="mono" size="xs" tone="faint">
          Hint → study → attempt
        </Text>
      </nav>
    </PageEnter>
  );
}
