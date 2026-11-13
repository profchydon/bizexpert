import type { PlanTier, Subsidiary } from "../types";

export function mergeAccountsEntities(
  apiSubsidiaries: Subsidiary[],
  planTier: PlanTier,
  created: Subsidiary[],
  options: { searchActive?: boolean; filterActive?: boolean } = {},
): Subsidiary[] {
  const showFullList = options.searchActive || options.filterActive;

  if (planTier === "scale") {
    if (showFullList) {
      return apiSubsidiaries;
    }

    const seen = new Set<string>();
    const merged: Subsidiary[] = [];
    for (const subsidiary of [...created, ...apiSubsidiaries]) {
      if (seen.has(subsidiary.id)) continue;
      seen.add(subsidiary.id);
      merged.push(subsidiary);
    }
    return merged;
  }

  if (showFullList) {
    return apiSubsidiaries;
  }

  return apiSubsidiaries.filter((subsidiary) => subsidiary.isPrimary);
}
