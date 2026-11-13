export function shouldClearCartForCheckout({
  enabled,
  transactionId,
  clearedForTransactionId,
}: {
  enabled: boolean;
  transactionId?: string | null;
  clearedForTransactionId?: string | null;
}) {
  if (!enabled || !transactionId) {
    return false;
  }

  return clearedForTransactionId !== transactionId;
}
