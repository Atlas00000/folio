import { describe, expect, it } from 'vitest';
import { gradeMcq } from './mcq';

const key = { mcqCorrectOptionId: 'a' };

describe('gradeMcq', () => {
  it('marks correct option', () => {
    const result = gradeMcq({ selectedOptionId: 'a' }, key, '1');
    expect(result.correct).toBe(true);
    expect(result.score).toBe('1.00');
    expect(result.components[0]?.component).toBe('choice');
  });

  it('marks wrong option', () => {
    const result = gradeMcq({ selectedOptionId: 'b' }, key, '1');
    expect(result.correct).toBe(false);
    expect(result.score).toBe('0.00');
    expect(result.suggestedHintIndex).toBe(0);
  });
});
