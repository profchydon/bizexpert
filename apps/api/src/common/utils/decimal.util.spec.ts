import {
  add,
  weightedAverageCost,
  round2,
  subtract,
  multiply,
} from './decimal.util';

describe('decimal.util', () => {
  it('adds monetary values without float drift', () => {
    expect(add(100.1, 200.2)).toBe(300.3);
  });

  it('computes weighted average cost (PRD example)', () => {
    const avg = weightedAverageCost(100, 1000, 50, 1200);
    expect(round2(avg)).toBe(1066.67);
  });

  it('COGS after sale uses snapshot average', () => {
    const avg = weightedAverageCost(100, 1000, 50, 1200);
    const qtyAfterReceipt = add(100, 50);
    expect(qtyAfterReceipt).toBe(150);
    const cogs30 = round2(multiply(30, avg));
    expect(cogs30).toBe(32000.1);
    const remainingQty = subtract(qtyAfterReceipt, 30);
    expect(remainingQty).toBe(120);
    expect(round2(multiply(remainingQty, avg))).toBe(128000.4);
  });
});
