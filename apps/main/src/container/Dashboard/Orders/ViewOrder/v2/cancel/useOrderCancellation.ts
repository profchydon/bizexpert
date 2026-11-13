"use client";

import { useCallback, useMemo, useState } from "react";
import { useCancelOrderMutation } from "@/api/baseQueries/companiesApi/ordersApi/cancelOrder";
import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import { useWithdrawCancellationRequestMutation } from "@/api/baseQueries/companiesApi/ordersApi/withdrawCancellationRequest";
import { IOrder } from "@/types/orders";
import {
  canShowOrderCancelButton,
  getSubOrdersFromOrder,
  hasUncancellableDevices,
  isInstantCancellation,
  orderCancelUnavailableMessage,
  orderCutoffMessage,
} from "@/utils/cancellationEligibility";
import displayErrorMessage from "@/utils/displayErrorMessage";
import {
  type CancellationReasonId,
  type CancellationScope,
  reasonLabelForApi,
} from "@/utils/order-cancellation";
import { cancelGroupKey } from "../subOrderIdentity";
import {
  buildCancelEmployees,
  employeeIdsForIntent,
  suborderIdsForIntent,
  type CancelEmpRow,
} from "./cancelData";
import type { CancelIntent, OpenCancelInput } from "./cancelTypes";
import {
  canCancelSubOrder as employeeCanCancel,
  deriveCancellationInfo,
  deriveCancellationView,
} from "./mapCancellationInfo";
import { cancellationSubmitResult } from "./cancellationSubmitResult";
import type { OrderCancellationState } from "./orderCancellationState";

export type { OrderCancellationState };

const INTENTS = { order: true, "sub-orders": true, item: true } as const;

interface Args {
  companyId?: string;
  order?: IOrder;
  onSuccess?: () => void;
  onModalClose?: () => void;
}

export function useOrderCancellation({
  companyId,
  order,
  onSuccess,
  onModalClose,
}: Args): OrderCancellationState {
  const [intent, setIntent] = useState<CancelIntent | null>(null);
  const [cancelOrder, { isLoading: isSubmitting }] = useCancelOrderMutation();
  const [withdraw, { isLoading: isWithdrawing }] =
    useWithdrawCancellationRequestMutation();

  const employees = useMemo(
    () => (order ? buildCancelEmployees(order) : []),
    [order],
  );

  const view = order ? deriveCancellationView(order) : "none";
  const info = order ? deriveCancellationInfo(order) : null;
  const isTerminal =
    order?.status === "cancelled" ||
    order?.status === "completed" ||
    view === "cancelled";
  const isLive = !isTerminal && view !== "requested";
  const uncancellableDevices = order ? hasUncancellableDevices(order) : true;
  const canCancel =
    isLive &&
    employees.length > 0 &&
    canShowOrderCancelButton(order) &&
    !uncancellableDevices;
  const isPreAccept = isInstantCancellation(order);

  const openCancelModal = useCallback(
    (input?: OpenCancelInput) => {
      if (input && "suborderIds" in input && order) {
        const employeeIds = getSubOrdersFromOrder(order)
          .filter((sub) => input.suborderIds.includes(sub.id))
          .map((sub) => cancelGroupKey(order, sub));
        setIntent({ type: "sub-orders", employeeIds });
        return;
      }
      setIntent(
        input && "type" in input && input.type in INTENTS
          ? input
          : { type: "order" },
      );
    },
    [order],
  );

  const closeCancelModal = useCallback(() => {
    setIntent(null);
    onModalClose?.();
  }, [onModalClose]);

  const submitCancellation = useCallback(
    async ({
      scope,
      reasonId,
      details,
      employeeIds: employeeIdsOverride,
      suborderIds: suborderIdsOverride,
    }: {
      scope: CancellationScope;
      reasonId: CancellationReasonId;
      details: string;
      employeeIds?: string[];
      suborderIds?: string[];
    }) => {
      if (!order || !companyId) return { ok: false };

      const activeIntent = intent ?? { type: "order" as const };
      const employeeIds =
        employeeIdsOverride ??
        (scope.kind === "sub-orders"
          ? scope.employeeIds
          : employeeIdsForIntent(activeIntent));
      const suborderIds =
        suborderIdsOverride ?? suborderIdsForIntent(order, activeIntent);

      try {
        const response = await cancelOrder({
          companyId,
          orderId: order.id,
          reason: reasonLabelForApi(reasonId),
          additional_details: details,
          employee_ids: employeeIds,
          suborder_ids: suborderIds,
        }).unwrap();
        onSuccess?.();
        return cancellationSubmitResult(response);
      } catch (error: any) {
        displayErrorMessage(
          "Failed to cancel order",
          error?.data?.message || "Something went wrong. Please try again.",
        );
        return { ok: false };
      }
    },
    [cancelOrder, companyId, intent, onSuccess, order],
  );

  const withdrawCancellation = useCallback(async () => {
    const requestId =
      order?.pending_cancellation_request?.id ??
      order?.cancellation_status?.pending_request_id;
    if (!companyId || !requestId) return;

    try {
      await withdraw({ companyId, cancellationRequestId: requestId }).unwrap();
      onSuccess?.();
    } catch (error: any) {
      displayErrorMessage(
        "Could not withdraw request",
        error?.data?.message || "Something went wrong.",
      );
    }
  }, [companyId, onSuccess, order, withdraw]);

  return {
    isPreAccept,
    canCancel,
    isLive,
    cutoffMessage:
      orderCutoffMessage(order) ?? orderCancelUnavailableMessage(order),
    canCancelSubOrder: (employee) =>
      Boolean(order && isLive && employeeCanCancel(employee, order)),
    hasUncancellableDevices: uncancellableDevices,
    view,
    info,
    employees,
    totalItems: employees.reduce(
      (sum, employee) => sum + employee.items.length,
      0,
    ),
    intent,
    openCancelModal,
    closeCancelModal,
    submitCancellation,
    withdrawCancellation,
    isSubmitting,
    isWithdrawing,
  };
}

export type { CancelIntent, OpenCancelInput };
