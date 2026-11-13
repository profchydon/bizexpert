import { IOrder, ISubOrder } from "@/types/orders";

function isOfficeRecipient(subOrder?: ISubOrder | null): boolean {
  return subOrder?.recipient_type === "office" || Boolean(subOrder?.office_id);
}

const PRESERVED_WHEN_ORDER_COMPLETED = new Set([
  "completed",
  "cancelled",
  "order_cancelled",
  "awaiting_cancellation",
]);

export function displayStatusForCompletedOfficeOrder(
  status: string | null | undefined,
  order: Pick<IOrder, "status"> | null | undefined,
  subOrder: ISubOrder | null | undefined,
): string | null | undefined {
  if (!isOfficeRecipient(subOrder)) return status;
  if (order?.status?.toLowerCase() !== "completed") return status;
  const current = status?.toLowerCase() || "";
  if (PRESERVED_WHEN_ORDER_COMPLETED.has(current)) return status;
  return "completed";
}
