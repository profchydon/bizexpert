export function paymentConfirmLabel(isLoading: boolean) {
  return isLoading ? "Redirecting…" : "Confirm";
}

export function canClosePaymentMethod(isLoading: boolean) {
  return !isLoading;
}

export function canConfirmPaymentMethod({
  isLoading,
  tabState,
  selectedCardValue,
}: {
  isLoading: boolean;
  tabState: string;
  selectedCardValue?: string;
}) {
  if (isLoading) {
    return false;
  }

  if (tabState === "Credit") {
    return true;
  }

  return Boolean(selectedCardValue);
}
