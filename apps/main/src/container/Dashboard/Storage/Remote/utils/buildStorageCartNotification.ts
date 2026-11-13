import { ACTION_META } from "../data/deviceActions";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

export function buildStorageCartNotification(items: CheckoutItem[]) {
  const first = items[0];
  if (!first) return null;
  const label = ACTION_META[first.kind].label;
  const count = items.length;
  return {
    title: "Added to cart",
    description: `${label} queued for ${count} device${count === 1 ? "" : "s"}. Review and submit when ready.`,
  };
}
