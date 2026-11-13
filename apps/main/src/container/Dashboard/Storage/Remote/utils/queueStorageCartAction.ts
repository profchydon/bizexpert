import {
  trackStorageActionQueued,
  uniqueStorageActionKind,
} from "@/lib/orderFlowAnalytics";
import { addCartActions } from "../hooks/useStorageCartActions";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

export async function queueStorageCartAction(
  items: CheckoutItem[],
  onSuccess: () => void,
  onError?: (error: unknown) => void,
) {
  try {
    await addCartActions(items);
    trackStorageActionQueued(
      uniqueStorageActionKind(items.map((item) => item.kind)),
    );
    onSuccess();
  } catch (error) {
    onError?.(error);
  }
}
