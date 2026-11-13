import type {
  CatalogPolicyApiPolicy,
  CatalogPolicyApiRule,
  CatalogPolicyApiRuleKit,
} from "@/types/catalogPolicy";
import type { IKitItem } from "@/types/kit";

import type {
  ApprovalItem,
  ApprovalRecord,
  ItemSource,
  ItemTier,
} from "./types";

export function getApprovalPolicyKitIds(
  policy?: CatalogPolicyApiPolicy,
  catalogRuleId?: string,
) {
  const matchedRule = policyRule(policy, catalogRuleId);
  return Array.from(new Set(kitIdsFromRule(matchedRule)));
}

export function getApprovalPolicyAllowItemSwap(
  policy?: CatalogPolicyApiPolicy,
  catalogRuleId?: string,
) {
  return policyRule(policy, catalogRuleId)?.allow_item_swap ?? false;
}

export function enrichApprovalRecord(
  record: ApprovalRecord,
  kitItems: IKitItem[],
  options: { allowItemSwap?: boolean } = {},
): ApprovalRecord {
  const kitItemsById = new Map(kitItems.map((item) => [item.id, item]));

  return {
    ...record,
    allowItemSwap: record.allowItemSwap || Boolean(options.allowItemSwap),
    items: record.items.map((item) =>
      enrichApprovalItem(item, kitItemsById.get(item.kitItemId ?? "")),
    ),
  };
}

function enrichApprovalItem(
  item: ApprovalItem,
  kitItem?: IKitItem,
): ApprovalItem {
  if (!kitItem) return item;
  const spec = kitItem.asset_specification;

  return {
    ...item,
    categoryId: item.categoryId ?? categoryIdFromSpec(spec),
    category: item.category ?? spec?.category ?? undefined,
    imageUrl: item.imageUrl ?? spec?.images?.[0],
    kitId: item.kitId ?? kitItem.kit_id,
    leadTimeDays: item.leadTimeDays ?? leadTimeFromSpec(spec),
    name: item.name ?? spec?.name ?? undefined,
    source: item.source ?? sourceFromSpec(spec),
    tier: item.tier ?? tierFromKitItem(kitItem),
  };
}

function policyRules(policy?: CatalogPolicyApiPolicy): CatalogPolicyApiRule[] {
  const rules = policy?.rules;
  const ruleList = Array.isArray(rules) ? rules : (rules?.data ?? []);
  return [policy?.main_rule, ...ruleList].filter(
    Boolean,
  ) as CatalogPolicyApiRule[];
}

function policyRule(policy?: CatalogPolicyApiPolicy, catalogRuleId?: string) {
  const rules = policyRules(policy);
  return (
    rules.find((rule) => rule.id === catalogRuleId) ??
    policy?.main_rule ??
    rules[0]
  );
}

function kitIdsFromRule(rule?: CatalogPolicyApiRule | null) {
  const kits = rule?.kits;
  if (!kits) return [];
  if (Array.isArray(kits)) return kits.flatMap(kitIdFromValue);
  return (kits.data ?? []).flatMap(kitIdFromValue);
}

function kitIdFromValue(value: string | CatalogPolicyApiRuleKit) {
  return typeof value === "string" ? [value] : value.id ? [value.id] : [];
}

function tierFromKitItem(item: IKitItem): ItemTier {
  return item.required ? "REQUIRED" : "OPTIONAL";
}

function categoryIdFromSpec(spec?: IKitItem["asset_specification"]) {
  const record = spec as Record<string, unknown> | undefined;
  const category = record?.category;
  if (typeof record?.category_id === "string") return record.category_id;
  if (category && typeof category === "object" && "id" in category) {
    return typeof category.id === "string" ? category.id : undefined;
  }
  const asset = record?.asset as Record<string, unknown> | undefined;
  if (asset && typeof asset === "object") {
    const assetCategory = asset.category;
    if (
      assetCategory &&
      typeof assetCategory === "object" &&
      "id" in assetCategory
    ) {
      return typeof assetCategory.id === "string"
        ? assetCategory.id
        : undefined;
    }
  }
  return undefined;
}

function leadTimeFromSpec(spec?: IKitItem["asset_specification"]) {
  const value = spec?.lead_time_days ?? spec?.lead_time ?? spec?.leadTimeDays;
  return value == null ? undefined : Number(value);
}

function sourceFromSpec(
  spec?: IKitItem["asset_specification"],
): ItemSource | undefined {
  const value = String(
    spec?.source ?? spec?.fulfillment_source ?? spec?.fulfillment_type ?? "",
  ).toUpperCase();

  if (value.includes("RFQ")) return "RFQ";
  if (value.includes("MARKET")) return "MARKETPLACE";
  if (value.includes("STORAGE")) return "STORAGE";
  return undefined;
}
