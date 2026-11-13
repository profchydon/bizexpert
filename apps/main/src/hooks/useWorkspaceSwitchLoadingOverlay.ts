"use client";

import { useEffect, useState } from "react";
import { useGetDashboardQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getDashboard";
import { useGetDashboardCountrySummaryQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getDashboardCountrySummary";
import { useWorkspaceScopedCompanyArgs } from "@/hooks/useWorkspaceScopedCompanyArgs";
import {
  clearWorkspaceSwitchLoading,
  readWorkspaceSwitchLoading,
} from "@/utils/workspace/activeWorkspace";
import { removeImmediateWorkspaceSwitchOverlay } from "@/utils/workspace/workspaceSwitchOverlay";

const SWITCH_LOADING_TIMEOUT_MS = 15000;

export function useWorkspaceSwitchLoadingOverlay() {
  const [isSwitching, setIsSwitching] = useState(false);
  const { companyId } = useWorkspaceScopedCompanyArgs();

  const dashboardQuery = useGetDashboardQuery(
    { companyId },
    { skip: !isSwitching || !companyId },
  );
  const summaryQuery = useGetDashboardCountrySummaryQuery(
    { companyId },
    { skip: !isSwitching || !companyId },
  );

  useEffect(() => {
    const pendingScopeId = readWorkspaceSwitchLoading();
    if (!pendingScopeId) return;

    clearWorkspaceSwitchLoading();
    setIsSwitching(true);
  }, []);

  useEffect(() => {
    if (!isSwitching) return;
    removeImmediateWorkspaceSwitchOverlay();
  }, [isSwitching]);

  useEffect(() => {
    if (!isSwitching || !companyId) return;

    const dashboardPending =
      dashboardQuery.isLoading ||
      dashboardQuery.isFetching ||
      dashboardQuery.isUninitialized;
    const summaryPending =
      summaryQuery.isLoading ||
      summaryQuery.isFetching ||
      summaryQuery.isUninitialized;

    if (!dashboardPending && !summaryPending) {
      setIsSwitching(false);
      return;
    }

    const timeoutId = globalThis.window.setTimeout(
      () => setIsSwitching(false),
      SWITCH_LOADING_TIMEOUT_MS,
    );

    return () => globalThis.window.clearTimeout(timeoutId);
  }, [
    companyId,
    dashboardQuery.isFetching,
    dashboardQuery.isLoading,
    dashboardQuery.isUninitialized,
    isSwitching,
    summaryQuery.isFetching,
    summaryQuery.isLoading,
    summaryQuery.isUninitialized,
  ]);

  return isSwitching;
}
