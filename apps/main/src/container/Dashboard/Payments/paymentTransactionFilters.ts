export type PaymentTransactionFilters = {
  search: string;
  method: string;
  locationId: string;
  startDate: string;
  endDate: string;
};

export const emptyPaymentTransactionFilters: PaymentTransactionFilters = {
  search: "",
  method: "",
  locationId: "",
  startDate: "",
  endDate: "",
};

export function paymentTransactionParams(filters: PaymentTransactionFilters) {
  return {
    locationId: filters.locationId || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    method: filters.method || undefined,
    limit: 100,
  };
}

export function paymentTransactionHasLocalFilter(
  filters: PaymentTransactionFilters,
): boolean {
  return Boolean(filters.search);
}
