import Decimal from 'decimal.js';

// Configure Decimal.js globally for financial precision
Decimal.set({
  precision: 28,       // ample headroom for NGN calculations
  rounding: Decimal.ROUND_HALF_UP,
  toExpPos: 15,
  toExpNeg: -7,
});

// ────────────────────────────────────────────────────────────────────────────
// Type alias for values accepted by Decimal.js
// ────────────────────────────────────────────────────────────────────────────
export type DecimalLike = Decimal | number | string;

// ────────────────────────────────────────────────────────────────────────────
// Core arithmetic helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Adds two or more monetary values and returns a plain number.
 *
 * @example add(100.1, 200.2) // → 300.3
 */
export function add(...values: DecimalLike[]): number {
  if (values.length === 0) return 0;
  return values
    .reduce<Decimal>(
      (acc, val) => acc.plus(new Decimal(val)),
      new Decimal(0),
    )
    .toNumber();
}

/**
 * Subtracts `b` from `a` and returns a plain number.
 *
 * @example subtract(500, 150.75) // → 349.25
 */
export function subtract(a: DecimalLike, b: DecimalLike): number {
  return new Decimal(a).minus(new Decimal(b)).toNumber();
}

/**
 * Multiplies two values and returns a plain number.
 *
 * @example multiply(3, 250.50) // → 751.5
 */
export function multiply(a: DecimalLike, b: DecimalLike): number {
  return new Decimal(a).times(new Decimal(b)).toNumber();
}

/**
 * Divides `a` by `b` and returns a plain number.
 *
 * Throws if `b` is zero to avoid silent NaN/Infinity propagation.
 *
 * @example divide(1000, 3) // → 333.3333...
 */
export function divide(a: DecimalLike, b: DecimalLike): number {
  const divisor = new Decimal(b);
  if (divisor.isZero()) {
    throw new Error('Division by zero is not allowed in monetary calculations');
  }
  return new Decimal(a).dividedBy(divisor).toNumber();
}

/**
 * Rounds a value to 2 decimal places using ROUND_HALF_UP (banker's rounding
 * excluded – matches standard Nigerian accounting practice).
 *
 * @example round2(100.005) // → 100.01
 */
export function round2(value: DecimalLike): number {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}

/**
 * Rounds a value to `dp` decimal places using ROUND_HALF_UP.
 */
export function roundTo(value: DecimalLike, dp: number): number {
  return new Decimal(value).toDecimalPlaces(dp, Decimal.ROUND_HALF_UP).toNumber();
}

// ────────────────────────────────────────────────────────────────────────────
// Inventory costing
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the new weighted-average unit cost after receiving additional stock.
 *
 * Formula:
 *   newAvgCost = (existingQty × existingAvgCost + newQty × newUnitCost)
 *                ─────────────────────────────────────────────────────
 *                           (existingQty + newQty)
 *
 * Edge cases:
 * - If total quantity is zero (or negative), returns `newUnitCost` to avoid
 *   division by zero and reset the average on a stock rebuild.
 * - All inputs are coerced through Decimal.js to avoid floating-point drift.
 *
 * @param existingQty       Current quantity on hand
 * @param existingAvgCost   Current weighted-average unit cost (NGN)
 * @param newQty            Quantity being received
 * @param newUnitCost       Unit cost of the new stock (NGN)
 * @returns                 New weighted-average unit cost rounded to 2 dp (NGN)
 *
 * @example
 * // 50 units @ ₦200 + 30 units @ ₦260 = ₦222.50
 * weightedAverageCost(50, 200, 30, 260) // → 222.50
 */
export function weightedAverageCost(
  existingQty: DecimalLike,
  existingAvgCost: DecimalLike,
  newQty: DecimalLike,
  newUnitCost: DecimalLike,
): number {
  const dExistingQty = new Decimal(existingQty);
  const dExistingAvgCost = new Decimal(existingAvgCost);
  const dNewQty = new Decimal(newQty);
  const dNewUnitCost = new Decimal(newUnitCost);

  const totalQty = dExistingQty.plus(dNewQty);

  if (totalQty.lte(0)) {
    // No stock left (or zero-quantity edge case) – reset to incoming cost
    return round2(dNewUnitCost.toNumber());
  }

  const totalValue = dExistingQty
    .times(dExistingAvgCost)
    .plus(dNewQty.times(dNewUnitCost));

  return round2(totalValue.dividedBy(totalQty).toNumber());
}

// ────────────────────────────────────────────────────────────────────────────
// Formatting helpers (NGN)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Formats a number as a Nigerian Naira string.
 *
 * @example formatNGN(1500000) // → "₦1,500,000.00"
 */
export function formatNGN(value: DecimalLike): string {
  const rounded = round2(value);
  return `₦${rounded.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Returns true if the value is a valid, finite, non-negative monetary amount.
 */
export function isValidAmount(value: unknown): boolean {
  try {
    const d = new Decimal(value as DecimalLike);
    return d.isFinite() && d.gte(0);
  } catch {
    return false;
  }
}
