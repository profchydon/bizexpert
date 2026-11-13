import type {
  CatalogRule,
  SelectionLimit,
  StorageGrade,
  TriggerType,
} from "./types";
import { selectionLimitKey } from "./selectionLimitAdapters";
import { calculateSpecificityScore } from "./utilsMatching";

export interface ChildRuleDraft {
  id: string;
  name: string;
  kitIds: string[];
  triggerType: TriggerType;
  storageInclude: boolean;
  storageGrade: StorageGrade;
  allowItemSwap: boolean;
  overrideKit: boolean;
  overrideTrigger: boolean;
  overrideStorage: boolean;
  overrideItemSwap: boolean;
  overrideCategoryLimits: boolean;
  categoryLimits: SelectionLimit[];
  narrowRoles: string[];
  narrowLevels: string[];
  narrowLevelIds?: string[];
  narrowDepartments: string[];
  narrowDepartmentIds?: string[];
  narrowCountries: string[];
  narrowCountryIds?: string[];
}

export function createChildRuleDraft(
  id: string,
  parent: CatalogRule,
): ChildRuleDraft {
  return {
    id,
    name: "",
    kitIds: [],
    triggerType: parent.triggerType,
    storageInclude: parent.includeCompanyStorage,
    storageGrade: parent.storageMinGrade,
    allowItemSwap: parent.allowItemSwap,
    overrideKit: true,
    overrideTrigger: false,
    overrideStorage: false,
    overrideItemSwap: false,
    overrideCategoryLimits: false,
    categoryLimits: parent.selectionLimits ?? [],
    narrowRoles: [],
    narrowLevels: [],
    narrowLevelIds: undefined,
    narrowDepartments: [],
    narrowDepartmentIds: undefined,
    narrowCountries: [],
    narrowCountryIds: undefined,
  };
}

export function childRuleToDraft(
  rule: CatalogRule,
  parent: CatalogRule,
): ChildRuleDraft {
  return {
    id: rule.id,
    name: rule.name,
    kitIds: rule.kitIds,
    triggerType: rule.triggerType,
    storageInclude: rule.includeCompanyStorage,
    storageGrade: rule.storageMinGrade,
    allowItemSwap: rule.allowItemSwap,
    overrideKit: rule.kitIds.length > 0,
    overrideTrigger: rule.triggerType !== parent.triggerType,
    overrideStorage:
      rule.includeCompanyStorage !== parent.includeCompanyStorage ||
      rule.storageMinGrade !== parent.storageMinGrade,
    overrideItemSwap: rule.allowItemSwap !== parent.allowItemSwap,
    overrideCategoryLimits: Boolean(
      rule.selectionLimits &&
      !sameSelectionLimits(rule.selectionLimits, parent.selectionLimits),
    ),
    categoryLimits: rule.selectionLimits ?? parent.selectionLimits ?? [],
    narrowRoles: rule.matchRoles,
    narrowLevels: rule.matchLevels,
    narrowLevelIds: rule.matchLevelIds,
    narrowDepartments: rule.matchDepartments,
    narrowDepartmentIds: rule.matchDepartmentIds,
    narrowCountries: rule.matchCountries,
    narrowCountryIds: rule.matchCountryIds,
  };
}

export function isChildRuleDraftValid(draft: ChildRuleDraft) {
  const changesSelected =
    draft.overrideKit ||
    draft.overrideTrigger ||
    draft.overrideStorage ||
    draft.overrideItemSwap ||
    draft.overrideCategoryLimits;
  if (!changesSelected) return false;
  if (!draft.name.trim()) return false;
  if (draft.kitIds.length === 0) return false;
  return true;
}

