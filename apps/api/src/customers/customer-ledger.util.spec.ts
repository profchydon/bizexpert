import {
  ledgerApplyError,
  nextOutstandingBalance,
  nextWalletBalance,
} from './customer-ledger.util';

describe('customer-ledger.util', () => {
  it('credits and debits the store wallet', () => {
    expect(nextWalletBalance(10, 'wallet_credit', 5)).toBe(15);
    expect(nextWalletBalance(10, 'wallet_debit', 4)).toBe(6);
    expect(nextWalletBalance(10, 'debt', 4)).toBe(10);
  });

  it('updates outstanding for debt, repayment, and write-off', () => {
    expect(nextOutstandingBalance(20, 'debt', 5)).toBe(25);
    expect(nextOutstandingBalance(20, 'repayment', 8)).toBe(12);
    expect(nextOutstandingBalance(20, 'write_off', 20)).toBe(0);
  });

  it('blocks overdraft, overpay, and credit-limit breach', () => {
    expect(
      ledgerApplyError({
        wallet: 2,
        outstanding: 0,
        creditLimit: 0,
        type: 'wallet_debit',
        amount: 5,
      }),
    ).toBe('Wallet balance is not enough');
    expect(
      ledgerApplyError({
        wallet: 0,
        outstanding: 10,
        creditLimit: 50,
        type: 'repayment',
        amount: 12,
      }),
    ).toBe('Amount is more than the outstanding balance');
    expect(
      ledgerApplyError({
        wallet: 0,
        outstanding: 40,
        creditLimit: 50,
        type: 'debt',
        amount: 20,
      }),
    ).toBe('This would exceed the customer credit limit');
  });
});
