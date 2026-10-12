import { describe, expect, it } from 'vitest';
import { buildTokenWeights, scoreQuery, tokenize } from './retrieval';

describe('tutor retrieval', () => {
  it('scores overlapping accounting vocabulary', () => {
    const weights = buildTokenWeights(
      'Debit Cash and credit Capital when the owner invests cash',
    );
    const score = scoreQuery('owner invests cash capital debit', weights);
    expect(score).toBeGreaterThan(0.3);
  });

  it('scores near zero for unrelated queries', () => {
    const weights = buildTokenWeights('Debit Cash credit Capital');
    expect(scoreQuery('boiling point nitrogen kelvin', weights)).toBeLessThan(
      0.2,
    );
  });

  it('tokenizes without stop words', () => {
    expect(tokenize('the cash is an asset')).toEqual(['cash', 'asset']);
  });
});
