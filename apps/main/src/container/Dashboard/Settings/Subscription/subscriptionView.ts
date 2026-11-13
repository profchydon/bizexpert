import type { CatalogPlan, ComparisonGroup, PlanCatalog } from "./catalog";
import { formatCharge, formatPlanRate } from "./subscriptionMoney";

export type RenewalInstance = "current" | "past-due" | "lapsed";
export type PlanChangeMode = "upgrade" | "downgrade" | "current";

const PAST_DUE = new Set([
  "past_due",
  "past-due",
  "grace",
  "payment_failed",
  "failed",
]);
const LAPSED = new Set(["lapsed", "cancelled", "canceled", "expired", "ended"]);
const CURRENT_PLAN_SLUGS = new Set(["procure", "manage", "operate", "scale"]);
const LEGACY_PLAN_SLUGS: Record<string, string> = {
  lite: "procure",
  starter: "manage",
  growth: "operate",
  premium: "scale",
  enterprise: "scale",
};

export function canonicalPlanSlug(slug: string | null | undefined): string {
  if (!slug) return "procure";
  const normalized = slug.trim().toLowerCase();
  if (CURRENT_PLAN_SLUGS.has(normalized)) return normalized;
  return LEGACY_PLAN_SLUGS[normalized] ?? "procure";
}

export function renewalInstance(
  status: string | null | undefined,
): RenewalInstance {
  const value = (status ?? "").trim().toLowerCase();
  if (PAST_DUE.has(value)) return "past-due";
  if (LAPSED.has(value)) return "lapsed";
  return "current";
}

export function currentPlanSlug(
  subscription:
    | {
        plan?: { name?: string | null; slug?: string | null } | null;
        price?: { plan_slug?: string | null };
      }
    | null
    | undefined,
  plans: CatalogPlan[],
): string {
  const raw =
    subscription?.plan?.slug?.trim() ||
    subscription?.price?.plan_slug?.trim() ||
    "";
  const mapped = raw ? canonicalPlanSlug(raw) : "";
  if (mapped && plans.some((plan) => plan.slug === mapped)) return mapped;
  const name = subscription?.plan?.name?.toLowerCase();
  const byName = plans.find((plan) => plan.name.toLowerCase() === name)?.slug;
  if (byName) return byName;
  return (
    plans.find((plan) => plan.amount === 0)?.slug ?? plans[0]?.slug ?? "procure"
  );
}

export function billingCurrency(
  subscription:
    | {
        currency?: string | null;
        company?: { billing_currency?: string | null };
      }
    | null
    | undefined,
  plan: CatalogPlan | undefined,
): string {
  return (
    subscription?.currency ||
    subscription?.company?.billing_currency ||
    plan?.estimate?.currency ||
    plan?.currency ||
    "USD"
  );
}

export function baseRate(plan: CatalogPlan, currency: string): number {
  const match = plan.rates.find(
    (rate) =>
      rate.currency.toUpperCase() === currency.toUpperCase() && !rate.addon,
  );
  return match?.amount ?? plan.amount;
}

export function planChangeMode(
  current: CatalogPlan,
  target: CatalogPlan,
): PlanChangeMode {
  if (current.slug === target.slug) return "current";
  return target.rank > current.rank ? "upgrade" : "downgrade";
}

function cell(groups: ComparisonGroup[], code: string, slug: string) {
  for (const group of groups) {
    const feature = group.features.find((item) => item.code === code);
    const match = feature?.cells.find((item) => item.plan === slug);
    if (match) return match;
  }
  return null;
}

export function officeLabel(groups: ComparisonGroup[], slug: string): string {
  const match = cell(groups, "offices", slug);
  const label = match?.label?.trim();
  if (!label) return "Not set";
  if (label.toLowerCase() === "unlimited") return "Unlimited offices";
  const count = Number(label);
  if (!Number.isFinite(count)) return label;
  return `Up to ${count} ${count === 1 ? "office" : "offices"}`;
}

export function formatBillingDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function upgradeBlockedWithoutDevices(
  mode: PlanChangeMode,
  devices: number,
): boolean {
  return mode === "upgrade" && devices <= 0;
}

export function fleetCount(plans: CatalogPlan[]): number {
  return (
    plans.find((plan) => plan.estimate && plan.estimate.deviceCount > 0)
      ?.estimate?.deviceCount ?? 0
  );
}

export function deviceCountForUpgrade(
  estimateCount: number,
  equipmentTotal?: number,
): number {
  if (equipmentTotal == null) return estimateCount;
  return Math.max(estimateCount, equipmentTotal);
}

export function monthlyWorking(
  plan: CatalogPlan,
  currency: string,
  devices: number,
): string {
  const rate = formatPlanRate(baseRate(plan, currency), currency);
  const noun = devices === 1 ? "device" : "devices";
  return `${devices} ${noun} × ${rate}`;
}

export function renewalBanner(input: {
  instance: RenewalInstance;
  planName: string;
  settleBy: string;
}): { title: string; description: string; cta: string } | null {
  if (input.instance === "past-due") {
    const when = input.settleBy ? ` by ${input.settleBy}` : "";
    return {
      title: "Your renewal is past due",
      description: `Settle the ${input.planName} renewal${when} to keep this plan. Overdue accounts are suspended.`,
      cta: "See plans",
    };
  }
  if (input.instance === "lapsed") {
    return {
      title: `Your ${input.planName} plan has ended`,
      description:
        "Subscribe again whenever you are ready. Your devices, employees, and records are still here.",
      cta: "See plans",
    };
  }
  return null;
}

export function isFreePlan(plan: CatalogPlan | undefined): boolean {
  return !plan || plan.amount === 0;
}

export function summaryTotal(plan: CatalogPlan, currency: string): string {
  if (isFreePlan(plan)) return "Free";
  if (plan.estimate && plan.estimate.amount > 0) {
    return formatCharge(
      plan.estimate.amount,
      plan.estimate.currency || currency,
    );
  }
  return formatCharge(baseRate(plan, currency), currency);
}

export function comparisonRowCount(catalog: PlanCatalog): number {
  return catalog.groups.reduce((sum, group) => sum + group.features.length, 0);
}

export function highlightDelta(
  plans: CatalogPlan[],
  current: CatalogPlan,
  target: CatalogPlan,
  mode: PlanChangeMode,
): string[] {
  const between = plans.filter((plan) =>
    mode === "upgrade"
      ? plan.rank > current.rank && plan.rank <= target.rank
      : plan.rank > target.rank && plan.rank <= current.rank,
  );
  return between
    .flatMap((plan) => plan.highlights)
    .filter((feature) => !feature.startsWith("Everything in"));
}
