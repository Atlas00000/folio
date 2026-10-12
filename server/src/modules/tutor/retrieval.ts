const STOP = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'to',
  'of',
  'in',
  'on',
  'for',
  'is',
  'are',
  'be',
  'with',
  'as',
  'at',
  'by',
  'from',
  'that',
  'this',
  'it',
  'i',
  'you',
  'we',
  'do',
  'does',
  'what',
  'when',
  'where',
  'how',
  'why',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function buildTokenWeights(text: string): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const token of tokenize(text)) {
    weights[token] = (weights[token] ?? 0) + 1;
  }
  return weights;
}

export function scoreQuery(
  query: string,
  weights: Record<string, number>,
): number {
  const tokens = tokenize(query);
  if (!tokens.length) return 0;
  let hit = 0;
  for (const t of tokens) {
    if (weights[t]) hit += weights[t];
  }
  return hit / tokens.length;
}

export function chunkText(text: string, size = 500): string[] {
  const cleaned = text.replace(/\r\n/g, '\n').trim();
  if (!cleaned) return [];
  const parts: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    parts.push(cleaned.slice(i, i + size));
    i += size;
  }
  return parts;
}
