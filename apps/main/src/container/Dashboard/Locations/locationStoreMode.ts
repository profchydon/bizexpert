import type { LocationType } from "@/types/bizexpert";

export type StoreMode = "regular" | "warehouse";

export const STORE_MODE_OPTIONS: Array<{ value: StoreMode; label: string }> = [
  { value: "regular", label: "Regular store" },
  { value: "warehouse", label: "Warehouse" },
];

export function locationTypeToStoreMode(type: LocationType): StoreMode {
  return type === "warehouse" ? "warehouse" : "regular";
}

export function storeModeToLocationType(
  mode: StoreMode,
  previous?: LocationType,
): LocationType {
  if (mode === "warehouse") return "warehouse";
  return previous === "branch" ? "branch" : "shop";
}
