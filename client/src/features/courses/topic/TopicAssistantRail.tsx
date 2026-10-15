import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';

export function TopicAssistantRail({
  courseId,
  topicTitle,
}: {
  courseId: string;
  topicTitle: string;
}) {
  return (
    <PageEnter stage={3}>
      <section
        aria-label="Learning assistant"
        className="border-t border-[var(--folio-hairline-strong)] pt-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg space-y-1">
            <Text as="h2" face="display" size="lg">
              Learning assistant
            </Text>
            <Text as="p" size="sm" tone="muted">
              Ask about “{topicTitle}” — help stays grounded in materials for
              this topic and course.
            </Text>
          </div>
          <Link
            href={`/student/courses/${courseId}/tutor`}
            className="inline-flex items-center gap-2 font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-signal)] hover:underline"
          >
            Open tutor
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </PageEnter>
  );
}
