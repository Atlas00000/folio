import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { labelForZone } from '@/design/map/backend-ui';
import type { TutorContext } from './types';

export function TutorContextChip({
  courseId,
  context,
}: {
  courseId: string;
  context: TutorContext;
}) {
  if (!context.topic && !context.question) return null;

  const topicHref = context.topic
    ? `/student/courses/${courseId}/topics/${context.topic.id}`
    : null;
  const practiceHref =
    context.question && context.topic
      ? `/student/courses/${courseId}/practice/${context.question.id}?topicId=${context.topic.id}`
      : null;

  return (
    <PageEnter stage={1}>
      <section
        aria-label="Ask context"
        className="border border-[var(--folio-hairline-strong)] bg-[var(--folio-plane)]/40 px-4 py-3"
      >
        <Text as="p" face="label" tone="faint" className="mb-2">
          Asking in context
        </Text>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          {context.topic ? (
            <div className="min-w-0">
              <Text as="span" face="mono" size="xs" tone="signal">
                {String(context.topic.sequence).padStart(2, '0')}
              </Text>{' '}
              <Text as="span" face="display" size="lg">
                {context.topic.title}
              </Text>
            </div>
          ) : null}
          {context.question ? (
            <Text as="span" face="mono" size="xs" tone="muted">
              {context.question.type}
              {context.question.difficulty
                ? ` · ${labelForZone(context.question.difficulty)}`
                : ''}
            </Text>
          ) : null}
        </div>
        {context.question ? (
          <Text as="p" size="sm" tone="muted" className="mt-2 line-clamp-2">
            {context.question.prompt}
          </Text>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-4">
          {topicHref ? (
            <Link
              href={topicHref}
              className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
            >
              Open topic
            </Link>
          ) : null}
          {practiceHref ? (
            <Link
              href={practiceHref}
              className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
            >
              Back to practice
            </Link>
          ) : null}
        </div>
      </section>
    </PageEnter>
  );
}
