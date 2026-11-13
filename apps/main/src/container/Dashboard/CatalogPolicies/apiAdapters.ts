import type { IKit, IKitListItem } from "@/types/kit";
import type {
  CatalogPolicyApiJobTitleReference,
  CatalogPolicyApiNamedReference,
  CatalogPolicyApiApprover,
  CatalogPolicyApiPolicy,
  CatalogPolicyApiRequest,
  CatalogPolicyApiRule,
  CatalogPolicyApiRuleKit,
  CatalogPolicyApiRulePayload,
} from "@/types/catalogPolicy";

import type {
  CatalogKit,
  CatalogRule,
  CatalogRuleApprover,
  KitItem,
  SelectionLimit,
} from "./types";

type StoragePolicy = {
  min_grade?: CatalogRule["storageMinGrade"];
  selection_limits?: SelectionLimit[];
};
type PolicyPayloadOptions = {
  acknowledgeDisplacement?: boolean;
  currentUserId?: string;
  forceRuleActive?: boolean;
  selectionCategoryIds?: string[];
};

export function policyToRule(policy: CatalogPolicyApiPolicy): CatalogRule {
  const mainRule =
    policy.main_rule ??
    getPolicyRules(policy).find((rule) => rule.type === "main");
  return apiRuleToCatalogRule(mainRule, policy);
}

export function getPolicyRules(policy: CatalogPolicyApiPolicy) {
  if (Array.isArray(policy.rules)) return policy.rules;
  return policy.rules?.data ?? [];
}

export function getPolicyChildRules(
  policy: CatalogPolicyApiPolicy,
  rules?: CatalogPolicyApiRule[],
) {
  const source = rules ?? getPolicyRules(policy);
  return source
    .filter((rule) => rule.type === "sub")
    .map((rule) => apiRuleToCatalogRule(rule, policy));
}

export function apiRuleToCatalogRule(
  rule: CatalogPolicyApiRule | undefined,
  policy: CatalogPolicyApiPolicy,
): CatalogRule {
  const storagePolicy = (rule?.storage_policy ?? {}) as StoragePolicy;
  return {
    id: rule?.type === "sub" ? rule.id : policy.id,
    catalogId: policy.id,
    backendRuleId: rule?.id,
    name:
      rule?.type === "sub" ? rule.name || "Untitled sub policy" : policy.name,
    purpose: "ONBOARDING",
    matchRoles: criteriaToLabels(rule?.job_titles ?? rule?.roles),
    matchRoleIds: criteriaToIds(rule?.job_titles ?? rule?.roles),
    matchLevels: criteriaToLabels(rule?.levels),
    matchLevelIds: criteriaToIds(rule?.levels),
    matchDepartments: criteriaToLabels(rule?.departments),
    matchDepartmentIds: criteriaToIds(rule?.departments),
    matchCountries: criteriaToLabels(rule?.countries),
    matchCountryIds: criteriaToIds(rule?.countries),
    kitIds: kitsToIds(rule?.kits),
    kits: kitsToCatalogKits(rule?.kits),
    selectionMode:
      (rule?.selection_mode ?? policy.selection_mode) === "open"
        ? "OPEN"
        : "FIXED",
    triggerType: rule?.trigger_mode === "external_sync" ? "HRIS" : "MANUAL",
    allowItemSwap: Boolean(rule?.allow_item_swap),
    includeCompanyStorage: Boolean(rule?.include_storage),
    storageMinGrade: storagePolicy.min_grade ?? "GRADE_A_ONLY",
    specificityScore: rule?.specificity_score ?? 0,
    status: policy.is_archived
      ? "ARCHIVED"
      : policy.status === "active"
        ? "ACTIVE"
        : "DRAFT",
    parentRuleId: rule?.type === "sub" ? policy.id : null,
    budget: Number(
      rule?.budget_per_employee ?? policy.budget_per_employee ?? 0,
    ),
    requiresApproval:
      (rule?.approval_type ?? policy.approval_type) === "manual",
    approverType: apiApproverType(policy.approver_type),
    approverIds:
      policy.approver_ids ?? policy.approvers?.map((approver) => approver.id),
    approvers: policy.approvers?.map(apiApproverToCatalogApprover),
    selectionLimits: selectionConfigToLimits(rule?.selection_config),
    createdAt: rule?.created_at ?? policy.created_at,
    updatedAt: rule?.updated_at ?? policy.updated_at,
  };
}

export function ruleToPolicyPayload(
  rule: CatalogRule,
  options: PolicyPayloadOptions = {},
): CatalogPolicyApiRequest {
  const apiRulePayload = ruleToApiRulePayload(rule);
  const approverIds = approverIdsPayload(rule);
  return {
    name: rule.name,
    description: null,
    purpose: "onboarding",
    status: rule.status === "ACTIVE" ? "active" : "inactive",
    ...(approverIds !== undefined ? { approver_ids: approverIds } : {}),
    rule: {
      ...apiRulePayload,
      ...(typeof options.acknowledgeDisplacement === "boolean"
        ? { acknowledge_displacement: options.acknowledgeDisplacement }
        : {}),
      ...(options.forceRuleActive ? { is_active: true } : {}),
      ...openSelectionConfig(rule, options.selectionCategoryIds),
    },
  };
}

function apiApproverType(type: CatalogPolicyApiPolicy["approver_type"]) {
  if (type === "line_manager") return "LINE_MANAGER";
  if (type === "specific") return "SPECIFIC";
  if (type === "admin") return "ADMIN";
  return undefined;
}

