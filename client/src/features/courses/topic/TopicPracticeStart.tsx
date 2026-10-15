import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { labelForZone, toneForZone } from '@/design/map/backend-ui';
import { toneClass } from '@/design/tokens';
import type { Question } from '@/lib/types';

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

export function TopicPracticeStart({
  question,
  href,
  signalLabel,
}: {
  question: Question | null;
  href: string | null;
  signalLabel: string;
}) {
  if (!question || !href) return null;

  return (
    <PageEnter stage={2}>
      <section
        aria-label="Start practice"
        className="relative overflow-hidden border-y border-[var(--folio-hairline-strong)] py-7"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(var(--folio-hairline) 1px, transparent 1px)',
            backgroundSize: '100% 28px',
            maskImage: 'linear-gradient(90deg, black 0%, transparent 70%)',
          }}
        />

        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-3">
            <Text as="p" face="label" tone="faint">
              Start / continue practice · {signalLabel}
            </Text>
            <Text as="h2" face="display" size="2xl" className="leading-tight">
              {labelForQuestionType(question.type)}
            </Text>
            <Text as="p" size="md" className="max-w-2xl line-clamp-3">
              {question.prompt}
            </Text>
            <div className="flex flex-wrap gap-3">
              {question.difficulty ? (
                <Text
                  as="span"
                  face="mono"
                  size="xs"
                  className={toneClass[toneForZone(question.difficulty)]}
                >
                  {labelForZone(question.difficulty)}
                </Text>
              ) : null}
              {question.marks != null ? (
                <Text as="span" face="mono" size="xs" tone="faint">
                  {question.marks} marks
                </Text>
              ) : null}
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-2 border-b-2 border-[var(--folio-signal)] pb-0.5 font-[family-name:var(--folio-font-display)] text-[length:var(--folio-text-xl)] text-[var(--folio-ink)] transition-colors hover:text-[var(--folio-signal)]"
          >
            Open practice
            <span aria-hidden className="text-[var(--folio-signal)]">
              →
            </span>
          </Link>
        </div>
      </section>
    </PageEnter>
  );
}
