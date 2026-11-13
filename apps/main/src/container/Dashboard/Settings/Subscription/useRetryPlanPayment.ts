"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRetrySubscriptionPlanPaymentMutation } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import {
  rememberSubscriptionTxRef,
  SUBSCRIPTION_RETURN_PATH,
} from "./subscriptionRedirect";

function errorMessage(error: unknown): string {
  const body = error as { data?: { message?: string } };
  return body.data?.message || "The payment could not be restarted.";
}

export function useRetryPlanPayment(companyId?: string, txRef?: string | null) {
  const [retryPayment, props] = useRetrySubscriptionPlanPaymentMutation();
  const [redirecting, setRedirecting] = useState(false);

  const retry = async () => {
    if (!companyId || !txRef || props.isLoading || redirecting) return;
    setRedirecting(true);
    try {
      const res = await retryPayment({
        companyId,
        txRef,
        redirectUrl: SUBSCRIPTION_RETURN_PATH,
      }).unwrap();
      const link = res.data?.link;
      if (!link) {
        setRedirecting(false);
        toast.error("Stripe checkout could not be opened.");
        return;
      }
      rememberSubscriptionTxRef(res.data?.tx_ref || txRef);
      window.location.assign(link);
    } catch (error) {
      setRedirecting(false);
      const status = (error as { status?: number }).status;
      if (status !== 422 && status !== 400) toast.error(errorMessage(error));
    }
  };

  return { retry, isLoading: props.isLoading || redirecting };
}
