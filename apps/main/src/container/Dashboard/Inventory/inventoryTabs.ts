export const INVENTORY_TABS = [
  { id: "balances", label: "Balances" },
  { id: "transfers", label: "In transit" },
  { id: "movements", label: "History" },
  { id: "stocktake", label: "Stocktake" },
] as const;

export type InventoryTab = (typeof INVENTORY_TABS)[number]["id"];

export const INVENTORY_ACTIONS = [
  "opening",
  "receive",
  "adjust",
  "transfer",
] as const;

export type InventoryAction = (typeof INVENTORY_ACTIONS)[number];

export function isInventoryTab(value: string): value is InventoryTab {
  return INVENTORY_TABS.some((tab) => tab.id === value);
}
