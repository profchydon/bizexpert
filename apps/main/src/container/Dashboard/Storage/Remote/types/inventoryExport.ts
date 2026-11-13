import type { SortDescriptor } from "react-aria-components";
import type { InventoryFilters } from "./storage";

export interface StorageInventoryExportContext {
  filters: InventoryFilters;
  sort: SortDescriptor;
}

export const DEFAULT_INVENTORY_EXPORT_SORT: SortDescriptor = {
  column: "entry",
  direction: "descending",
};
