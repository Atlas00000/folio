import type { AcceptedSolutions } from '../../db/schema';
import { amountsEqual, dec } from './decimal';
import type { MarkResult, NumericalResponse } from './types';

export function gradeNumerical(
  response: NumericalResponse,
  key: AcceptedSolutions,
  maxMarks: string,
): MarkResult {
  const expected = key.numericalValue;
  const tolerance = key.numericalTolerance ?? '0';
  const max = dec(maxMarks);

  if (!expected) {
    return {
      correct: false,
      score: '0.00',
      maxScore: max.toFixed(2),
      components: [
        {
          component: 'value',
          correct: false,
          detail: 'Question has no numerical answer key',
        },
      ],
      feedback: ['This question cannot be marked yet.'],
    };
  }

  let ok = false;
  try {
    ok = amountsEqual(response.value, expected, tolerance);
  } catch {
    ok = false;
  }

  return {
    correct: ok,
    score: ok ? max.toFixed(2) : '0.00',
    maxScore: max.toFixed(2),
    components: [
      {
        component: 'value',
        correct: ok,
        detail: ok
          ? 'Value within tolerance'
          : 'Value outside accepted tolerance',
      },
    ],
    feedback: ok
      ? ['Correct amount.']
      : ['Check your calculation and rounding.'],
    suggestedHintIndex: ok ? undefined : 0,
  };
}
