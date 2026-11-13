"use client";

import { useMemo } from "react";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveEntitiesListCompanyId } from "@/utils/workspace/resolveEntitiesListCompanyId";

export function useEntitiesListCompanyId() {
  const { getCompanyDetails, getEntityMemberships } = useAuthUserDetail();
  const { activeEntityId } = useActiveWorkspace();
  const primaryCompanyId = getCompanyDetails()?.id;
  const memberships = getEntityMemberships();

  return useMemo(
    () =>
      resolveEntitiesListCompanyId({
        primaryCompanyId,
        activeEntityId,
        memberships,
      }),
    [activeEntityId, memberships, primaryCompanyId],
  );
}
