import type { SubscriptionEntitlement } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";

export interface LimitUsageRow {
  code: string;
  name: string;
  label: string;
  softWarning: boolean;
  atLimit: boolean;
}

const COUNTED = new Set(["numeric_limit", "metered"]);
const HIDDEN_USAGE = new Set([
  "seat",
  "seats",
  "seat_limit",
  "tags",
  "tags_limit",
]);

function hiddenUsage(item: SubscriptionEntitlement): boolean {
  return (
    HIDDEN_USAGE.has(item.code.trim().toLowerCase()) ||
    HIDDEN_USAGE.has(item.name.trim().toLowerCase())
  );
}

export function limitUsageRows(
  entitlements: SubscriptionEntitlement[] | null | undefined,
): LimitUsageRow[] {
  if (!entitlements?.length) return [];
  return entitlements.flatMap((item) => {
    if (!COUNTED.has(item.value_type) || hiddenUsage(item)) return [];
    const atLimit = !item.unlimited && (item.remaining ?? 1) <= 0;
    return [
      {
        code: item.code,
        name: item.name,
        label: usageLabel(item, atLimit),
        softWarning: Boolean(item.soft_warning) || atLimit,
        atLimit,
      },
    ];
  });
}

function usageLabel(item: SubscriptionEntitlement, atLimit: boolean): string {
  const cap = item.unit ? `${item.value} ${item.unit}` : item.value;
  const base = item.unlimited
    ? `${item.usage} used · Unlimited`
    : `${item.usage} of ${cap}`;
  if (atLimit) return `${base} · Limit reached`;
  if (item.soft_warning) return `${base} · Near limit`;
  return base;
}
