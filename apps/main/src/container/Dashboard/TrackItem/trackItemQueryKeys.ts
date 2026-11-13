export const trackItemQueryKeys = {
  lookup: (businessId: string, query: string) =>
    ["track-item", businessId, query] as const,
  balances: (businessId: string, productId: string) =>
    ["track-item-balances", businessId, productId] as const,
  movements: (businessId: string, productId: string) =>
    ["track-item-movements", businessId, productId] as const,
};
