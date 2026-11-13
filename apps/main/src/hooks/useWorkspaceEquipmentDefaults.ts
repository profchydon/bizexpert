"use client";

import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import { useGetCurrenciesQuery } from "@/api/baseQueries/currenciesApi/getCurrencies";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import {
  resolveCompanyEquipmentDefaults,
  resolveCurrencyIdForCode,
  resolveEntityEquipmentDefaults,
} from "@/container/Dashboard/AllEquipments/Drawers/workspaceEquipmentDefaults";
import { useAuthUserDetail } from "@/utils/useAuthUser";

export function useWorkspaceEquipmentDefaults() {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const { activeEntityId } = useActiveWorkspace();

  const { data: getEntity } = useGetEntityQuery(
    { entityId: activeEntityId! },
    { skip: !activeEntityId },
  );

  const { data: getCurrencies } = useGetCurrenciesQuery();

  const defaults = activeEntityId
    ? resolveEntityEquipmentDefaults(getEntity?.data)
    : resolveCompanyEquipmentDefaults(company);

  return {
    countryName: defaults.countryName,
    currencyCode: defaults.currencyCode,
    currencyId: resolveCurrencyIdForCode(
      getCurrencies?.data,
      defaults.currencyCode,
    ),
  };
}
