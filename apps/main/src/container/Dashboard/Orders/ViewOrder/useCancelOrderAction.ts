import { useState } from "react";
import { useCancelOrderMutation } from "@/api/baseQueries/companiesApi/ordersApi/cancelOrder";
import { canCancelOrder } from "@/utils/cancellationEligibility";
import displayCancellationSuccess from "@/utils/displayCancellationSuccess";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { IOrder } from "@/types/orders";

interface Params {
  companyId?: string;
  order?: IOrder;
}

const useCancelOrderAction = ({ companyId, order }: Params) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelScope, setCancelScope] = useState<{
    employeeIds?: string[];
    suborderIds?: string[];
  }>();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const showCancelButton = canCancelOrder(order);

  const handleConfirmCancel = async (
    reason: string,
    additionalDetails: string,
    scope?: { employeeIds?: string[]; suborderIds?: string[] },
  ): Promise<boolean> => {
    try {
      const response = await cancelOrder({
        companyId,
        orderId: order?.id,
        reason,
        additional_details: additionalDetails,
        employee_ids: scope?.employeeIds,
        suborder_ids: scope?.suborderIds,
      }).unwrap();
      if (!scope?.suborderIds?.length && !scope?.employeeIds?.length) {
        setCancelModalOpen(false);
      }
      displayCancellationSuccess(
        Boolean(response?.data?.instant),
        response?.data?.refund_status,
      );
      return true;
    } catch (error: any) {
      displayErrorMessage(
        "Failed to cancel order",
        error?.data?.message || "Something went wrong. Please try again.",
      );
      return false;
    }
  };

  return {
    cancelModalOpen,
    setCancelModalOpen,
    cancelScope,
    openCancelModal: (scope?: {
      employeeIds?: string[];
      suborderIds?: string[];
    }) => {
      setCancelScope(scope);
      setCancelModalOpen(true);
    },
    isCancelling,
    showCancelButton,
    handleConfirmCancel,
  };
};

export default useCancelOrderAction;
