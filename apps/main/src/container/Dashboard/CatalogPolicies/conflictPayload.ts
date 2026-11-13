import type { CheckCatalogRuleConflictsPayload } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/types";

import type { CatalogRule } from "./types";

export function ruleToConflictCheckPayload(
  rule: CatalogRule,
): CheckCatalogRuleConflictsPayload {
  return {
    levels: rule.matchLevelIds?.length ? rule.matchLevelIds : rule.matchLevels,
    departments: rule.matchDepartmentIds?.length
      ? rule.matchDepartmentIds
      : rule.matchDepartments,
    countries: rule.matchCountryIds?.length
      ? rule.matchCountryIds
      : rule.matchCountries,
  };
}
