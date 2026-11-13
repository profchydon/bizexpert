import type { ImpactPreviewRow } from "./types";

export function getImpactPreviewSummary(rows: ImpactPreviewRow[]) {
  return {
    matched: rows.length,
    newlyCovered: rows.filter((row) => row.impact === "new_coverage").length,
    displaced: rows.filter((row) => row.impact === "displacement").length,
  };
}
