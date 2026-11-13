"use client";

import { useMemo } from "react";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import type { OfficeAsset } from "../types/officeAsset";
import type { OfficeEmployee } from "../types/officeEmployee";
import {
  toOfficeAsset,
  toOfficeEmployee,
  type OfficeScopedEmployee,
  type OfficeScopedEquipment,
} from "../utils/mapOfficeMembers";
import { useCompanyId } from "./useOfficesServer";

const MEMBERS_PER_PAGE = 10;

export function useOfficeEmployeesPage(officeId: string, page: number) {
  const companyId = useCompanyId();
  const { data, isLoading, isFetching, isError } = useGetEmployeesQuery(
    {
      companyId: companyId as string,
      params: { office_id: officeId, page, per_page: MEMBERS_PER_PAGE },
    },
    { skip: !companyId || !officeId },
  );

  const rawRows: OfficeScopedEmployee[] = useMemo(
    () => (data?.data?.data ?? []) as OfficeScopedEmployee[],
    [data],
  );

  const rows: OfficeEmployee[] = useMemo(
    () => rawRows.map(toOfficeEmployee),
    [rawRows],
  );

  return {
    rows,
    rawRows,
    total: data?.data?.total ?? 0,
    lastPage: data?.data?.last_page ?? 1,
    isLoading,
    isFetching,
    isError,
  };
}

export function useOfficeAssetsPage(
  officeId: string,
  page: number,
  fallbackCurrency: string,
) {
  const companyId = useCompanyId();
  const { data, isLoading, isFetching, isError } = useGetEquipmentsQuery(
    {
      companyId: companyId as string,
      params: { office_id: officeId, page, per_page: MEMBERS_PER_PAGE },
    },
    { skip: !companyId || !officeId },
  );

  const rows: OfficeAsset[] = useMemo(
    () =>
      ((data?.data?.data ?? []) as OfficeScopedEquipment[]).map((row) =>
        toOfficeAsset(row, fallbackCurrency),
      ),
    [data, fallbackCurrency],
  );

  return {
    rows,
    total: data?.data?.total ?? 0,
    lastPage: data?.data?.last_page ?? 1,
    isLoading,
    isFetching,
    isError,
  };
}
