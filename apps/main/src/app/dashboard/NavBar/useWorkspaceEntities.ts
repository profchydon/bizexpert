"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetEntitiesQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntities";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import type { EntityMembership } from "@/types/entityMembership";
import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import { mapMembershipsToWorkspaceEntities } from "@/utils/workspace/membershipEntities";
import { resolveEntitiesListCompanyId } from "@/utils/workspace/resolveEntitiesListCompanyId";
import {
  WORKSPACE_ENTITIES_PAGE_SIZE,
  hasMoreWorkspaceEntityPages,
  mergeWorkspaceEntityPages,
} from "./workspaceEntitiesPagination";

interface WorkspaceEntitiesOptions {
  access: AccessContext;
  memberships: EntityMembership[];
}

export function useWorkspaceEntities(
  companyId: string | undefined,
  enabled: boolean,
  { access, memberships }: WorkspaceEntitiesOptions,
) {
  const { activeEntityId } = useActiveWorkspace();
  const listCompanyId = resolveEntitiesListCompanyId({
    primaryCompanyId: companyId,
    activeEntityId,
    memberships,
  });
  const [page, setPage] = useState(1);
  const [entities, setEntities] = useState<EntityApiRecord[]>([]);
  const shouldFetchEntities =
    enabled && Boolean(listCompanyId) && access.isGlobalAdmin;

  useEffect(() => {
    setPage(1);
    setEntities([]);
  }, [listCompanyId, access.isGlobalAdmin]);

  const membershipEntities = useMemo(
    () => mapMembershipsToWorkspaceEntities(memberships, access),
    [access, memberships],
  );

  const entitiesQuery = useGetEntitiesQuery(
    {
      companyId: listCompanyId as string,
      params: { page, per_page: WORKSPACE_ENTITIES_PAGE_SIZE },
    },
    { skip: !shouldFetchEntities },
  );

  const listPayload = entitiesQuery.data?.data;

  useEffect(() => {
    if (!shouldFetchEntities || !listPayload?.data) return;
    setEntities((previous) =>
      mergeWorkspaceEntityPages(
        previous,
        listPayload.data,
        listPayload.current_page,
      ),
    );
  }, [listPayload?.current_page, listPayload?.data, shouldFetchEntities]);

  const hasMore = shouldFetchEntities
    ? hasMoreWorkspaceEntityPages(
        listPayload?.current_page,
        listPayload?.last_page,
        entities.length,
        listPayload?.total,
      )
    : false;

  const loadMore = () => {
    if (!shouldFetchEntities || !hasMore || entitiesQuery.isFetching) return;
    setPage((current) => current + 1);
  };

  return {
    entities: shouldFetchEntities ? entities : membershipEntities,
    hasMore,
    loadMore,
    isLoadingMore: shouldFetchEntities && entitiesQuery.isFetching && page > 1,
    isInitialLoading:
      shouldFetchEntities && entitiesQuery.isLoading && page === 1,
  };
}
