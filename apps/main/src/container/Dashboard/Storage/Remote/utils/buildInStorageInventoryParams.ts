import type { SortDescriptor } from "react-aria-components";
import type { IInStorageInventoryParams } from "@/types/equipmentsInStorageInventory";
import type { InventoryFilters } from "../types/storage";
import {
  mapDeviceTypeToAssetType,
  mapSortColumn,
  mapUiStatusToApi,
  mapUiWipeToApi,
} from "./inStorageInventoryMaps";

interface BuildParamsInput {
  filters: InventoryFilters;
  sort: SortDescriptor;
  page: number;
  pageSize: number;
  grouped?: boolean;
}

export function buildInStorageInventoryParams({
  filters,
  sort,
  page,
  pageSize,
  grouped,
}: BuildParamsInput): IInStorageInventoryParams {
  const params: IInStorageInventoryParams = {
    page,
    per_page: pageSize,
  };

  const search = filters.search.trim();
  if (search) params.search = search;

  const resolvedCountryId =
    filters.countryId !== "all" ? filters.countryId : undefined;
  if (resolvedCountryId) params.country_id = resolvedCountryId;

  if (filters.source !== "all") params.source = filters.source;
  if (filters.grade !== "all") params.grade = filters.grade;
  if (filters.needsAction) params.needs_action = true;

  const storageStatus = mapUiStatusToApi(filters.status);
  if (storageStatus) params.storage_status = storageStatus;

  const wipeStatus = mapUiWipeToApi(filters.wipe);
  if (wipeStatus) params.wipe_status = wipeStatus;

  if (filters.deviceType !== "all") {
    params.asset_type = mapDeviceTypeToAssetType(filters.deviceType);
  }

  const sortBy = mapSortColumn(sort.column ?? "entry");
  if (sortBy) {
    params.sort_by = sortBy;
    params.sort_dir = sort.direction === "ascending" ? "asc" : "desc";
  }

  if (grouped) params.group_by = "country";

  return params;
}
