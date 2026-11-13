"use client";

import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import type { CatalogPlan } from "./catalog";
import { deviceCountForUpgrade, fleetCount } from "./subscriptionView";

export function useSubscriptionDeviceCount(
  companyId: string | undefined,
  plans: CatalogPlan[],
) {
  const equipment = useGetEquipmentsQuery(
    { companyId: companyId ?? "", params: { page: 1, per_page: 1 } },
    { skip: !companyId },
  );
  const listed = equipment.isSuccess ? equipment.data?.data?.total : undefined;

  return {
    count: deviceCountForUpgrade(fleetCount(plans), listed),
    pending: Boolean(companyId) && equipment.isLoading,
  };
}
