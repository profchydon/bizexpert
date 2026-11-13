"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useGetEntitiesQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntities";
import { mapEntityToSubsidiary } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityToSubsidiary";
import { ENTITIES_PAGE_SIZE } from "../constants/entitiesPagination";
import type { ActingAdmin, Subsidiary, SubsidiaryStatus } from "../types";
import { buildEntitiesListParams } from "../utils/buildEntitiesListParams";
import { mergeAccountsEntities } from "../utils/mergeAccountsEntities";
import { useGetSubscriptionEntitlementsQuery } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import { resolveAccountsPlanTier } from "../utils/planTier";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useEntitiesListCompanyId } from "@/hooks/useEntitiesListCompanyId";
import { resolveActingAdmin } from "@/utils/auth/resolveActingAdmin";
import { mapMembershipsToVisibleSubsidiaries } from "@/utils/workspace/membershipEntities";
import {
  getCreatedSubsidiariesSnapshot,
  subscribeCreatedSubsidiaries,
} from "./createdSubsidiaryStore";

export function useAccountsPlanTier() {
  return useAccountsPlan().tier;
}

export function useAccountsPlan() {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const entitlements = useGetSubscriptionEntitlementsQuery(
    { companyId: company?.id },
    { skip: !company?.id },
  );
  const tier = resolveAccountsPlanTier(
    entitlements.data?.data?.plan,
    company?.subscription?.plan,
  );
  return {
    tier,
    ready:
      Boolean(company?.id) && (entitlements.isSuccess || entitlements.isError),
  };
}

export function useActingAdmin(): ActingAdmin {
  const { getUserDetails } = useAuthUserDetail();
  const { access, activeEntityId } = useActiveWorkspace();
  const user = getUserDetails();

  return resolveActingAdmin(user, access, activeEntityId);
}

function useEntityStoreSync() {
  const created = useSyncExternalStore(
    subscribeCreatedSubsidiaries,
    getCreatedSubsidiariesSnapshot,
    getCreatedSubsidiariesSnapshot,
  );

  return { created };
}

interface AccountsEntitiesQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  statuses?: SubsidiaryStatus[];
}

export function useAccountsEntitiesQuery({
  page = 1,
  perPage = ENTITIES_PAGE_SIZE,
  search,
  statuses,
}: AccountsEntitiesQueryParams = {}) {
  const companyId = useEntitiesListCompanyId();
  const { access } = useActiveWorkspace();
  const params = useMemo(
    () =>
      buildEntitiesListParams({
        page,
        perPage,
        search,
        statuses,
      }),
    [page, perPage, search, statuses],
  );

  return useGetEntitiesQuery(
    {
      companyId: companyId as string,
      params,
    },
    { skip: !companyId || !access.isGlobalAdmin },
  );
}

interface AccountsEntitiesPageParams {
  page?: number;
  perPage?: number;
  search?: string;
  statuses?: SubsidiaryStatus[];
}

export function useAccountsEntitiesPage({
  page = 1,
  perPage = ENTITIES_PAGE_SIZE,
  search,
  statuses = [],
}: AccountsEntitiesPageParams = {}) {
  const planTier = useAccountsPlanTier();
  const { created } = useEntityStoreSync();
  const statusFilterActive = statuses.length > 0;
  const searchActive = Boolean(search?.trim());
  const query = useAccountsEntitiesQuery({
    page,
    perPage,
    search,
    statuses,
  });

  const listState = useMemo(() => {
    const apiSubsidiaries = (query.data?.data?.data ?? []).map(
      mapEntityToSubsidiary,
    );
    const merged = mergeAccountsEntities(apiSubsidiaries, planTier, created, {
      searchActive,
      filterActive: statusFilterActive,
    });

    return {
      items: merged,
      total: query.data?.data?.total ?? 0,
      lastPage: query.data?.data?.last_page ?? 1,
    };
  }, [
    created,
    page,
    perPage,
    planTier,
    query.data,
    search,
    searchActive,
    statusFilterActive,
    statuses,
  ]);

  return {
    subsidiaries: listState.items,
    total: listState.total,
    lastPage: listState.lastPage,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isListLoading: query.isLoading || query.isFetching,
  };
}

export function useVisibleSubsidiaries(): Subsidiary[] {
  const { access } = useActiveWorkspace();
  const { getEntityMemberships } = useAuthUserDetail();
  const memberships = getEntityMemberships();
  const membershipSubsidiaries = useMemo(
    () => mapMembershipsToVisibleSubsidiaries(memberships, access),
    [access, memberships],
  );
  const { subsidiaries } = useAccountsEntitiesPage();

  if (!access.isGlobalAdmin) {
    return membershipSubsidiaries;
  }

  return subsidiaries;
}

export function useAccountsEntitiesState(page = 1) {
  const query = useAccountsEntitiesQuery({ page });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    total: query.data?.data?.total ?? 0,
  };
}

export function useSubsidiary(id: string): Subsidiary | undefined {
  const subsidiaries = useVisibleSubsidiaries();
  return subsidiaries.find((subsidiary) => subsidiary.id === id);
}
