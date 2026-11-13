export const inventoryQueryKeys = {
  balances: (businessId: string, locationId: string | null) =>
    ["inventory-balances", businessId, locationId] as const,
  movements: (businessId: string, locationId: string | null) =>
    ["inventory-movements", businessId, locationId] as const,
  transfers: (businessId: string) =>
    ["inventory-transfers", businessId] as const,
  stocktakes: (businessId: string, locationId: string | null) =>
    ["inventory-stocktakes", businessId, locationId] as const,
  stocktake: (businessId: string, stocktakeId: string) =>
    ["inventory-stocktake", businessId, stocktakeId] as const,
  products: (businessId: string) => ["inventory-products", businessId] as const,
};
