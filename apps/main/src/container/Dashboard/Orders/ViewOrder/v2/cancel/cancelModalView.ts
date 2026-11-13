import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import type {
  CancellationReasonId,
  CancellationScope,
} from "@/utils/order-cancellation";
import {
  mapApiRefundPreview,
  type RefundPreview,
} from "@/utils/refund-preview";
import { IOrder } from "@/types/orders";
import { getSubOrders } from "../orderContentLines";
import { subOrderEmployeeId } from "../subOrderIdentity";
import {
  buildCancelConsequence,
  type CancelConsequence,
} from "./buildCancelConsequence";
import { buildCancelScope, type CancelScope } from "./buildCancelScope";
import type { CancelEmpRow } from "./cancelData";
import type { CancelIntent } from "./cancelTypes";

export interface CancelOrderModalArgs {
  order: IOrder;
  companyId?: string;
  intent: CancelIntent;
  employees: CancelEmpRow[];
  isPreAccept: boolean;
  onSubmit: (input: {
    scope: CancellationScope;
    reasonId: CancellationReasonId;
    details: string;
    employeeIds?: string[];
    suborderIds?: string[];
  }) => Promise<{
    ok: boolean;
    instant?: boolean;
    refund_preview?: CancellationPreviewResponse["refund_preview"];
  }>;
}

export function spentByEmployee(
  order: IOrder,
  preview?: CancellationPreviewResponse | null,
): Record<string, number> {
  const map: Record<string, number> = {};
  preview?.refund_preview.line_items?.forEach((line) => {
    const sub = getSubOrders(order).find((entry) => entry.id === line.id);
    if (!sub) return;
    const employeeId = subOrderEmployeeId(sub);
    map[employeeId] = (map[employeeId] ?? 0) + (line.spent_services ?? 0);
  });
  return map;
}

export function cancelModalPreview(args: {
  order: IOrder;
  previewData?: CancellationPreviewResponse | null;
  cancelScope: CancelScope;
  prefix: string;
  scope: CancellationScope;
  isPreAccept: boolean;
}): { preview: RefundPreview; consequence: CancelConsequence } {
  const { order, previewData, cancelScope, prefix, scope, isPreAccept } = args;
  const preview = previewData
    ? mapApiRefundPreview(previewData.refund_preview)
    : mapApiRefundPreview({
        currency: prefix.trim(),
        payment_method: order.payment_method ?? "",
        rail: "card",
        amount_paid: cancelScope.total,
        spent_services: cancelScope.spent,
        refundable_before_fee: cancelScope.total,
        gateway_fee: 0,
        net_refund: cancelScope.total,
        rows: [],
        policy_rules: [],
      });

  return {
    preview,
    consequence: buildCancelConsequence({
      scope: cancelScope,
      cancellationScope: scope,
      preview,
      orderId: order.order_number || order.id,
      isPreAccept,
    }),
  };
}

export function modalCancelScope(args: {
  order: IOrder;
  employees: CancelEmpRow[];
  intent: CancelIntent;
  item?: CancelEmpRow["items"][number];
  scope: CancellationScope;
  selectedIds: Set<string>;
  selectedLineIds: string[];
  previewData?: CancellationPreviewResponse | null;
}) {
  const isOffboarding = args.order.type === "offboarding";
  return buildCancelScope({
    employees: args.employees,
    intent: args.intent,
    item: args.item,
    scope: args.scope,
    selectedIds: args.selectedIds,
    isOffboarding,
    spentBySuborder: spentByEmployee(args.order, args.previewData),
    selectedLineIds: new Set(args.selectedLineIds),
  });
}
