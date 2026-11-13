"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, type ReduxDispatch } from "@/store";
import { resetEmployeeState } from "@/store/slices/employeeSlice";
import { resetEquipEmployeeState } from "@/store/slices/equipEmployeeSlice";
import { resetOffboardingData } from "@/store/slices/offboardingSlice";
import { clearStorageActionsCart } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCartActions";
import { useCancelledCheckoutReturn } from "@/components/Drawers/PaymentMethods/useCancelledCheckoutReturn";
import {
  clearPendingPaymentRedirect,
  hasCheckoutPaymentResult,
  peekPendingPaymentRedirect,
} from "@/components/Drawers/PaymentMethods/paymentRedirectSession";
import { trackOrderPaid } from "@/lib/paymentAnalytics";
import {
  paymentVerifyRedirectPath,
  shouldApplyPaymentVerify,
  type PaymentVerifyKind,
} from "./paymentVerify";

type Args = {
  errorInstance: string | null;
  removeAllItemsFromCart: () => void;
  successInstance: string | null;
  txRef: string | null;
  verifyOrderError: boolean;
  verifyOrderPayment: unknown;
};

export async function clearPaidCheckoutState(
  dispatch: ReduxDispatch,
  removeAllItemsFromCart: () => Promise<void> | void,
) {
  await removeAllItemsFromCart();
  clearStorageActionsCart();
  dispatch(resetEmployeeState());
  dispatch(resetEquipEmployeeState());
  dispatch(resetOffboardingData());
}

export function useTransactionPaymentResult({
  errorInstance,
  removeAllItemsFromCart,
  successInstance,
  txRef,
  verifyOrderError,
  verifyOrderPayment,
}: Args) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handledRef = useRef<PaymentVerifyKind | null>(null);

  useCancelledCheckoutReturn(
    hasCheckoutPaymentResult({
      errorInstance,
      successInstance,
      txRef,
    }),
  );

  useEffect(() => {
    if (
      !shouldApplyPaymentVerify(
        handledRef.current,
        "success",
        Boolean(verifyOrderPayment),
      )
    ) {
      return;
    }
    handledRef.current = "success";
    const pending = peekPendingPaymentRedirect();
    trackOrderPaid({
      ...(pending?.order_id ? { order_id: pending.order_id } : {}),
      ...(pending?.order_flow ? { order_flow: pending.order_flow } : {}),
    });
    clearPendingPaymentRedirect();
    router.push(paymentVerifyRedirectPath("success"));
    void clearPaidCheckoutState(dispatch, removeAllItemsFromCart);
  }, [dispatch, removeAllItemsFromCart, router, verifyOrderPayment]);

  useEffect(() => {
    if (
      !shouldApplyPaymentVerify(handledRef.current, "error", verifyOrderError)
    ) {
      return;
    }
    handledRef.current = "error";
    clearPendingPaymentRedirect();
    router.push(paymentVerifyRedirectPath("error"));
    void clearPaidCheckoutState(dispatch, removeAllItemsFromCart);
  }, [dispatch, removeAllItemsFromCart, router, verifyOrderError]);
}
