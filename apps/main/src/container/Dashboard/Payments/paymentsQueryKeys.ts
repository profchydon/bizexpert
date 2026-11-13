export type PaymentTransactionQuery = {
  method: string;
  locationId: string;
  startDate: string;
  endDate: string;
};

export const paymentsQueryKeys = {
  list: (businessId: string) => ["payments", businessId] as const,
  transactions: (businessId: string, query: PaymentTransactionQuery) =>
    ["payments", businessId, "transactions", query] as const,
};
