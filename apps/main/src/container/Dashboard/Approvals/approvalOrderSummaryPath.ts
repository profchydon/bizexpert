import routes from "@/routes";
import type { ApprovalActionOptions } from "./types";

type ApprovalOrderSummaryPathArgs = {
  catalogId?: string | null;
  options?: ApprovalActionOptions;
  orderRequestId?: string | null;
  returnPath?: string;
};

export function approvalOrderSummaryPath({
  catalogId,
  options,
  orderRequestId,
  returnPath,
}: ApprovalOrderSummaryPathArgs = {}) {
  if (!catalogId || !orderRequestId) return routes.EQUIP_EMPLOYEE_ORDER_SUMMARY;
  const params = new URLSearchParams({
    approvalAcknowledgeBudgetWarning: String(
      Boolean(options?.acknowledgeBudgetWarning),
    ),
    approvalCatalogId: catalogId,
    approvalOrderRequestId: orderRequestId,
  });
  if (returnPath) params.set("approvalReturnPath", returnPath);

  const path =
    returnPath === routes.EMPLOYEE
      ? routes.EMPLOYEE_ORDER_SUMMARY
      : routes.EQUIP_EMPLOYEE_ORDER_SUMMARY;
  return `${path}?${params.toString()}`;
}