export function getChildRuleLimitViolations(
  draft: ChildRuleDraft,
  parent: CatalogRule,
) {
  if (!draft.overrideCategoryLimits) return [];

  const parentByKey = new Map(
    (parent.selectionLimits ?? []).map((limit) => [
      selectionLimitKey(limit),
      limit,
    ]),
  );

  return draft.categoryLimits
    .map((limit) => {
      const key = selectionLimitKey(limit);
      const parentLimit = parentByKey.get(selectionLimitKey(limit));
      if (!parentLimit) return null;

      const messages: string[] = [];
      if (limit.min > parentLimit.min) {
        messages.push(`Min must be ${parentLimit.min} or less.`);
      }
      if (
        parentLimit.max !== null &&
        (limit.max === null || limit.max > parentLimit.max)
      ) {
        messages.push(`Max must be up to ${parentLimit.max} or less.`);
      }
      if (!messages.length) return null;

      return {
        key,
        message: messages.join(" "),
      };
    })
    .filter((violation): violation is { key: string; message: string } =>
      Boolean(violation),
    );
}

export function isChildRuleReadyToSave(
  draft: ChildRuleDraft,
  parent: CatalogRule,
) {
  return (
    isChildRuleDraftValid(draft) &&
    !getChildRuleLimitViolations(draft, parent).length
  );
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

export function scopeSelectionLimitsToParent(
  limits: SelectionLimit[],
  parentLimits: SelectionLimit[] | undefined,
) {
  const parentByKey = new Map(
    (parentLimits ?? []).map((limit) => [selectionLimitKey(limit), limit]),
  );

  return limits.map((limit) => {
    const parentLimit = parentByKey.get(selectionLimitKey(limit));
    if (!parentLimit) return limit;

    const max =
      parentLimit.max === null
        ? limit.max
        : limit.max === null
          ? parentLimit.max
          : Math.min(limit.max, parentLimit.max);
    return {
      ...limit,
      min:
        max === null
          ? Math.min(limit.min, parentLimit.min)
          : Math.min(limit.min, parentLimit.min, max),
      max,
    };
  });
}

export function composeChildRule(
  parent: CatalogRule,
  draft: ChildRuleDraft,
  now: string,
): CatalogRule {
  const child: CatalogRule = {
    ...parent,
    id: draft.id,
    backendRuleId: undefined,
    name: draft.name.trim(),
    parentRuleId: parent.id,
    status: "DRAFT",
    createdAt: now,
    updatedAt: now,
    matchRoles: draft.narrowRoles.length
      ? draft.narrowRoles
      : parent.matchRoles,
    matchRoleIds: draft.narrowRoles.length ? undefined : parent.matchRoleIds,
    matchLevels: draft.narrowLevels.length
      ? draft.narrowLevels
      : parent.matchLevels,
    matchLevelIds: draft.narrowLevels.length
      ? draft.narrowLevelIds
      : parent.matchLevelIds,
    matchDepartments: draft.narrowDepartments.length
      ? draft.narrowDepartments
      : parent.matchDepartments,
    matchDepartmentIds: draft.narrowDepartments.length
      ? draft.narrowDepartmentIds
      : parent.matchDepartmentIds,
    matchCountries: draft.narrowCountries.length
      ? draft.narrowCountries
      : parent.matchCountries,
    matchCountryIds: draft.narrowCountries.length
      ? draft.narrowCountryIds
      : parent.matchCountryIds,
    kitIds: draft.overrideKit ? draft.kitIds : parent.kitIds,
    triggerType: draft.overrideTrigger ? draft.triggerType : parent.triggerType,
    includeCompanyStorage: draft.overrideStorage
      ? draft.storageInclude
      : parent.includeCompanyStorage,
    storageMinGrade: draft.overrideStorage
      ? draft.storageGrade
      : parent.storageMinGrade,
    allowItemSwap: draft.overrideItemSwap
      ? draft.allowItemSwap
      : parent.allowItemSwap,
    selectionLimits: draft.overrideCategoryLimits
      ? scopeSelectionLimitsToParent(
          draft.categoryLimits,
          parent.selectionLimits,
        )
      : parent.selectionLimits,
    selectionLimitsOverride: draft.overrideCategoryLimits,
  };

  return { ...child, specificityScore: calculateSpecificityScore(child) };
}
