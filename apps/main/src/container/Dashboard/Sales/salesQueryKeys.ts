export const salesQueryKeys = {
  list: (businessId: string) => ["sales", businessId] as const,
  detail: (businessId: string, saleId: string) =>
    ["sale", businessId, saleId] as const,
};
