import type { EquipmentFilterValues } from "./equipmentFilterOptions";

export type EquipmentTableQueryFilters = {
  type?: string;
  status?: string;
  storage?: string;
  memory?: string;
  country?: string;
  source?: string;
  from?: string;
  to?: string;
};

export const buildEquipmentTableQueryFilters = (
  values: EquipmentFilterValues,
  extras?: Pick<EquipmentTableQueryFilters, "source" | "from" | "to">,
): EquipmentTableQueryFilters => {
  const type = values.selectedAssetTypes.join(",") || undefined;
  const status = values.selectedStatus.join(",") || undefined;
  const storage =
    values.selectedStorage?.map((entry) => entry.value).join(",") || undefined;
  const memory =
    values.selectedRam?.map((entry) => entry.value).join(",") || undefined;
  const country =
    values.selectedCountries?.map((entry) => entry.label).join(",") ||
    undefined;

  const filters: EquipmentTableQueryFilters = {
    type,
    status,
    storage,
    memory,
    country,
  };

  if (extras?.source) filters.source = extras.source;
  if (extras?.from) filters.from = extras.from;
  if (extras?.to) filters.to = extras.to;

  return filters;
};
