import type { Course, ProgressRow, Question } from '@/lib/types';

export type ContinueSignal = 'untried' | 'weak' | 'reinforce';

export type ContinueTarget = {
  course: Course;
  topic: ProgressRow;
  /** From topics API when available */
  topicDescription?: string | null;
  href: string;
  progressHref: string;
  reason: string;
  signal: ContinueSignal;
  mastery: number;
  attempts: number;
  correct: number;
};

export type ContinueQuestionPeek = {
  question: Question;
  href: string;
};
