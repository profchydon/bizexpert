import type { LocationType } from "@/types/bizexpert";

export const LOCATION_TYPE_OPTIONS: Array<{
  value: LocationType;
  label: string;
}> = [
  { value: "shop", label: "Regular store" },
  { value: "warehouse", label: "Warehouse" },
  { value: "branch", label: "Regular store" },
];

export function formatLocationType(type: string): string {
  if (type === "warehouse") return "Warehouse";
  if (type === "shop" || type === "branch") return "Regular store";
  return type;
}
