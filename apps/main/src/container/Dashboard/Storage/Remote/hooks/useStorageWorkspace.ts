"use client";

import { resolvePlanTier } from "@/container/Dashboard/Accounts/utils/planTier";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import {
  canUseOpenFleet,
  openFleetImportDisabledReason,
} from "../utils/openFleetAccess";
import { resolveStorageCustomerPlan } from "../utils/resolveStorageCustomerPlan";

export function useStorageWorkspace() {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const planTier = resolvePlanTier(
    company?.subscription?.plan?.slug || company?.subscription?.plan?.name,
  );

  return {
    plan: resolveStorageCustomerPlan(company?.subscription?.plan),
    openFleetOn: canUseOpenFleet(planTier),
    importDisabledReason: openFleetImportDisabledReason(planTier),
    readOnly: false,
  };
}
