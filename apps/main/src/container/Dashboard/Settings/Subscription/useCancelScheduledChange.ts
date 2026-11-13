"use client";

import { toast } from "sonner";
import { useCancelScheduledSubscriptionChangeMutation } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";

function errorMessage(error: unknown): string {
  const body = error as { data?: { message?: string } };
  return body.data?.message || "The scheduled change could not be cancelled.";
}

export function useCancelScheduledChange(companyId?: string) {
  const [cancelChange, props] = useCancelScheduledSubscriptionChangeMutation();

  const cancel = async () => {
    if (!companyId || props.isLoading) return;
    try {
      await cancelChange({ companyId }).unwrap();
      toast.success("Plan change cancelled", {
        description: "You stay on your current plan.",
      });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return { cancel, isLoading: props.isLoading };
}
