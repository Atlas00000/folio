import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { labelForZone, toneForZone } from '@/design/map/backend-ui';
import { toneClass } from '@/design/tokens';
import type { Question } from '@/lib/types';

function labelForQuestionType(type: Question['type']) {
  switch (type) {
    case 'mcq':
      return 'MCQ';
    case 'numerical':
      return 'Numerical';
    case 'journal':
      return 'Journal';
    default:
      return type;
  }
}

export function TopicQuestionLedgerItem({
  question,
  href,
  index = 0,
}: {
  question: Question;
  href: string;
  index?: number;
}) {
  const stage = Math.min(index, 3) as 0 | 1 | 2 | 3;
  const n = String(index + 1).padStart(2, '0');

  return (
    <PageEnter stage={stage}>
      <Link
        href={href}
        className="group relative grid grid-cols-[3rem_1fr] gap-x-4 gap-y-1 border-b border-[var(--folio-hairline)] py-4 pl-2 transition-[background,padding] hover:bg-[var(--folio-plane)]/40 hover:pl-3 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-x-6"
      >
        <span
          aria-hidden
          className="absolute bottom-2 left-0 top-2 w-[2px] origin-center scale-y-50 bg-[var(--folio-signal)] opacity-0 transition-[transform,opacity] duration-[var(--folio-dur-base)] group-hover:scale-y-100 group-hover:opacity-100"
        />
        <Text
          as="span"
          face="mono"
          className="text-lg leading-none tracking-[var(--folio-tracking-tight)] text-[var(--folio-signal)]"
        >
          {n}
        </Text>
        <div className="min-w-0 space-y-1">
          <Text
            as="span"
            size="md"
            className="line-clamp-2 block group-hover:text-[var(--folio-signal)]"
          >
            {question.prompt}
          </Text>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Text as="span" face="label" tone="muted">
              {labelForQuestionType(question.type)}
            </Text>
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
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 sm:text-right">
          {question.marks != null ? (
            <Text as="span" face="mono" size="xs" tone="faint">
              {question.marks} marks
            </Text>
          ) : (
            <Text as="span" face="label" tone="faint">
              Practise
            </Text>
          )}
        </div>
      </Link>
    </PageEnter>
  );
}
