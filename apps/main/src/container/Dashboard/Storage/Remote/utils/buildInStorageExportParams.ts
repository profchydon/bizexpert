import type { SortDescriptor } from "react-aria-components";
import type { IInStorageInventoryExportParams } from "@/types/equipmentsInStorageInventory";
import type { InventoryFilters } from "../types/storage";
import { buildInStorageInventoryParams } from "./buildInStorageInventoryParams";

interface BuildExportParamsInput {
  filters: InventoryFilters;
  sort: SortDescriptor;
}

export function buildInStorageExportParams({
  filters,
  sort,
}: BuildExportParamsInput): IInStorageInventoryExportParams {
  const { page, per_page, group_by, ...rest } = buildInStorageInventoryParams({
    filters,
    sort,
    page: 1,
    pageSize: 15,
    grouped: false,
  });

  return rest;
}
