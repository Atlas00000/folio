import type { AcceptedSolutions } from '../../db/schema';
import { gradeJournal } from './journal';
import { gradeMcq } from './mcq';
import { gradeNumerical } from './numerical';
import type { AttemptResponse, MarkResult } from './types';

export * from './types';
export * from './decimal';
export { gradeMcq } from './mcq';
export { gradeNumerical } from './numerical';
export { gradeJournal } from './journal';

export function gradeAttempt(input: {
  type: 'mcq' | 'numerical' | 'journal';
  response: AttemptResponse;
  key: AcceptedSolutions;
  maxMarks: string;
}): MarkResult {
  switch (input.type) {
    case 'mcq':
      return gradeMcq(
        input.response as { selectedOptionId: string },
        input.key,
        input.maxMarks,
      );
    case 'numerical':
      return gradeNumerical(
        input.response as { value: string },
        input.key,
        input.maxMarks,
      );
    case 'journal':
      return gradeJournal(
        input.response as {
          lines: Array<{
            account: string;
            direction: 'debit' | 'credit';
            amount: string;
          }>;
        },
        input.key,
        input.maxMarks,
      );
    default:
      return {
        correct: false,
        score: '0.00',
        maxScore: input.maxMarks,
        components: [],
        feedback: ['Unsupported question type'],
      };
  }
}
