import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";

export type OrderSummaryFeeDisplay = {
  summary?: FeeSummaryLike;
  rows: FeeRow[];
  totalEquipment: number;
  isLoading: boolean;
  isError: boolean;
};

export function pickOrderSummaryFeeDisplay(args: {
  isApprovalOrderSummaryFlow: boolean;
  isEquipEmployeeFlow: boolean;
  isStorageActionsFlow: boolean;
  approval: OrderSummaryFeeDisplay;
  equip: OrderSummaryFeeDisplay;
  storageActions: OrderSummaryFeeDisplay;
  onboard: OrderSummaryFeeDisplay;
}): OrderSummaryFeeDisplay {
  if (args.isApprovalOrderSummaryFlow) return args.approval;
  if (args.isEquipEmployeeFlow) return args.equip;
  if (args.isStorageActionsFlow) return args.storageActions;
  return args.onboard;
}

export function countOrderSummaryItems(
  employees: Array<{ items?: unknown[] | null }> | undefined,
) {
  return (employees ?? []).reduce(
    (sum, employee) => sum + (employee.items?.length ?? 0),
    0,
  );
}
