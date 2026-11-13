import { format } from "date-fns";

import { currencySymbol } from "@/utils/currencySymbol";
import { catalogKits } from "./dataKits";
import type {
  CatalogKit,
  CatalogRule,
  KitItem,
  RuleStatus,
  SelectionLimit,
} from "./types";

type RuleKitSource = Pick<CatalogRule, "kitIds" | "kits">;

export function formatRuleStatus(status: RuleStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function formatTrigger(trigger: CatalogRule["triggerType"]) {
  return trigger === "HRIS" ? "HRIS sync" : "Manual";
}

export function formatApprovalType(
  rule: Pick<CatalogRule, "requiresApproval">,
) {
  return rule.requiresApproval ? "Require approval" : "Approve automatically";
}

export function shouldShowActivatePolicyAction(
  rule: Pick<CatalogRule, "status">,
) {
  return rule.status !== "ACTIVE";
}

export function formatMoney(value: number, currency?: string | null) {
  const symbol = currencySymbol(currency);
  const amount = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${symbol}${amount}`;
}

export function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy, h:mm a");
}

export function getRuleKits(rule: RuleKitSource) {
  if (rule.kits?.length) return rule.kits;
  return rule.kitIds.map<CatalogKit>((id) => {
    const kit = catalogKits.find((item) => item.id === id);
    return (
      kit ?? {
        id,
        name: id,
        description: "",
        status: "ACTIVE",
        totalCost: 0,
        items: [],
      }
    );
  });
}

export function getSelectionLimitLabels(
  rule: Pick<
    CatalogRule,
    "kitIds" | "kits" | "selectionLimits" | "selectionMode"
  >,
) {
  if (!canConfigureSelectionLimits(rule)) return [];

  const limits = rule.selectionLimits?.length
    ? rule.selectionLimits
    : getDefaultSelectionLimits(rule);

  return limits.map(
    (limit) =>
      `${limit.category} · ${limit.min}\u2013${limit.max ?? "No limit"}`,
  );
}

export function canConfigureSelectionLimits(
  rule: Pick<CatalogRule, "selectionMode">,
) {
  return rule.selectionMode === "OPEN";
}

export function getDefaultSelectionLimits(rule: RuleKitSource) {
  const categories = new Set<string>();

  for (const kit of getRuleKits(rule)) {
    for (const item of kit.items) {
      const category = selectionLimitCategory(item);
      if (category) categories.add(category);
    }
  }

  return SELECTION_LIMIT_ORDER.filter((category) =>
    categories.has(category),
  ).map<SelectionLimit>((category) => ({
    category,
    min: 0,
    max: 1,
  }));
}

export function getSelectionLimitProductCounts(rule: RuleKitSource) {
  const counts = new Map<string, number>();

  for (const kit of getRuleKits(rule)) {
    for (const item of kit.items) {
      const category = selectionLimitCategory(item);
      if (!category) continue;
      counts.set(category, (counts.get(category) ?? 0) + item.quantity);
    }
  }

  return counts;
}

const SELECTION_LIMIT_ORDER = [
  "Audio / Visual",
  "Display",
  "Input Device",
  "Laptop",
];

function selectionLimitCategory(item: KitItem) {
  if (item.category === "Laptop") return "Laptop";
  if (item.category === "Monitor") return "Display";

  const name = item.name.toLowerCase();
  if (
    name.includes("headphone") ||
    name.includes("airpod") ||
    name.includes("earpod") ||
    name.includes("audio")
  ) {
    return "Audio / Visual";
  }
  if (
    name.includes("mouse") ||
    name.includes("keyboard") ||
    name.includes("trackpad") ||
    name.includes("logitech") ||
    name.includes("mx master")
  ) {
    return "Input Device";
  }

  return null;
}

export function summarizeCriteria(rule: CatalogRule) {
  const parts = [
    rule.matchRoles.length ? rule.matchRoles.join(", ") : "All roles",
    rule.matchLevels.length ? rule.matchLevels.join(", ") : "All levels",
    rule.matchDepartments.length
      ? rule.matchDepartments.join(", ")
      : "All departments",
    rule.matchCountries.length
      ? rule.matchCountries.join(", ")
      : "All countries",
  ];
  return parts.join(" · ");
}
