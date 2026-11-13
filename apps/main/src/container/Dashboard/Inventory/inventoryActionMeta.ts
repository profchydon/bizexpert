import type { InventoryAction } from "./inventoryTabs";

export const inventoryActionMeta: Record<
  InventoryAction,
  { title: string; description: string; ariaLabel: string }
> = {
  opening: {
    title: "Opening stock",
    description: "One-time opening quantity per product and location.",
    ariaLabel: "Opening stock",
  },
  receive: {
    title: "Receive stock",
    description: "Record goods received into this location.",
    ariaLabel: "Receive stock",
  },
  adjust: {
    title: "Adjust stock",
    description: "Post a quantity correction with an audit reason.",
    ariaLabel: "Adjust stock",
  },
  transfer: {
    title: "Dispatch transfer",
    description: "Move stock between locations.",
    ariaLabel: "Dispatch transfer",
  },
};
