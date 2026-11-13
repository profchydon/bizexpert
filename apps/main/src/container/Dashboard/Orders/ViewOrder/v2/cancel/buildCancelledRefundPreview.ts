import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import { IOrder } from "@/types/orders";
import {
  currencyPrefix,
  mapApiRefundPreview,
  parseAmount,
  type RefundPreview,
} from "@/utils/refund-preview";
import type { CancelEmpRow } from "./cancelData";

const round = (value: number) => Math.round(value * 100) / 100;

function refundRailFromPayment(paymentMethod?: string | null): string {
  const normalized = (paymentMethod ?? "").trim().toLowerCase();
  if (normalized.includes("wallet") || normalized.includes("credit")) {
    return "credit-wallet";
  }
  if (normalized.includes("invoice")) return "invoice";
  if (
    normalized.includes("bank") ||
    normalized.includes("ach") ||
    normalized.includes("wire")
  ) {
    return "bank-transfer";
  }
  return "card";
}

export function cancelledTotal(
  employees: CancelEmpRow[],
  orderTotal: number,
): number {
  const items = employees.flatMap((employee) => employee.items);
  const wasCancelled = (item: CancelEmpRow["items"][number]) =>
    item.cancelled || item.fulfillmentStage === "cancelled";

  if (!items.some(wasCancelled)) {
    return orderTotal;
  }

  if (items.every(wasCancelled)) {
    return orderTotal;
  }

  return round(
    items.reduce(
      (sum, item) => (wasCancelled(item) ? sum + item.price : sum),
      0,
    ),
  );
}

export function buildCancelledRefundPreview(
  order: IOrder,
  employees: CancelEmpRow[],
): RefundPreview {
  const stored = order.cancellation_refund_preview;
  if (stored) {
    return mapApiRefundPreview(
      stored as unknown as CancellationPreviewResponse["refund_preview"],
    );
  }

  const prefix = currencyPrefix(order.currency);
  const amount = cancelledTotal(employees, parseAmount(order.total_amount));
  const rail = refundRailFromPayment(order.payment_method);

  return mapApiRefundPreview({
    currency: prefix.trim(),
    payment_method: order.payment_method ?? "",
    rail,
    amount_paid: amount,
    spent_services: 0,
    refundable_before_fee: amount,
    gateway_fee: 0,
    net_refund: amount,
    rows: [
      { label: "Paid", value: amount },
      { label: "You will receive", value: amount },
    ],
    policy_rules: [],
  } satisfies CancellationPreviewResponse["refund_preview"]);
}
