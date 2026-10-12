import { describe, expect, it } from 'vitest';
import { gradeNumerical } from './numerical';

const key = {
  numericalValue: '250.00',
  numericalTolerance: '0.01',
};

describe('gradeNumerical', () => {
  it('accepts exact value', () => {
    const result = gradeNumerical({ value: '250.00' }, key, '1');
    expect(result.correct).toBe(true);
    expect(result.score).toBe('1.00');
  });

  it('accepts value within tolerance', () => {
    const result = gradeNumerical({ value: '250.005' }, key, '1');
    expect(result.correct).toBe(true);
  });

  it('rejects value outside tolerance', () => {
    const result = gradeNumerical({ value: '251.00' }, key, '1');
    expect(result.correct).toBe(false);
    expect(result.score).toBe('0.00');
  });

  it('rejects non-numeric input', () => {
    const result = gradeNumerical({ value: 'abc' }, key, '1');
    expect(result.correct).toBe(false);
  });
});
