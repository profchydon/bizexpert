"use client";

import { useCompanyEntitlements } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import type { PlanTier } from "../../types";
import { planOfficeLimit } from "../../utils/planLimits";

export function useOfficeCreateLimit(planTier: PlanTier) {
  const entitlements = useCompanyEntitlements();
  const row = entitlements.limit("office_limit");
  if (entitlements.ready && !entitlements.failed && row) {
    return {
      limit: row.unlimited
        ? Number.POSITIVE_INFINITY
        : (row.cap ?? planOfficeLimit(planTier)),
      atLimit: row.atLimit,
    };
  }
  return { limit: planOfficeLimit(planTier), atLimit: false };
}
