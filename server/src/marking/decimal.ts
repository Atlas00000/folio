import Decimal from 'decimal.js';

Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
});

export function dec(value: string | number | Decimal): Decimal {
  return new Decimal(value);
}

export function amountsEqual(
  a: string,
  b: string,
  tolerance = '0',
): boolean {
  const diff = dec(a).minus(dec(b)).abs();
  return diff.lte(dec(tolerance));
}

export function scoreRatio(earned: Decimal, max: Decimal): string {
  if (max.isZero()) {
    return '0';
  }
  return earned.toFixed(2);
}

export { Decimal };
