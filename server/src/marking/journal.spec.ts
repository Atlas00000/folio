import { describe, expect, it } from 'vitest';
import { gradeJournal } from './journal';

const key = {
  journalLines: [
    { account: 'Cash', direction: 'debit' as const, amount: '500.00' },
    { account: 'Capital', direction: 'credit' as const, amount: '500.00' },
  ],
  alternateAccounts: { Cash: ['Bank', 'Cash at bank'] },
};

describe('gradeJournal', () => {
  it('accepts correct entry', () => {
    const result = gradeJournal(
      {
        lines: [
          { account: 'Cash', direction: 'debit', amount: '500' },
          { account: 'Capital', direction: 'credit', amount: '500.00' },
        ],
      },
      key,
      '2',
    );
    expect(result.correct).toBe(true);
    expect(result.score).toBe('2.00');
  });

  it('accepts alternate account label Bank for Cash', () => {
    const result = gradeJournal(
      {
        lines: [
          { account: 'Bank', direction: 'debit', amount: '500.00' },
          { account: 'Capital', direction: 'credit', amount: '500.00' },
        ],
      },
      key,
      '2',
    );
    expect(result.correct).toBe(true);
  });

  it('flags debit/credit swap misconception', () => {
    const result = gradeJournal(
      {
        lines: [
          { account: 'Cash', direction: 'credit', amount: '500.00' },
          { account: 'Capital', direction: 'debit', amount: '500.00' },
        ],
      },
      key,
      '2',
    );
    expect(result.correct).toBe(false);
    expect(
      result.components.some(
        (c) => c.misconceptionTag === 'debit_credit_swap',
      ),
    ).toBe(true);
    expect(result.feedback.join(' ')).toMatch(/debit vs credit/i);
  });
});
