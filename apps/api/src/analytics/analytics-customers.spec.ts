import { averageSpend } from './analytics-customers';

describe('averageSpend', () => {
  it('divides spend across buyers', () => {
    expect(averageSpend(200, 4)).toBe(50);
    expect(averageSpend(10, 3)).toBe(3.33);
  });

  it('is zero when there are no buyers', () => {
    expect(averageSpend(100, 0)).toBe(0);
  });
});
