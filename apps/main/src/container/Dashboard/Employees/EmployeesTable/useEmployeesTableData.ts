import { useMemo } from "react";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useGetArchivedEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getArchivedEmployees";
import type { IEmployees } from "@/types/employees";
import { filterEmployeesBySearch } from "./filterEmployeesBySearch";

const ENTITY_SCOPE_PAGE_SIZE = 10;

interface Args {
  companyId?: string;
  searchValue: string | null;
  page: number;
  selectedFilterValue: "active" | "archived";
  entityId?: string | null;
}

export function shouldUseEntityScopedEmployees(entityId?: string | null) {
  return Boolean(entityId);
}

function paginateEmployees(employees: IEmployees[], page: number) {
  const lastPage = Math.max(
    1,
    Math.ceil(employees.length / ENTITY_SCOPE_PAGE_SIZE),
  );
  const safePage = Math.min(page, lastPage);
  const start = (safePage - 1) * ENTITY_SCOPE_PAGE_SIZE;
  return {
    employees: employees.slice(start, start + ENTITY_SCOPE_PAGE_SIZE),
    currentPage: safePage,
    lastPage,
    total: employees.length,
  };
}

export const useEmployeesTableData = ({
  companyId,
  searchValue,
  page,
  selectedFilterValue,
  entityId,
}: Args) => {
  const useEntityScope = shouldUseEntityScopedEmployees(entityId);
  const isActiveTab = selectedFilterValue === "active";

  const {
    data: scopedActiveEmployeesRes,
    isLoading: scopedActiveIsLoading,
    isFetching: scopedActiveIsFetching,
    isError: scopedActiveIsError,
  } = useGetEmployeesQuery(
    {
      companyId: (entityId ?? companyId) as string,
      params: { paginate: false },
    },
    { skip: !companyId || !useEntityScope || !entityId || !isActiveTab },
  );

  const {
    data: scopedArchivedEmployeesRes,
    isLoading: scopedArchivedIsLoading,
    isFetching: scopedArchivedIsFetching,
    isError: scopedArchivedIsError,
  } = useGetArchivedEmployeesQuery(
    {
      companyId: (entityId ?? companyId) as string,
      params: { paginate: false },
    },
    { skip: !companyId || !useEntityScope || !entityId || isActiveTab },
  );

  const {
    data: employeesRes,
    isLoading,
    isFetching,
    isError,
  } = useGetEmployeesQuery(
    {
      companyId: companyId as string,
      params: { search: searchValue || null, page },
    },
    { skip: !companyId || !isActiveTab || useEntityScope },
  );

  const {
    data: archivedEmployeesRes,
    isLoading: archivedIsLoading,
    isFetching: archivedIsFetching,
    isError: archivedIsError,
  } = useGetArchivedEmployeesQuery(
    {
      companyId: companyId as string,
      params: { search: searchValue || null, page },
    },
    { skip: !companyId || isActiveTab || useEntityScope },
  );

  const scopedEmployeesRes = isActiveTab
    ? scopedActiveEmployeesRes
    : scopedArchivedEmployeesRes;

  const scopedResult = useMemo(() => {
    if (!useEntityScope || !entityId) return null;
    const allEmployees = (scopedEmployeesRes?.data?.data ?? []) as IEmployees[];
    const searched = filterEmployeesBySearch(allEmployees, searchValue);
    return paginateEmployees(searched, page);
  }, [entityId, page, scopedEmployeesRes, searchValue, useEntityScope]);

  const meta = isActiveTab ? employeesRes?.data : archivedEmployeesRes?.data;

  const tableIsLoading = useEntityScope
    ? isActiveTab
      ? scopedActiveIsLoading || scopedActiveIsFetching
      : scopedArchivedIsLoading || scopedArchivedIsFetching
    : isActiveTab
      ? isLoading || isFetching
      : archivedIsLoading || archivedIsFetching;

  const tableIsError = useEntityScope
    ? isActiveTab
      ? scopedActiveIsError
      : scopedArchivedIsError
    : isActiveTab
      ? isError
      : archivedIsError;

  if (scopedResult) {
    return {
      employees: scopedResult.employees,
      currentPage: scopedResult.currentPage,
      lastPage: scopedResult.lastPage,
      total: scopedResult.total,
      scopedTotal: scopedResult.total,
      tableIsLoading,
      tableIsError,
    };
  }

  return {
    employees: meta?.data,
    currentPage: (meta as { current_page?: number })?.current_page ?? 1,
    lastPage: (meta as { last_page?: number })?.last_page ?? 1,
    total: (meta as { total?: number })?.total ?? 0,
    scopedTotal: undefined,
    tableIsLoading,
    tableIsError,
  };
};
