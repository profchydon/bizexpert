import type { CancellationScope } from "@/utils/order-cancellation";
import type { RefundPreview } from "@/utils/refund-preview";
import type { CancelIntent } from "./cancelTypes";
import type { CancelScope } from "./buildCancelScope";

export interface CancelConsequence {
  headline: string;
  points: string[];
}

export const pendingRefundNotice =
  "Nothing is refunded yet. If work has already started, the refund is confirmed after Rayda reviews the request and may not be the full amount paid.";

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

function who(scope: CancelScope): string {
  if (scope.people.length === 1) return scope.people[0].name;
  return scope.people.length === 1
    ? "1 person"
    : `${scope.people.length} people`;
}

function what(scope: CancelScope): string {
  return `${plural(scope.exclusion.devices, "device")} for ${who(scope)}`;
}

function refundLine(preview: RefundPreview): string {
  if (!preview.destination) {
    return `${preview.headline} is owed, so nothing is sent back.`;
  }
  const tail =
    preview.destination.charAt(0).toLowerCase() + preview.destination.slice(1);
  return `${preview.headline} ${tail}.`;
}

interface Args {
  scope: CancelScope;
  cancellationScope: CancellationScope;
  preview: RefundPreview;
  orderId: string;
  isPreAccept: boolean;
}

export function buildCancelConsequence({
  scope,
  cancellationScope,
  preview,
  orderId,
  isPreAccept,
}: Args): CancelConsequence {
  const isFull = cancellationScope.kind === "full";

  if (isPreAccept) {
    return {
      headline: `${what(scope)} stop right now.`,
      points: [
        isFull
          ? `Rayda stops work on every sub-order in ${orderId}.`
          : "Rayda stops work on the devices listed on the previous step.",
        preview.unpaid
          ? "Nothing has been paid, so the invoice is voided instead."
          : refundLine(preview),
        isFull
          ? "This cannot be reversed, and the order cannot be reopened."
          : "This cannot be reversed.",
      ],
    };
  }

  return {
    headline: `Rayda will be asked to stop ${what(scope)}.`,
    points: [
      "Work continues on those devices until an admin approves the request.",
      preview.unpaid
        ? "Nothing is refunded either way, because this order has not been paid."
        : pendingRefundNotice,
      "If approved; requested items in this order will not be fulfilled",
    ],
  };
}

export function doneSummary(scope: CancellationScope): string {
  if (scope.kind === "full") return "The order has been cancelled.";
  if (scope.kind === "sub-orders") {
    return "The selected sub-orders have been cancelled.";
  }
  return scope.itemIds.length === 1
    ? "The item has been cancelled."
    : "The selected devices have been cancelled.";
}

export function commitLabel(
  cancellationScope: CancellationScope,
  isPreAccept: boolean,
): string {
  if (!isPreAccept) return "Send request";
  if (cancellationScope.kind === "items") {
    return cancellationScope.itemIds.length > 1
      ? "Cancel devices"
      : "Cancel device";
  }
  return cancellationScope.kind === "sub-orders"
    ? "Cancel sub-orders"
    : "Cancel order";
}

export function modalTitle(args: {
  intent: CancelIntent;
  item?: { name: string };
  cancellationScope: CancellationScope;
  scope: CancelScope;
  orderId: string;
}): string {
  const { intent, item, cancellationScope, scope, orderId } = args;
  if (intent.type === "item") return `Cancel ${item?.name ?? "this item"}?`;
  if (cancellationScope.kind === "items") {
    const count = cancellationScope.itemIds.length;
    if (count === 0) return "Select a device to cancel";
    return count === 1 ? "Cancel 1 device?" : `Cancel ${count} devices?`;
  }
  if (cancellationScope.kind !== "sub-orders" || scope.people.length === 0) {
    return `Are you sure you want to cancel order ${orderId}?`;
  }
  return scope.people.length === 1
    ? `Cancel ${scope.people[0].name}'s sub-order?`
    : `Cancel ${scope.people.length} sub-orders?`;
}
