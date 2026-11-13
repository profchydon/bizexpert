"use client";

import { useGetDashboardQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getDashboard";
import { useGetDashboardCountrySummaryQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getDashboardCountrySummary";
import { useWorkspaceScopedCompanyArgs } from "@/hooks/useWorkspaceScopedCompanyArgs";

interface WorkspaceQueryOptions {
  skip?: boolean;
}

export function useWorkspaceDashboardQuery(
  options: WorkspaceQueryOptions = {},
) {
  const { companyId } = useWorkspaceScopedCompanyArgs();

  return useGetDashboardQuery(
    { companyId },
    { skip: !companyId || options.skip },
  );
}

export function useWorkspaceDashboardCountrySummaryQuery(
  options: WorkspaceQueryOptions = {},
) {
  const { companyId } = useWorkspaceScopedCompanyArgs();

  return useGetDashboardCountrySummaryQuery(
    { companyId },
    { skip: !companyId || options.skip },
  );
}
