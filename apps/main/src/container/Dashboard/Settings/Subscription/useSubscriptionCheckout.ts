"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useChangeSubscriptionPlanMutation } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import type { CatalogPlan } from "./catalog";
import { formatCharge } from "./subscriptionMoney";
import {
  rememberSubscriptionTxRef,
  SUBSCRIPTION_RETURN_PATH,
} from "./subscriptionRedirect";
import { formatBillingDate, type PlanChangeMode } from "./subscriptionView";

function errorMessage(error: unknown): string {
  const body = error as { data?: { message?: string } };
  return body.data?.message || "The plan change could not be completed.";
}

export function useSubscriptionCheckout() {
  const { getCompanyDetails } = useAuthUserDetail();
  const [changePlan, changeProps] = useChangeSubscriptionPlanMutation();
  const [target, setTarget] = useState<CatalogPlan | null>(null);
  const [mode, setMode] = useState<PlanChangeMode>("upgrade");
  const [redirecting, setRedirecting] = useState(false);

  const open = (plan: CatalogPlan, nextMode: PlanChangeMode) => {
    setTarget(plan);
    setMode(nextMode);
  };

  const confirm = async (planId: string) => {
    const companyId = getCompanyDetails()?.id;
    if (!companyId || !planId || !target || redirecting) return;
    const planName = target.name;
    setRedirecting(true);
    try {
      const res = await changePlan({
        companyId,
        planId,
        redirectUrl: mode === "upgrade" ? SUBSCRIPTION_RETURN_PATH : undefined,
      }).unwrap();
      const checkoutLink = res.data?.collection?.link;
      if (checkoutLink) {
        rememberSubscriptionTxRef(res.data?.collection?.tx_ref);
        window.location.assign(checkoutLink);
        return;
      }
      setRedirecting(false);
      const quote = res.data?.quote;
      const when = formatBillingDate(
        quote?.effective_at || res.data?.contract.scheduled_change?.at,
      );
      if (res.data?.action === "downgrade_scheduled") {
        toast.success("Plan change scheduled", {
          description: `${planName} starts on ${when || "your next renewal"}.`,
        });
      } else if (res.data?.collection?.status === "pending_payment") {
        const amount = quote
          ? formatCharge(quote.amount, quote.currency)
          : "The invoice";
        toast.message("Payment pending", {
          description: `${amount} is waiting. ${planName} starts once it is paid.`,
        });
      } else {
        toast.success(`You are on ${planName}`, {
          description: "Your new features are available right away.",
        });
      }
      setTarget(null);
    } catch (error) {
      const status = (error as { status?: number }).status;
      setRedirecting(false);
      setTarget(null);
      if (status !== 422) toast.error(errorMessage(error));
    }
  };

  return {
    target,
    mode,
    open,
    close: () => setTarget(null),
    confirm,
    isLoading: changeProps.isLoading || redirecting,
  };
}
