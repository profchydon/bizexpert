export function canSubmitApprovalRfqQuote({
  companyId,
  responseId,
  selectedDeviceIds,
}: {
  companyId?: string;
  responseId?: string;
  selectedDeviceIds: string[];
}) {
  return Boolean(companyId && responseId && selectedDeviceIds.length > 0);
}

export async function clearCartAfterApprovalRfqAccept({
  clearCart,
  wasAccepted,
}: {
  clearCart: () => Promise<void> | void;
  wasAccepted: boolean;
}) {
  if (!wasAccepted) return false;

  await clearCart();
  return true;
}
