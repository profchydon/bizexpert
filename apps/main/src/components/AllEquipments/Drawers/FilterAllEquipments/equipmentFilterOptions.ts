import type { MultiSelectValue } from "@/components/ui/autocomplete";
import type { SelectItemType } from "@/components/base/select/select";

export const EQUIPMENT_FILTER_STATUSES = [
  "sold",
  "assigned",
  "unassigned",
  "in_storage",
] as const;

export const EQUIPMENT_RAM_ITEMS: SelectItemType[] = [
  { id: "4GB", label: "4GB" },
  { id: "8GB", label: "8GB" },
  { id: "16GB", label: "16GB" },
  { id: "32GB", label: "32GB" },
];

export const EQUIPMENT_STORAGE_ITEMS: SelectItemType[] = [
  { id: "128GB", label: "128GB SSD" },
  { id: "256GB", label: "256GB SSD" },
  { id: "512GB", label: "512GB SSD" },
  { id: "1TB", label: "1TB SSD" },
];

export type EquipmentFilterValues = {
  selectedAssetTypes: string[];
  selectedStatus: string[];
  selectedStorage: MultiSelectValue;
  selectedRam: MultiSelectValue;
  selectedCountries: MultiSelectValue;
};

export const EMPTY_EQUIPMENT_FILTER_VALUES: EquipmentFilterValues = {
  selectedAssetTypes: [],
  selectedStatus: [],
  selectedStorage: [],
  selectedRam: [],
  selectedCountries: [],
};

export const normalizeEquipmentFilterValues = (
  values: Partial<EquipmentFilterValues> | undefined,
): EquipmentFilterValues => ({
  selectedAssetTypes: values?.selectedAssetTypes ?? [],
  selectedStatus: values?.selectedStatus ?? [],
  selectedStorage: values?.selectedStorage ?? [],
  selectedRam: values?.selectedRam ?? [],
  selectedCountries: values?.selectedCountries ?? [],
});
