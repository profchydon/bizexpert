"use client";

import { useMemo } from "react";

import { useGetDepartmentsQuery } from "@/api/baseQueries/companiesApi/departmentsApi/getDepartments";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useGetJobTitlesQuery } from "@/api/baseQueries/companiesApi/jobTitlesApi/getJobTitles";
import { useGetKitsQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKits";
import { useGetLevelsQuery } from "@/api/baseQueries/companiesApi/levelsApi/getLevels";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { jobTitlesToOptions } from "@/utils/jobTitleOptions";

import { kitToCatalogKit } from "./apiAdapters";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

export type CatalogOption = {
  value: string;
  label: string;
  code?: string;
};

export function useCatalogPolicyOptions() {
  const companyId = useWorkspaceCompanyId();

  const departmentsQuery = useGetDepartmentsQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );
  const levelsQuery = useGetLevelsQuery(
    { companyId: companyId!, page: 1 },
    { skip: !companyId },
  );
  const employeesQuery = useGetEmployeesQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );
  const jobTitlesQuery = useGetJobTitlesQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );
  const kitsQuery = useGetKitsQuery(
    { companyId: companyId!, params: { status: "active", per_page: 100 } },
    { skip: !companyId },
  );
  const countriesQuery = useGetCountriesQuery();

  const roles = useMemo(() => {
    const jobTitleOptions = jobTitlesToOptions(jobTitlesQuery.data);
    if (jobTitleOptions.length) return jobTitleOptions;
    const unique = new Map<string, string>();
    for (const employee of employeesQuery.data?.data.data ?? []) {
      for (const role of employee.roles ?? []) {
        if (role.id && role.name) unique.set(role.id, role.name);
      }
    }
    return [...unique].map(([value, label]) => ({ value, label }));
  }, [employeesQuery.data, jobTitlesQuery.data]);

  const levels = useMemo<CatalogOption[]>(
    () =>
      (levelsQuery.data?.data.data ?? []).map((level) => ({
        value: level.id,
        label: level.name,
      })),
    [levelsQuery.data],
  );

  const departments = useMemo<CatalogOption[]>(
    () =>
      (departmentsQuery.data?.data.data ?? []).map((department) => ({
        value: department.id,
        label: department.name,
      })),
    [departmentsQuery.data],
  );

  const countries = useMemo<CatalogOption[]>(
    () =>
      (countriesQuery.data?.data.data ?? []).map((country: any) => ({
        value: country.id,
        label: country.name,
        code: country.code,
      })),
    [countriesQuery.data],
  );

  const kits = useMemo(
    () => (kitsQuery.data?.data.data ?? []).map(kitToCatalogKit),
    [kitsQuery.data],
  );

  return { roles, levels, departments, countries, kits };
}
