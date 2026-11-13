"use client";

import { useMemo } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetAssetsQuery } from "@/api/baseQueries/assetsApi/getAssets";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import type { ApprovalItem } from "./types";
import {
  assetsToSwapCandidates,
  employeeCountryId,
  swapCandidatePageSize,
  swapPaginationMeta,
} from "./swapUtils";

export function useSwapCandidates({
  employeeId,
  item,
  open,
  page,
  search,
}: {
  employeeId?: string;
  item: ApprovalItem | null;
  open: boolean;
  page: number;
  search?: string;
}) {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const workspaceCompanyId = useWorkspaceCompanyId();
  const companyId = workspaceCompanyId ?? company?.id;
  const employeeQuery = useGetSingleEmployeeQuery(
    { companyId: companyId!, employeeId: employeeId! },
    { skip: !open || !companyId || !employeeId },
  );
  const countriesQuery = useGetCountriesQuery(undefined, { skip: !open });
  const countryId = employeeCountryId(
    employeeQuery.data?.data,
    countriesQuery.data?.data,
  );
  const assetsQuery = useGetAssetsQuery(
    {
      companyId: companyId!,
      country_id: countryId,
      page,
      per_page: swapCandidatePageSize,
      search: search?.trim() || undefined,
    },
    { skip: !open || !companyId || !countryId },
  );
  const candidates = useMemo(
    () =>
      assetsToSwapCandidates(assetsQuery.data, {
        originalAssetSpecificationId: item?.assetSpecificationId,
        search,
      }),
    [assetsQuery.data, item?.assetSpecificationId, search],
  );

  return {
    candidates: candidates.slice(0, swapCandidatePageSize),
    isFetching:
      employeeQuery.isFetching ||
      countriesQuery.isFetching ||
      assetsQuery.isFetching,
    paginationMeta: swapPaginationMeta(assetsQuery.data),
  };
}
