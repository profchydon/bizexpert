"use client";

import routes from "@/routes";
import { useAppDispatch } from "@/store";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { IEmployees } from "@/types/employees";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { clearCheckout } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import { setStorageUnifiedOrder } from "@/container/Dashboard/Storage/Remote/hooks/useStorageUnifiedOrder";
import { mapCheckoutItemToOrderSummaryCart } from "@/container/Dashboard/Storage/Remote/utils/mapCheckoutItemToOrderSummaryCart";
import type { StorageServiceFeeTable } from "@/container/Dashboard/Storage/Remote/utils/storageServiceFees";

export const STORAGE_ACTIONS_FLOW = "storage-actions";

export function storageActionsOrderSummaryPath() {
  return `${routes.EQUIP_EMPLOYEE_ORDER_SUMMARY}?flow=${STORAGE_ACTIONS_FLOW}`;
}

export function useStorageActionsCheckout() {
  const { push, isPending } = useTransitionRouter();
  const dispatch = useAppDispatch();

  const proceedToOrderSummary = (
    actionItems: CheckoutItem[],
    feeTable?: StorageServiceFeeTable | null,
  ) => {
    if (!actionItems.length) return;

    dispatch(clearDeviceRefreshFlowState());
    setStorageUnifiedOrder({
      id: `UO-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      actionItems,
    });
    dispatch(
      setSelectedEmployees([
        {
          id: UNASSIGNED_ORDER_SUMMARY_KEY,
          items: actionItems.map((item) =>
            mapCheckoutItemToOrderSummaryCart(item, feeTable),
          ),
        } as unknown as IEmployees,
      ]),
    );
    clearCheckout();
    push(storageActionsOrderSummaryPath());
  };

  return { proceedToOrderSummary, isPending };
}
