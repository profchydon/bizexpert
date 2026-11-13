import type { SelectItemType } from "@/components/base/select/select";
import { toAssetTypeOptions } from "./AddEquipment/assetTypeSelect";
import { removeUserscore } from "@/utils/underScoreTransformer";

export const EQUIPMENT_STATE_ITEMS: SelectItemType[] = [
  { id: "Brand_New", label: "Brand new" },
  { id: "Used", label: "Used" },
];

export const toEquipmentTypeItems = (
  types?: { id: string; name: string }[] | null,
): SelectItemType[] =>
  toAssetTypeOptions(types).map((type) => ({
    id: type.name,
    label: type.name,
  }));

export const withCurrentSelectOption = (
  items: SelectItemType[],
  value: string,
): SelectItemType[] => {
  if (!value || items.some((item) => item.id === value)) return items;
  return [{ id: value, label: removeUserscore(value) || value }, ...items];
};
