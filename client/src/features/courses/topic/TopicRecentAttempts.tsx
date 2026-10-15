import Link from 'next/link';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { TopicAttemptPeek } from './types';

export function TopicRecentAttempts({
  attempts,
}: {
  attempts: TopicAttemptPeek[];
}) {
  if (attempts.length === 0) return null;

  return (
    <PageEnter stage={3} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="lg">
            Recent attempts
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Your latest marked work on questions in this topic.
          </Text>
        </div>
      </div>

      <ul className="list-none p-0">
        {attempts.map((a) => (
          <li key={`${a.questionId}-${a.attemptNumber}`}>
            <Link
              href={a.href}
              className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-b border-[var(--folio-hairline)] py-3 transition-colors hover:border-[var(--folio-hairline-strong)]"
            >
              <Text
                as="span"
                face="label"
                className={
                  a.correct
                    ? 'text-[var(--folio-ok)]'
                    : 'text-[var(--folio-halt)]'
                }
              >
                {a.correct ? 'Correct' : 'Incorrect'}
              </Text>
              <div className="min-w-0 space-y-1">
                <Text
                  as="span"
                  size="sm"
                  className="line-clamp-2 block group-hover:text-[var(--folio-signal)]"
                >
                  {a.prompt}
                </Text>
                <Text as="span" face="mono" size="xs" tone="faint">
                  Attempt {a.attemptNumber}
                  {a.submittedAt
                    ? ` · ${new Date(a.submittedAt).toLocaleString()}`
                    : ''}
                </Text>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PageEnter>
  );
}
