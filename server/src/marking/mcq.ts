import type { AcceptedSolutions } from '../../db/schema';
import { dec } from './decimal';
import type { MarkResult, McqResponse } from './types';

export function gradeMcq(
  response: McqResponse,
  key: AcceptedSolutions,
  maxMarks: string,
): MarkResult {
  const correctId = key.mcqCorrectOptionId;
  const ok =
    !!correctId && response.selectedOptionId.trim() === correctId.trim();
  const max = dec(maxMarks);
  return {
    correct: ok,
    score: ok ? max.toFixed(2) : '0.00',
    maxScore: max.toFixed(2),
    components: [
      {
        component: 'choice',
        correct: ok,
        detail: ok ? 'Correct option selected' : 'Incorrect option selected',
      },
    ],
    feedback: ok
      ? ['Correct.']
      : ['That option is not correct. Review the concept and try again.'],
    suggestedHintIndex: ok ? undefined : 0,
  };
}
