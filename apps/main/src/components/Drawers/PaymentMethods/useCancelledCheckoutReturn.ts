"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackOrderPaymentCancelled } from "@/lib/paymentAnalytics";
import {
  cancelledCheckoutReturnPath,
  peekPendingPaymentRedirect,
} from "./paymentRedirectSession";

function currentCheckoutPath() {
  return `${window.location.pathname}${window.location.search}`;
}

export function useCancelledCheckoutReturn(hasPaymentResult: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (hasPaymentResult) return;

    const pending = peekPendingPaymentRedirect();
    const returnPath = cancelledCheckoutReturnPath(
      pending,
      currentCheckoutPath(),
      hasPaymentResult,
    );
    if (!returnPath) return;

    trackOrderPaymentCancelled({
      ...(pending?.order_id ? { order_id: pending.order_id } : {}),
      ...(pending?.order_flow ? { order_flow: pending.order_flow } : {}),
    });
    router.replace(returnPath);
  }, [hasPaymentResult, router]);
}
