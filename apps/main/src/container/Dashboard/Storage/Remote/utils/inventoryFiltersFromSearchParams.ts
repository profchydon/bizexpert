import { INITIAL_FILTERS, type InventoryFilters } from "../types/storage";

export function inventoryFiltersFromSearchParams(
  params: Pick<URLSearchParams, "get">,
): InventoryFilters {
  const raw = params.get("needs_action");
  const needsAction = raw === "1" || raw?.toLowerCase() === "true";

  return {
    ...INITIAL_FILTERS,
    needsAction,
  };
}
