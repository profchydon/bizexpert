import { round2, subtract } from '../common/utils/decimal.util';

describe('Stocktake variance', () => {
  it('posts adjustment as counted minus system quantity', () => {
    expect(round2(subtract(47, 50))).toBe(-3);
    expect(round2(subtract(52, 50))).toBe(2);
  });
});
