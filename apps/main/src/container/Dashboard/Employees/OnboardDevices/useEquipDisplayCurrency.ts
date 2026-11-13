"use client";

import { companyBillingCurrency } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveDisplayCurrency } from "./equipItems";
import type { EquipDeviceItem } from "./equipTypes";

export function useEquipDisplayCurrency(items: EquipDeviceItem[]) {
  const { getCompanyDetails } = useAuthUserDetail();
  return resolveDisplayCurrency(
    items,
    companyBillingCurrency(getCompanyDetails()) || "USD",
  );
}
