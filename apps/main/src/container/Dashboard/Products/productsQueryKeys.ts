export const productsQueryKeys = {
  list: (businessId: string) => ["products", businessId] as const,
  detail: (businessId: string, productId: string) =>
    ["product", businessId, productId] as const,
};
