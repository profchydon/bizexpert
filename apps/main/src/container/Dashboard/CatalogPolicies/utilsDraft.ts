import type { CatalogRule } from "./types";
import { calculateSpecificityScore } from "./utilsMatching";

export function createDraftRule(partial?: Partial<CatalogRule>): CatalogRule {
  const now = new Date().toISOString();
  const base = {
    id: `rule-${Date.now()}`,
    name: "",
    purpose: "ONBOARDING" as const,
    matchRoles: [],
    matchLevels: [],
    matchDepartments: [],
    matchCountries: [],
    kitIds: [],
    selectionMode: "FIXED" as const,
    triggerType: "MANUAL" as const,
    allowItemSwap: false,
    includeCompanyStorage: false,
    storageMinGrade: "GRADE_A_ONLY" as const,
    specificityScore: 0,
    status: "DRAFT" as const,
    approverIds: [],
    createdAt: now,
    updatedAt: now,
  };
  const next = { ...base, ...partial };
  return { ...next, specificityScore: calculateSpecificityScore(next) };
}

export function needsMultiKitFixedWarning(
  rule: Pick<CatalogRule, "kitIds" | "selectionMode">,
) {
  return rule.selectionMode === "FIXED" && rule.kitIds.length > 1;
}

export function getMissingSubRuleKitIds(
  rule: Pick<CatalogRule, "kitIds" | "selectionMode">,
  childRules: Pick<CatalogRule, "kitIds">[],
) {
  if (rule.selectionMode !== "OPEN" || rule.kitIds.length <= 1) return [];

  const coveredKitIds = new Set(childRules.flatMap((child) => child.kitIds));
  return rule.kitIds.filter((kitId) => !coveredKitIds.has(kitId));
}
