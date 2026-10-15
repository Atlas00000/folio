import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { EmptyState } from '@/design/patterns';
import type { Question } from '@/lib/types';
import { practiceHref } from './loadTopicHome';
import { TopicQuestionLedgerItem } from './TopicQuestionLedgerItem';

export function TopicQuestionLedger({
  courseId,
  topicId,
  questions,
}: {
  courseId: string;
  topicId: string;
  questions: Question[];
}) {
  return (
    <PageEnter stage={2} className="space-y-3">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Practice questions
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Formative work for this topic — open any row to attempt.
          </Text>
        </div>
        <Text as="p" face="label" tone="faint">
          {questions.length} published
        </Text>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          title="No published questions"
          description="Practice will appear here when your lecturer publishes questions."
        />
      ) : (
        <ul className="list-none p-0">
          {questions.map((q, index) => (
            <li key={q.id}>
              <TopicQuestionLedgerItem
                question={q}
                href={practiceHref(courseId, topicId, q.id)}
                index={index}
              />
            </li>
          ))}
        </ul>
      )}
    </PageEnter>
  );
}
