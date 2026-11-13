"use client";

import { useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useWorkspaceEntities } from "./useWorkspaceEntities";
import {
  buildSwitcherScopes,
  mergeSwitcherEntitySources,
  resolveSwitcherActiveScope,
} from "./accountSwitcherScopes";
import {
  GLOBAL_WORKSPACE_ID,
  navigateToWorkspaceScope,
} from "@/utils/workspace/activeWorkspace";
import { useAuthUserDetail } from "@/utils/useAuthUser";

export function useAccountSwitcher(enabled: boolean) {
  const { getCompanyDetails, getEntityMemberships } = useAuthUserDetail();
  const company = getCompanyDetails();
  const memberships = getEntityMemberships();
  const { access, activeScopeId } = useActiveWorkspace();
  const [switchingScopeId, setSwitchingScopeId] = useState<string | null>(null);

  const { entities, hasMore, loadMore, isLoadingMore, isInitialLoading } =
    useWorkspaceEntities(company?.id, enabled, { access, memberships });

  const hasActiveEntity =
    activeScopeId !== GLOBAL_WORKSPACE_ID &&
    (entities.some((entity) => entity.id === activeScopeId) ||
      memberships.some((membership) => membership.id === activeScopeId));
  const resolvedActiveEntity = useGetEntityQuery(
    { entityId: activeScopeId },
    {
      skip:
        !enabled || activeScopeId === GLOBAL_WORKSPACE_ID || hasActiveEntity,
    },
  );
  const resolvedEntity = resolvedActiveEntity.data?.data;

  const switcherEntities = useMemo(
    () =>
      mergeSwitcherEntitySources({
        entities: resolvedEntity ? [...entities, resolvedEntity] : entities,
        memberships,
        access,
        activeScopeId,
      }),
    [access, activeScopeId, entities, memberships, resolvedEntity],
  );

  const scopes = useMemo(
    () =>
      buildSwitcherScopes({
        company,
        entities: switcherEntities,
        access,
        activeScopeId,
      }),
    [access, activeScopeId, company, switcherEntities],
  );

  const activeScope = useMemo(
    () => resolveSwitcherActiveScope(scopes, activeScopeId, company),
    [activeScopeId, company, scopes],
  );

  const onSelectScope = useCallback(
    (id: string) => {
      if (id === activeScopeId || switchingScopeId) return;
      flushSync(() => {
        setSwitchingScopeId(id);
      });
      navigateToWorkspaceScope(id);
    },
    [activeScopeId, switchingScopeId],
  );

  return {
    scopes,
    activeScope,
    onSelectScope,
    switchingScopeId,
    isSwitchingWorkspace: switchingScopeId !== null,
    canSwitch: scopes.length > 1 || hasMore,
    hasMoreEntities: hasMore,
    onLoadMoreEntities: loadMore,
    isLoadingMoreEntities: isLoadingMore,
    isLoading: isInitialLoading || isLoadingMore,
  };
}
