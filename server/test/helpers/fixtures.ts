export function uniqueSuffix(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function uniEmail(local: string, suffix = uniqueSuffix()): string {
  return `${local}.${suffix}@example.ac.uk`;
}

export function courseCode(prefix = 'T'): string {
  return `${prefix}${uniqueSuffix()}`.slice(0, 32).toUpperCase();
}

export const DEMO_LECTURER = {
  email: 'lecturer@example.ac.uk',
  password: 'password123',
};

export const DEMO_STUDENT = {
  email: 'student@example.ac.uk',
  password: 'password123',
};

export const WRONG_JOURNAL = {
  lines: [
    { account: 'Cash', direction: 'credit' as const, amount: '500.00' },
    { account: 'Capital', direction: 'debit' as const, amount: '500.00' },
  ],
};

export const RIGHT_JOURNAL = {
  lines: [
    { account: 'Cash', direction: 'debit' as const, amount: '500.00' },
    { account: 'Capital', direction: 'credit' as const, amount: '500.00' },
  ],
};

export const JOURNAL_QUESTION = {
  type: 'journal' as const,
  prompt: 'Owner invests 500 cash into the business.',
  difficulty: 'intro' as const,
  marks: '2',
  journalLines: [
    { account: 'Cash', direction: 'debit' as const, amount: '500.00' },
    { account: 'Capital', direction: 'credit' as const, amount: '500.00' },
  ],
  alternateAccounts: { Cash: ['Bank', 'Cash at bank'] },
  hints: ['Think about which account increases with a debit'],
  misconceptionTags: ['debit_credit_swap'],
  rationale: 'Dr Cash 500, Cr Capital 500.',
};
