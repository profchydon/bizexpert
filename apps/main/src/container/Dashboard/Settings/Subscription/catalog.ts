export interface CatalogRate {
  currency: string;
  amount: number;
  addon: boolean;
}

export interface PlanEstimate {
  deviceCount: number;
  amount: number;
  currency: string;
  display: string;
}

export interface CatalogPlan {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  highlights: string[];
  rank: number;
  amount: number;
  currency: string;
  unit: string | null;
  pricingId: string | null;
  estimate: PlanEstimate | null;
  rates: CatalogRate[];
}

export type CellKind = "included" | "excluded" | "addon" | "value";

export interface ComparisonCell {
  plan: string;
  kind: CellKind;
  label: string | null;
}

export interface ComparisonFeature {
  code: string;
  name: string;
  cells: ComparisonCell[];
}

export interface ComparisonGroup {
  key: string;
  name: string;
  features: ComparisonFeature[];
}

export interface PlanCatalog {
  plans: CatalogPlan[];
  groups: ComparisonGroup[];
}

const EMPTY: PlanCatalog = { plans: [], groups: [] };

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function num(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseEstimate(value: unknown): PlanEstimate | null {
  const row = record(value);
  if (!row) return null;
  return {
    deviceCount: num(row.device_count),
    amount: num(row.amount),
    currency: text(row.currency),
    display: text(row.display),
  };
}

function parsePlan(value: unknown): CatalogPlan | null {
  const row = record(value);
  if (!row || !text(row.slug)) return null;
  const price = record(row.price);
  const rates = Array.isArray(row.rates) ? row.rates : [];
  return {
    id: text(row.id),
    name: text(row.name),
    slug: text(row.slug),
    tagline: text(row.tagline) || text(row.description),
    highlights: Array.isArray(row.highlights)
      ? row.highlights.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    rank: num(row.rank),
    amount: num(price?.amount),
    currency: text(price?.currency) || "USD",
    unit: price?.unit == null ? null : text(price.unit) || null,
    pricingId: text(price?.id) || null,
    estimate: parseEstimate(row.estimate),
    rates: rates.flatMap((rate) => {
      const item = record(rate);
      if (!item) return [];
      return [
        {
          currency: text(item.currency),
          amount: num(item.amount),
          addon: Boolean(item.feature_id),
        },
      ];
    }),
  };
}

function parseCell(value: unknown): ComparisonCell | null {
  const row = record(value);
  if (!row) return null;
  const kind = text(row.kind);
  if (
    kind !== "included" &&
    kind !== "excluded" &&
    kind !== "addon" &&
    kind !== "value"
  ) {
    return null;
  }
  return {
    plan: text(row.plan),
    kind,
    label: row.label == null ? null : text(row.label) || null,
  };
}

function parseGroup(value: unknown): ComparisonGroup | null {
  const row = record(value);
  if (!row) return null;
  const features = Array.isArray(row.features) ? row.features : [];
  return {
    key: text(row.key),
    name: text(row.name),
    features: features.flatMap((feature) => {
      const item = record(feature);
      if (!item) return [];
      const cells = Array.isArray(item.cells) ? item.cells : [];
      return [
        {
          code: text(item.code),
          name: text(item.name),
          cells: cells.flatMap((cell) => {
            const parsed = parseCell(cell);
            return parsed ? [parsed] : [];
          }),
        },
      ];
    }),
  };
}

export function parsePlanCatalog(payload: unknown): PlanCatalog {
  const root = record(payload);
  const data = record(root?.data) ?? root;
  if (!data) return EMPTY;
  const plans = Array.isArray(data.plans) ? data.plans : [];
  const groups = Array.isArray(data.groups) ? data.groups : [];
  return {
    plans: plans
      .flatMap((plan) => {
        const parsed = parsePlan(plan);
        return parsed ? [parsed] : [];
      })
      .sort((a, b) => a.rank - b.rank),
    groups: groups.flatMap((group) => {
      const parsed = parseGroup(group);
      return parsed ? [parsed] : [];
    }),
  };
}
