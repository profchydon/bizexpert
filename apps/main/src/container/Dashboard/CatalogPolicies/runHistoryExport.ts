import config from "@/config/config";

import type { RunOutcomeFilter } from "./utilsRunHistory";

export function runOutcomeToExportParam(outcome: RunOutcomeFilter) {
  return outcome === "ALL" ? null : outcome.toLowerCase();
}

export function buildRunHistoryExportUrl({
  catalogId,
  companyId,
  outcome,
  search,
}: {
  catalogId: string;
  companyId: string;
  outcome: RunOutcomeFilter;
  search: string;
}) {
  const params = new URLSearchParams({ format: "csv" });
  const cleanSearch = search.trim();
  const outcomeParam = runOutcomeToExportParam(outcome);

  if (cleanSearch) params.set("search", cleanSearch);
  if (outcomeParam) params.set("outcome", outcomeParam);

  return `${config.API_URL}/companies/${companyId}/catalog-policies/${catalogId}/trigger-history/export?${params.toString()}`;
}

export function getRunHistoryExportFilename(contentDisposition: string | null) {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? "Rayda_Catalog_Policy_Run_History.csv";
}
