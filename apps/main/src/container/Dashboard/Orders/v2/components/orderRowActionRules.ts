import { IOrder, ISubOrder } from "@/types/orders";
import { NON_UPDATABLE_STATUSES } from "../../ViewOrder/orderSignatureRules";

export const SIGNATURE_PARTIALLY_REQUESTED = "partially_requested";
export const SIGNATURE_REQUESTED = "requested";

function getSubOrders(order?: IOrder): ISubOrder[] {
  const raw = order?.sub_orders;
  if (Array.isArray(raw)) return raw;
  return (raw as { data?: ISubOrder[] } | undefined)?.data ?? [];
}

export function getOrderSignatureStatus(order?: IOrder): string {
  const status = (
    order as { signature_requested?: string | boolean } | undefined
  )?.signature_requested;
  if (typeof status === "boolean") return status ? SIGNATURE_REQUESTED : "";
  return (status ?? "").toLowerCase();
}

export function hasTransactionReference(order?: IOrder): boolean {
  return Boolean(order?.transaction_id);
}

export function isSignatureActionAvailable(order?: IOrder): boolean {
  if (!order) return false;

  const status = getOrderSignatureStatus(order);
  const isBuyToStorage = order.type === "buy_to_storage";
  const statusLower = order.status?.toLowerCase() || "";
  const isStatusLocked = NON_UPDATABLE_STATUSES.includes(statusLower);
  const subOrders = getSubOrders(order);
  const isOnlyStorageSubOrder =
    subOrders.length === 1 && subOrders[0]?.type === "storage";

  return (
    status !== SIGNATURE_PARTIALLY_REQUESTED &&
    !isBuyToStorage &&
    !isOnlyStorageSubOrder &&
    !isStatusLocked
  );
}

export function isSignatureCurrentlyRequired(order?: IOrder): boolean {
  return getOrderSignatureStatus(order) === SIGNATURE_REQUESTED;
}

export function getSignatureActionLabel(order?: IOrder): string {
  return isSignatureCurrentlyRequired(order)
    ? "Remove signature requirement"
    : "Enable signature requirement";
}
