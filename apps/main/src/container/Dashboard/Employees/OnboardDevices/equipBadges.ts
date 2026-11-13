import type { EquipDeviceItem, StorageCondition } from "./equipTypes";

export type EquipBadgeVariant =
  | "success"
  | "blue"
  | "pending"
  | "error"
  | "gray";

export const conditionVariant = (
  condition: StorageCondition | undefined,
): EquipBadgeVariant => {
  switch (condition) {
    case "Excellent":
      return "success";
    case "Good":
      return "blue";
    case "Fair":
      return "pending";
    case "Poor":
      return "error";
    default:
      return "gray";
  }
};

export const sourceBadgeVariant = (
  item: EquipDeviceItem,
): EquipBadgeVariant => {
  if (item.origin === "FROM_POLICY") return "blue";
  if (item.source === "STORAGE") return conditionVariant(item.condition);
  if (item.source === "RFQ") return "pending";
  return "gray";
};

export const formatSourceLabel = (item: EquipDeviceItem): string => {
  if (item.origin === "FROM_POLICY") return "From policy";
  if (item.source === "STORAGE")
    return item.condition ? `Storage · ${item.condition}` : "Storage";
  if (item.source === "RFQ") return "Request quote";
  return "Marketplace";
};
