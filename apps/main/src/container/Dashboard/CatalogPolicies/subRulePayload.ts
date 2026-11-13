import type { CreateCatalogRulePayload } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/types";

import type { CatalogRule } from "./types";

export type SubRulePayloadOptions = {
  acknowledgeDisplacement?: boolean;
};

export function ruleToSubRulePayload(
  rule: CatalogRule,
  options: SubRulePayloadOptions = {},
): CreateCatalogRulePayload {
  return {
    type: "sub",
    name: rule.name,
    approval_type: rule.requiresApproval ? "manual" : "auto",
    budget_per_employee:
      rule.selectionMode === "OPEN" ? (rule.budget ?? null) : null,
    external_sync_tools: rule.triggerType === "HRIS" ? ["HRIS"] : [],
    job_titles: criteriaPayload(rule.matchRoleIds, rule.matchRoles),
    levels: criteriaPayload(rule.matchLevelIds, rule.matchLevels),
    departments: criteriaPayload(
      rule.matchDepartmentIds,
      rule.matchDepartments,
    ),
    countries: criteriaPayload(rule.matchCountryIds, rule.matchCountries),
    kits: rule.kitIds,
    allow_item_swap: rule.allowItemSwap,
    include_storage: rule.includeCompanyStorage,
    storage_policy: null,
    selection_config: selectionConfigPayload(rule),
    acknowledge_displacement: Boolean(options.acknowledgeDisplacement),
  };
}

export function ruleToCreateSubRulePayload(
  rule: CatalogRule,
  options: SubRulePayloadOptions = {},
): CreateCatalogRulePayload {
  return ruleToSubRulePayload(rule, options);
}

function criteriaPayload(ids: string[] | undefined, values: string[]) {
  return ids ?? values;
}

function selectionConfigPayload(rule: CatalogRule) {
  if (
    rule.selectionMode !== "OPEN" ||
    !rule.selectionLimitsOverride ||
    !rule.selectionLimits?.length
  ) {
    return null;
  }

  return {
    categories: rule.selectionLimits
      .filter((limit) => limit.categoryId || limit.category)
      .map((limit) => ({
        category_id: limit.categoryId ?? limit.category,
        min: limit.max === null ? null : limit.min,
        max: limit.max,
      })),
  };
}
