export type LedgerType =
  | 'wallet_credit'
  | 'wallet_debit'
  | 'debt'
  | 'repayment'
  | 'write_off';

export function nextWalletBalance(
  current: number,
  type: LedgerType,
  amount: number,
): number {
  if (type === 'wallet_credit') return current + amount;
  if (type === 'wallet_debit') return current - amount;
  return current;
}

export function nextOutstandingBalance(
  current: number,
  type: LedgerType,
  amount: number,
): number {
  if (type === 'debt') return current + amount;
  if (type === 'repayment' || type === 'write_off') return current - amount;
  return current;
}

export function ledgerApplyError(args: {
  wallet: number;
  outstanding: number;
  creditLimit: number;
  type: LedgerType;
  amount: number;
}): string | null {
  if (args.amount <= 0) return 'Amount must be greater than 0';
  if (args.type === 'wallet_debit' && args.amount > args.wallet) {
    return 'Wallet balance is not enough';
  }
  if (
    (args.type === 'repayment' || args.type === 'write_off') &&
    args.amount > args.outstanding
  ) {
    return 'Amount is more than the outstanding balance';
  }
  if (args.type === 'debt') {
    const next = args.outstanding + args.amount;
    if (args.creditLimit > 0 && next > args.creditLimit) {
      return 'This would exceed the customer credit limit';
    }
  }
  return null;
}
