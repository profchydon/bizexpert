"use client";

import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveDelegatedBilling } from "./isDelegatedCheckoutBilling";

export function useCheckoutDelegatedBilling() {
  const { activeEntityId } = useActiveWorkspace();
  const { getEntityMemberships } = useAuthUserDetail();
  const membership = getEntityMemberships().find(
    (item) => item.id === activeEntityId,
  );
  const entityQuery = useGetEntityQuery(
    { entityId: activeEntityId ?? "" },
    { skip: !activeEntityId },
  );

  return resolveDelegatedBilling({
    membership,
    entity: entityQuery.data?.data,
    entityLoading: Boolean(activeEntityId) && entityQuery.isLoading,
  });
}
