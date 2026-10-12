import type { AcceptedSolutions, JournalLineKey } from '../../db/schema';
import { amountsEqual, dec } from './decimal';
import type {
  ComponentMark,
  JournalLineResponse,
  JournalResponse,
  MarkResult,
} from './types';

function normalizeAccount(
  label: string,
  alternates: Record<string, string[]> | undefined,
): string {
  const trimmed = label.trim().toLowerCase();
  if (!alternates) {
    return trimmed;
  }
  for (const [canonical, alts] of Object.entries(alternates)) {
    if (canonical.trim().toLowerCase() === trimmed) {
      return canonical.trim().toLowerCase();
    }
    if (alts.some((a) => a.trim().toLowerCase() === trimmed)) {
      return canonical.trim().toLowerCase();
    }
  }
  return trimmed;
}

function lineKey(line: {
  account: string;
  direction: string;
  amount: string;
}): string {
  return `${line.account}|${line.direction}|${dec(line.amount).toFixed(2)}`;
}

/**
 * Grades journal entries component-wise: account, direction, amount.
 * Matches student lines to key lines (order-independent) using alternate accounts.
 */
export function gradeJournal(
  response: JournalResponse,
  key: AcceptedSolutions,
  maxMarks: string,
): MarkResult {
  const expected = key.journalLines ?? [];
  const max = dec(maxMarks);
  const components: ComponentMark[] = [];
  const feedback: string[] = [];

  if (!expected.length) {
    return {
      correct: false,
      score: '0.00',
      maxScore: max.toFixed(2),
      components: [
        {
          component: 'overall',
          correct: false,
          detail: 'No journal answer key configured',
        },
      ],
      feedback: ['This question cannot be marked yet.'],
    };
  }

  if (!response.lines?.length) {
    return {
      correct: false,
      score: '0.00',
      maxScore: max.toFixed(2),
      components: [
        { component: 'overall', correct: false, detail: 'No lines submitted' },
      ],
      feedback: ['Enter at least one journal line.'],
      suggestedHintIndex: 0,
    };
  }

  const normalizedKey: JournalLineKey[] = expected.map((l) => ({
    account: normalizeAccount(l.account, key.alternateAccounts),
    direction: l.direction,
    amount: dec(l.amount).toFixed(2),
  }));

  const normalizedStudent: JournalLineResponse[] = response.lines.map((l) => ({
    account: normalizeAccount(l.account, key.alternateAccounts),
    direction: l.direction,
    amount: (() => {
      try {
        return dec(l.amount).toFixed(2);
      } catch {
        return l.amount;
      }
    })(),
  }));

  const usedStudent = new Set<number>();
  let accountHits = 0;
  let directionHits = 0;
  let amountHits = 0;
  let fullLineHits = 0;
  let debitCreditSwap = false;

  for (const keyLine of normalizedKey) {
    let bestIdx = -1;
    let bestScore = -1;

    for (let i = 0; i < normalizedStudent.length; i++) {
      if (usedStudent.has(i)) continue;
      const s = normalizedStudent[i];
      let score = 0;
      if (s.account === keyLine.account) score += 4;
      if (s.direction === keyLine.direction) score += 2;
      try {
        if (amountsEqual(s.amount, keyLine.amount)) score += 1;
      } catch {
        /* ignore */
      }
      // Prefer same account even if direction wrong (misconception)
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestIdx < 0) {
      components.push({
        component: 'account',
        correct: false,
        detail: `Missing line for account matching "${keyLine.account}"`,
      });
      continue;
    }

    usedStudent.add(bestIdx);
    const student = normalizedStudent[bestIdx];
    const accountOk = student.account === keyLine.account;
    const directionOk = student.direction === keyLine.direction;
    let amountOk = false;
    try {
      amountOk = amountsEqual(student.amount, keyLine.amount);
    } catch {
      amountOk = false;
    }

    if (accountOk) accountHits += 1;
    if (directionOk) directionHits += 1;
    if (amountOk) amountHits += 1;
    if (accountOk && directionOk && amountOk) fullLineHits += 1;

    if (accountOk && !directionOk && amountOk) {
      debitCreditSwap = true;
    }

    components.push({
      component: 'account',
      correct: accountOk,
      detail: accountOk
        ? `Account ok (${student.account})`
        : `Account mismatch (got "${response.lines[bestIdx].account}")`,
    });
    components.push({
      component: 'direction',
      correct: directionOk,
      detail: directionOk
        ? `Direction ok (${student.direction})`
        : `Expected ${keyLine.direction}, got ${student.direction}`,
      misconceptionTag: accountOk && !directionOk ? 'debit_credit_swap' : undefined,
    });
    components.push({
      component: 'amount',
      correct: amountOk,
      detail: amountOk
        ? `Amount ok (${student.amount})`
        : `Expected ${keyLine.amount}, got ${student.amount}`,
    });
  }

  const n = normalizedKey.length;
  // Equal weight across three components across all lines
  const componentUnits = n * 3;
  const earnedUnits = accountHits + directionHits + amountHits;
  const earned = max.mul(earnedUnits).div(componentUnits);
  const correct = fullLineHits === n && usedStudent.size === normalizedStudent.length
    ? normalizedStudent.length === n
    : fullLineHits === n && normalizedStudent.length === n;

  const strictlyCorrect =
    normalizedStudent.length === n &&
    fullLineHits === n &&
    [...normalizedKey]
      .map(lineKey)
      .sort()
      .join('|') ===
      [...normalizedStudent]
        .map((l) =>
          lineKey({
            account: l.account,
            direction: l.direction,
            amount: l.amount,
          }),
        )
        .sort()
        .join('|');

  if (strictlyCorrect) {
    feedback.push('Journal entry is correct.');
  } else {
    if (debitCreditSwap) {
      feedback.push(
        'Check debit vs credit on one or more lines (common debit/credit swap).',
      );
    }
    if (accountHits < n) {
      feedback.push('One or more account names do not match the approved set.');
    }
    if (amountHits < n) {
      feedback.push('Check the amounts on your lines.');
    }
    if (normalizedStudent.length !== n) {
      feedback.push(
        `Expected ${n} line(s), received ${normalizedStudent.length}.`,
      );
    }
  }

  return {
    correct: strictlyCorrect,
    score: earned.toFixed(2),
    maxScore: max.toFixed(2),
    components,
    feedback,
    suggestedHintIndex: strictlyCorrect
      ? undefined
      : debitCreditSwap
        ? 0
        : 0,
  };
}
