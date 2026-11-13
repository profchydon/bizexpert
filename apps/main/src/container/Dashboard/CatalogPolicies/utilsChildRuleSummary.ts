import type { CatalogRule, SelectionLimit } from "./types";
import type { ChildRuleDraft } from "./utilsChildRule";

export function getChildRuleOverrideLabels(
  rule: CatalogRule,
  parent: CatalogRule,
) {
  const labels: string[] = [];
  if (!sameList(rule.kitIds, parent.kitIds)) labels.push("Kits override");
  if (rule.triggerType !== parent.triggerType) labels.push("Trigger override");
  if (
    rule.includeCompanyStorage !== parent.includeCompanyStorage ||
    rule.storageMinGrade !== parent.storageMinGrade
  ) {
    labels.push("Storage override");
  }
  if (rule.allowItemSwap !== parent.allowItemSwap) {
    labels.push("Item swap override");
  }
  if (
    rule.selectionLimitsOverride ||
    (rule.selectionLimits &&
      !sameSelectionLimits(rule.selectionLimits, parent.selectionLimits))
  ) {
    labels.push("Category limits override");
  }
  return labels;
}

export function describeChildRuleOverrides(draft: ChildRuleDraft) {
  const labels: string[] = [];
  if (draft.overrideKit) labels.push("Assign kit");
  if (draft.overrideTrigger) labels.push("HRIS sync");
  if (draft.overrideStorage) labels.push("Storage policy");
  if (draft.overrideItemSwap) labels.push("Item swap");
  if (draft.overrideCategoryLimits) labels.push("Category limits");
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} & ${labels[1]}`;
  if (labels.length > 2) return "Multiple overrides";
  return "Overrides";
}

export function summarizeChildRule(rule: CatalogRule) {
  const parts = [
    rule.matchRoles.join(", "),
    rule.matchLevels.join(", "),
    rule.matchDepartments.join(", "),
    rule.matchCountries.join(", "),
  ].filter(Boolean);
  return parts.join(" · ") || "Inheriting parent scope";
}

function sameList(a: string[], b: string[]) {
  return a.join("|") === b.join("|");
}

function sameSelectionLimits(
  a: SelectionLimit[] | undefined,
  b: SelectionLimit[] | undefined,
) {
  return JSON.stringify(a ?? []) === JSON.stringify(b ?? []);
}
