export const customersQueryKeys = {
  list: (businessId: string) => ["customers", businessId] as const,
  detail: (businessId: string, customerId: string) =>
    ["customer", businessId, customerId] as const,
};
