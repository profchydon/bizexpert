import type { IPlan, IPlanFeatures, IPlanPrice } from "@/types/plans";

type CatalogPrice = IPlanPrice & { display?: string };

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function scalar(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return text(value);
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function cycle(price: Record<string, unknown>): string {
  const existing = text(price.billing_cycle);
  if (existing) return existing;
  const interval = text(price.interval);
  if (interval === "month") return "Monthly";
  if (interval === "year") return "Yearly";
  return interval;
}

function features(value: unknown): IPlanFeatures[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is IPlanFeatures => {
    const row = record(item);
    return Boolean(row && text(row.name));
  });
}

function normalize(value: unknown): IPlan | null {
  const row = record(value);
  const slug = text(row?.slug);
  if (!row || !slug) return null;
  const price = record(row.price) ?? {};
  const offers = strings(row.offers);
  const highlights = strings(row.highlights);
  return {
    id: text(row.id),
    name: text(row.name) || slug,
    description: text(row.description) || text(row.tagline),
    preceding_plan_name: null,
    features: features(row.features),
    price: {
      id: text(price.id),
      plan_id: text(row.id),
      currency_code: text(price.currency_code) || text(price.currency),
      amount: scalar(price.amount) || "0",
      billing_cycle: cycle(price),
      slug: text(price.slug),
      plan_slug: slug,
      created_at: "",
      updated_at: "",
      deleted_at: null,
      display: text(price.display),
    } as CatalogPrice,
    offers: offers.length ? offers : highlights,
    slug,
    status: text(row.status),
  };
}

function planRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  const root = record(payload);
  if (!root) return [];
  if (Array.isArray(root.plans)) return root.plans;
  if (Array.isArray(root.data)) return root.data;
  const nested = record(root.data);
  if (nested && Array.isArray(nested.plans)) return nested.plans;
  return [];
}

export function catalogPlans(payload: unknown): IPlan[] {
  return planRows(payload).flatMap((row) => {
    const plan = normalize(row);
    return plan ? [plan] : [];
  });
}

export type CatalogCellKind = "included" | "excluded" | "addon" | "value";

export interface CatalogFeatureCell {
  plan: string;
  kind: CatalogCellKind;
  label: string | null;
}

export interface CatalogFeature {
  code: string;
  name: string;
  cells: CatalogFeatureCell[];
}

export interface CatalogGroup {
  key: string;
  name: string;
  features: CatalogFeature[];
}

const CELL_KINDS = new Set<CatalogCellKind>([
  "included",
  "excluded",
  "addon",
  "value",
]);

function parseCell(value: unknown): CatalogFeatureCell | null {
  const row = record(value);
  const kind = text(row?.kind);
  if (!row || !CELL_KINDS.has(kind as CatalogCellKind)) return null;
  return {
    plan: text(row.plan),
    kind: kind as CatalogCellKind,
    label: row.label == null ? null : text(row.label) || null,
  };
}

function groupRows(payload: unknown): unknown[] {
  const root = record(payload);
  if (!root) return [];
  if (Array.isArray(root.groups)) return root.groups;
  const nested = record(root.data);
  if (nested && Array.isArray(nested.groups)) return nested.groups;
  return [];
}

export function catalogGroups(payload: unknown): CatalogGroup[] {
  return groupRows(payload).flatMap((value) => {
    const row = record(value);
    if (!row) return [];
    const features = Array.isArray(row.features) ? row.features : [];
    return [
      {
        key: text(row.key) || text(row.name),
        name: text(row.name),
        features: features.flatMap((feature) => {
          const item = record(feature);
          if (!item || !text(item.name)) return [];
          const cells = Array.isArray(item.cells) ? item.cells : [];
          return [
            {
              code: text(item.code) || text(item.name),
              name: text(item.name),
              cells: cells.flatMap((cell) => {
                const parsed = parseCell(cell);
                return parsed ? [parsed] : [];
              }),
            },
          ];
        }),
      },
    ];
  });
}
