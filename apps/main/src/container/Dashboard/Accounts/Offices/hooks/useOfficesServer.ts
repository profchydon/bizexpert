"use client";

import { useMemo } from "react";
import { useGetOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffices";
import type { Office } from "../../types";
import { toUiOffice } from "../utils/mapServerOffice";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  filterReassignTargets,
  type ReassignSource,
} from "../utils/reassignTargets";

export function useCompanyId(): string | undefined {
  const companyId = useWorkspaceCompanyId();
  return companyId;
}

interface OfficesPageParams {
  page?: number;
  perPage?: number;
  companyId?: string;
}

export function useOfficesPage({
  page = 1,
  perPage = 10,
  companyId,
}: OfficesPageParams = {}) {
  const accountCompanyId = useCompanyId();
  const targetCompanyId = companyId ?? accountCompanyId;

  const { data, isLoading, isFetching, isError } = useGetOfficesQuery(
    {
      companyId: targetCompanyId as string,
      params: { page, per_page: perPage },
    },
    { skip: !targetCompanyId },
  );

  const offices: Office[] = useMemo(
    () => (data?.data?.data ?? []).map((row) => toUiOffice(row)),
    [data],
  );

  return {
    offices,
    total: data?.data?.total ?? 0,
    lastPage: data?.data?.last_page ?? 1,
    isLoading,
    isFetching,
    isError,
  };
}

const REASSIGN_TARGETS_PER_PAGE = 100;

export function useOfficeReassignTargets(source: ReassignSource): Office[] {
  const { offices } = useOfficesPage({
    perPage: REASSIGN_TARGETS_PER_PAGE,
  });
  return useMemo(
    () => filterReassignTargets(offices, source),
    [offices, source.id, source.subsidiaryId],
  );
}
