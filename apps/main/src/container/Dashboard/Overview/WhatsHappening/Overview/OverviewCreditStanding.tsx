"use client";

import { useGetEntitiesQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntities";
import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useEntitiesListCompanyId } from "@/hooks/useEntitiesListCompanyId";
import {
  resolveOverviewCreditEntity,
  resolveOverviewCreditView,
  shouldListOverviewEntities,
  shouldLoadOverviewEntityDetail,
} from "../../overviewCreditStanding";

export function useOverviewCreditView() {
  const companyId = useEntitiesListCompanyId();
  const { access, activeEntityId } = useActiveWorkspace();
  const canList = shouldListOverviewEntities(access.isGlobalAdmin);
  const entitiesQuery = useGetEntitiesQuery(
    { companyId: companyId ?? "", params: { per_page: 100 } },
    { skip: !companyId || !canList },
  );
  const entityQuery = useGetEntityQuery(
    { entityId: activeEntityId ?? "" },
    {
      skip: !shouldLoadOverviewEntityDetail(
        access.isGlobalAdmin,
        activeEntityId,
      ),
    },
  );

  return resolveOverviewCreditView(
    resolveOverviewCreditEntity(
      access.isGlobalAdmin,
      entitiesQuery.data?.data?.data ?? [],
      activeEntityId,
      entityQuery.data?.data ?? null,
    ),
  );
}