function approverIdsPayload(rule: CatalogRule) {
  if (!rule.requiresApproval) return null;
  if (rule.approverType === "LINE_MANAGER") return undefined;
  if (rule.approverType === "SPECIFIC") return rule.approverIds ?? [];
  return uniqueIds(rule.approverIds ?? []);
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function apiApproverToCatalogApprover(
  approver: CatalogPolicyApiApprover,
): CatalogRuleApprover {
  return {
    id: approver.id,
    firstName: approver.first_name,
    lastName: approver.last_name,
    email: approver.email,
  };
}

function openSelectionConfig(rule: CatalogRule, categoryIds?: string[]) {
  if (rule.selectionMode !== "OPEN") return {};
  const categories = categoryIds
    ? categoryIds.map((id) => {
        const limit = selectionLimitForCategory(rule.selectionLimits, id);
        return {
          category_id: id,
          min: limit?.max === null ? null : (limit?.min ?? 0),
          max: limit?.max ?? 1,
        };
      })
    : rule.selectionLimits?.length
      ? rule.selectionLimits
          .filter((limit) => limit.categoryId || limit.category)
          .map((limit) => ({
            category_id: limit.categoryId ?? limit.category,
            min: limit.max === null ? null : limit.min,
            max: limit.max,
          }))
      : (categoryIds ?? []).map((id) => ({
          category_id: id,
          min: 0,
          max: 1,
        }));
  return { selection_config: { categories } };
}

function selectionLimitForCategory(
  limits: SelectionLimit[] | undefined,
  categoryId: string,
) {
  return limits?.find(
    (limit) => (limit.categoryId ?? limit.category) === categoryId,
  );
}

function selectionConfigToLimits(
  config: CatalogPolicyApiRulePayload["selection_config"] | null | undefined,
) {
  return config?.categories?.map<SelectionLimit>((category) => ({
    categoryId: category.category_id,
    category: category.category_id,
    min: category.min ?? 0,
    max: category.max,
  }));
}

export function ruleToApiRulePayload(
  rule: CatalogRule,
): CatalogPolicyApiRulePayload {
  return {
    selection_mode: rule.selectionMode === "OPEN" ? "open" : "fixed",
    approval_type: rule.requiresApproval ? "manual" : "auto",
    ...(rule.selectionMode === "OPEN"
      ? { budget_per_employee: rule.budget ?? null }
      : {}),
    trigger_mode: rule.triggerType === "MANUAL" ? "manual" : "external_sync",
    trigger_sources: rule.triggerType === "MANUAL" ? [] : ["HRIS"],
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
    is_active: rule.status === "ACTIVE",
  };
}

function criteriaToLabels(items?: CriteriaReference[] | null) {
  return (items ?? []).map(criteriaLabel);
}

function criteriaToIds(items?: CriteriaReference[] | null) {
  return (items ?? []).map(criteriaId);
}

type CriteriaReference =
  | string
  | CatalogPolicyApiNamedReference
  | CatalogPolicyApiJobTitleReference;

function criteriaLabel(item: CriteriaReference) {
  if (typeof item === "string") return item;
  if ("value" in item) return item.value;
  return item.name || item.id;
}

function criteriaId(item: CriteriaReference) {
  if (typeof item === "string") return item;
  if ("value" in item) return item.value;
  return item.id;
}

function criteriaPayload(ids: string[] | undefined, values: string[]) {
  return ids?.length ? ids : values;
}

function kitsToIds(ruleKits: CatalogPolicyApiRule["kits"] | undefined) {
  if (Array.isArray(ruleKits)) return ruleKits;
  return ruleKits?.data?.map((kit) => kit.id) ?? [];
}

function kitsToCatalogKits(ruleKits: CatalogPolicyApiRule["kits"] | undefined) {
  if (!ruleKits || Array.isArray(ruleKits)) return undefined;
  return ruleKits.data?.map(ruleKitToCatalogKit);
}

function ruleKitToCatalogKit(kit: CatalogPolicyApiRuleKit): CatalogKit {
  return {
    id: kit.id,
    name: kit.name ?? kit.id,
    description: "",
    status: kit.status === "draft" ? "DRAFT" : "ACTIVE",
    totalCost: 0,
    items: [],
    itemsCount: kit.items_count ?? 0,
  };
}

export function kitToCatalogKit(kit: IKit | IKitListItem): CatalogKit {
  const apiItems = "items" in kit && Array.isArray(kit.items) ? kit.items : [];
  const items = apiItems.map(kitItemToItem);
  return {
    id: kit.id,
    name: kit.name ?? "Untitled kit",
    description: "description" in kit ? (kit.description ?? "") : "",
    status: kit.status === "active" ? "ACTIVE" : "DRAFT",
    totalCost: items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    ),
    items,
    itemsCount: kit.items_count ?? items.length,
  };
}

function kitItemToItem(item: NonNullable<IKit["items"]>[number]): KitItem {
  const spec = item.asset_specification ?? {};
  const name = typeof spec.name === "string" ? spec.name : "Kit item";
  return {
    id: item.id,
    name,
    category: typeof spec.category === "string" ? spec.category : "Accessory",
    quantity: item.quantity,
    unitPrice: 0,
    imageTone: "bg-gray-100 text-gray-700",
  };
}
