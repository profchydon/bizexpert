export const categoriesQueryKeys = {
  list: (businessId: string) => ["categories", businessId] as const,
};
