import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { labelForZone, toneForZone } from '@/design/map/backend-ui';
import { toneClass } from '@/design/tokens';
import type { Question } from '@/lib/types';
import type { ContinueTarget } from '../hub/continue';

function labelForQuestionType(type: Question['type']) {
  switch (type) {
    case 'mcq':
      return 'Multiple choice';
    case 'numerical':
      return 'Numerical';
    case 'journal':
      return 'Journal';
    default:
      return type;
  }
}

export function CoursePracticeFoothold({
  question,
  href,
  continueTarget,
}: {
  question: Question | null;
  href: string | null;
  continueTarget: ContinueTarget | null;
}) {
  if (!continueTarget) return null;

  const topicHref = `/student/courses/${continueTarget.course.id}/topics/${continueTarget.topic.topicId}`;

  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="lg">
            Practice foothold
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            First published question on your next topic.
          </Text>
        </div>
        <Link
          href={topicHref}
          className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-faint)] hover:text-[var(--folio-signal)]"
        >
          All on topic
        </Link>
      </div>

      {!question || !href ? (
        <Text as="p" size="sm" tone="muted">
          No published questions on this topic yet.
        </Text>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Text as="span" face="label" tone="muted">
              {labelForQuestionType(question.type)}
            </Text>
            {question.difficulty ? (
              <Text
                as="span"
                face="label"
                className={toneClass[toneForZone(question.difficulty)]}
              >
                {labelForZone(question.difficulty)}
              </Text>
            ) : null}
          </div>
          <Text as="p" size="md" className="line-clamp-2">
            {question.prompt}
          </Text>
          <Link
            href={href}
            className="inline-flex items-center gap-2 border-b-2 border-[var(--folio-signal)] pb-0.5 font-[family-name:var(--folio-font-display)] text-[length:var(--folio-text-lg)] text-[var(--folio-ink)] transition-colors hover:text-[var(--folio-signal)]"
          >
            Open practice
            <span aria-hidden className="text-[var(--folio-signal)]">
              →
            </span>
          </Link>
        </div>
      )}
    </PageEnter>
  );
}
