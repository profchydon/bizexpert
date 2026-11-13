export const stockRemovalsQueryKeys = {
  list: (businessId: string) => ["stock-removals", businessId] as const,
};
