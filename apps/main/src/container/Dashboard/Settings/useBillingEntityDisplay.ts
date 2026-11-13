"use client";

import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { billingEntityDisplay } from "./billingEntityDisplay";

export function useBillingEntityDisplay() {
  const { activeEntityId } = useActiveWorkspace();
  const { getCompanyDetails } = useAuthUserDetail();
  const entityQuery = useGetEntityQuery(
    { entityId: activeEntityId ?? "" },
    { skip: !activeEntityId },
  );
  const entity = entityQuery.data?.data;
  const display = billingEntityDisplay({
    entity: activeEntityId ? entity : null,
    company: getCompanyDetails(),
  });

  return {
    ...display,
    isLoading: Boolean(activeEntityId) && !entity && entityQuery.isLoading,
  };
}
