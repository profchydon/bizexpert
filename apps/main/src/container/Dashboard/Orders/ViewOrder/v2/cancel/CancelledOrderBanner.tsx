"use client";

import { SlashCircle01 } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { RefundSummaryRows } from "@/components/application/refund/refund-summary";
import {
  type CancellationInfo,
  reasonLabel,
  scopeLabel,
} from "@/utils/order-cancellation";
import { IOrder } from "@/types/orders";
import type { CancelEmpRow } from "./cancelData";
import { buildCancelledRefundPreview } from "./buildCancelledRefundPreview";

interface Props {
  order: IOrder;
  info: CancellationInfo | null;
  employees: CancelEmpRow[];
  totals: { subOrders: number; items: number };
}

export function CancelledOrderBanner({
  order,
  info,
  employees,
  totals,
}: Props) {
  const preview = buildCancelledRefundPreview(order, employees);

  const byRayda = info?.requestedBy === "Rayda";
  const attribution = !info
    ? "This order was cancelled before fulfillment completed."
    : byRayda
      ? "Rayda could not complete this order and has cancelled it."
      : info.selfServe
        ? `Cancelled by ${info.requestedBy} before a vendor accepted the order.`
        : `${info.requestedBy} requested the cancellation and a Rayda admin approved it.`;

  return (
    <Banner
      tone="error"
      icon={SlashCircle01}
      title="Order cancelled"
      description={`${attribution} It is kept here for reference and no further changes can be made.`}
      meta={
        info ? (
          <>
            Scope: {scopeLabel(info.scope, totals)}.
            {byRayda ? "" : ` Reason: ${reasonLabel(info.reasonId)}.`}
            {!byRayda && info.details ? ` ${info.details}` : ""}
          </>
        ) : undefined
      }
    >
      <div className="rounded-lg bg-primary p-4">
        <p className="mb-2 text-sm font-semibold text-primary">
          Refund summary
        </p>
        <RefundSummaryRows preview={preview} />
      </div>
    </Banner>
  );
}
