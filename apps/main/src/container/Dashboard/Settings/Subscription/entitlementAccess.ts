import type { SubscriptionEntitlement } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import type { ComparisonGroup } from "./catalog";

export interface CountedLimit {
  usage: number;
  unlimited: boolean;
  remaining: number | null;
  softWarning: boolean;
  atLimit: boolean;
  cap: number | null;
}

const COUNTED = new Set(["numeric_limit", "metered"]);

export function findEntitlement(
  items: SubscriptionEntitlement[] | null | undefined,
  code: string,
): SubscriptionEntitlement | null {
  return items?.find((item) => item.code === code) ?? null;
}

export function featureOn(
  item: SubscriptionEntitlement | null | undefined,
): boolean {
  return Boolean(item?.allowed);
}

export function countedLimit(
  item: SubscriptionEntitlement | null | undefined,
): CountedLimit | null {
  if (!item || !COUNTED.has(item.value_type)) return null;
  const unlimited =
    item.unlimited || item.value.trim().toLowerCase() === "unlimited";
  const parsed = Number(item.value);
  const cap = unlimited || !Number.isFinite(parsed) ? null : parsed;
  const atLimit = !unlimited && (item.remaining ?? 1) <= 0;
  return {
    usage: item.usage,
    unlimited,
    remaining: item.remaining,
    softWarning: Boolean(item.soft_warning) || atLimit,
    atLimit,
    cap,
  };
}

export function officeLimitLabel(
  item: SubscriptionEntitlement | null | undefined,
): string | null {
  const row = countedLimit(item);
  if (!row) return null;
  if (row.unlimited) return "Unlimited offices";
  if (row.cap == null) return null;
  return `Up to ${row.cap} ${row.cap === 1 ? "office" : "offices"}`;
}

interface PlanCap {
  kind: "unlimited" | "max" | "excluded";
  max: number;
}

function catalogCell(groups: ComparisonGroup[], code: string, slug: string) {
  for (const group of groups) {
    const feature = group.features.find((item) => item.code === code);
    const match = feature?.cells.find((item) => item.plan === slug);
    if (match) return match;
  }
  return null;
}

export function planCap(
  groups: ComparisonGroup[],
  code: string,
  slug: string,
): PlanCap | null {
  const match = catalogCell(groups, code, slug);
  if (!match) return null;
  if (match.kind === "excluded") return { kind: "excluded", max: 0 };
  const label = match.label?.trim().toLowerCase() ?? "";
  if (match.kind === "included" || label === "unlimited") {
    return { kind: "unlimited", max: Number.POSITIVE_INFINITY };
  }
  const max = Number(match.label?.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(max)) return { kind: "excluded", max: 0 };
  return { kind: "max", max };
}

const DOWNGRADE_CHECKS = [
  {
    usageCode: "office_limit",
    catalogCode: "offices",
    noun: "office",
    plural: "offices",
  },
  {
    usageCode: "tags_limit",
    catalogCode: "tags",
    noun: "tag",
    plural: "tags",
  },
] as const;

export function downgradeBlocks(
  items: SubscriptionEntitlement[] | null | undefined,
  groups: ComparisonGroup[],
  targetSlug: string,
): string[] {
  return DOWNGRADE_CHECKS.flatMap((check) => {
    const row = countedLimit(findEntitlement(items, check.usageCode));
    if (!row) return [];
    const cap = planCap(groups, check.catalogCode, targetSlug);
    if (!cap || cap.kind === "unlimited" || row.usage <= cap.max) return [];
    if (cap.max === 0) {
      return [
        row.usage === 1
          ? `Remove the ${check.noun} you are using before switching.`
          : `Remove all ${row.usage} ${check.plural} before switching.`,
      ];
    }
    const used = row.usage === 1 ? check.noun : check.plural;
    return [
      `You are using ${row.usage} ${used}. Bring that down to ${cap.max} or fewer before switching.`,
    ];
  });
}
