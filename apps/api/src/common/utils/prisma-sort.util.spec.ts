import { toPrismaSortOrder } from './prisma-sort.util';

describe('toPrismaSortOrder', () => {
  it('maps ASC to asc', () => {
    expect(toPrismaSortOrder('ASC')).toBe('asc');
  });

  it('maps DESC to desc', () => {
    expect(toPrismaSortOrder('DESC')).toBe('desc');
  });

  it('defaults to desc when omitted', () => {
    expect(toPrismaSortOrder(undefined)).toBe('desc');
  });
});
