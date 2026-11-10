import { findPhoneConflict, normalizeCustomerPhone } from './customer-name.util';

describe('customer-name.util', () => {
  it('normalizes blank phone to null', () => {
    expect(normalizeCustomerPhone('  ')).toBeNull();
    expect(normalizeCustomerPhone('0801 111 2222')).toBe('0801 111 2222');
  });

  it('detects a phone conflict on the same business list', () => {
    const rows = [
      { id: '1', phone: '08011112222' },
      { id: '2', phone: null },
    ];
    expect(findPhoneConflict(rows, '08011112222')?.id).toBe('1');
    expect(findPhoneConflict(rows, '08011112222', '1')).toBeUndefined();
    expect(findPhoneConflict(rows, null)).toBeUndefined();
  });
});
