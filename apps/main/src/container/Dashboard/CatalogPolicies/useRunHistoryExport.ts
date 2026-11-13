"use client";

import { useState } from "react";

import displayErrorMessage from "@/utils/displayErrorMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  buildRunHistoryExportUrl,
  getRunHistoryExportFilename,
} from "./runHistoryExport";
import type { RunOutcomeFilter } from "./utilsRunHistory";

export function useRunHistoryExport(catalogId?: string) {
  const [isExporting, setIsExporting] = useState(false);
  const { getAuthToken, getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const token = getAuthToken();

  async function exportHistory({
    outcome,
    search,
  }: {
    outcome: RunOutcomeFilter;
    search: string;
  }) {
    if (!catalogId || !companyId || isExporting) return;
    setIsExporting(true);

    try {
      const response = await fetch(
        buildRunHistoryExportUrl({
          catalogId,
          companyId: companyId,
          outcome,
          search,
        }),
        {
          method: "GET",
          headers: {
            Accept: "text/csv",
            Authorization: `Bearer ${token || ""}`,
          },
        },
      );

      if (!response.ok) {
        displayErrorMessage("Unable to export run history.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getRunHistoryExportFilename(
        response.headers.get("content-disposition"),
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      displayErrorMessage("Unable to export run history.");
    } finally {
      setIsExporting(false);
    }
  }

  return { exportHistory, isExporting };
}
