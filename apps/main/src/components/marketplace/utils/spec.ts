import type { MarketplaceSpecEntry } from "../types";

export interface SpecificationRow {
  label: string;
  value: string;
}

const normalizeLabel = (label: string) =>
  label
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(
      (part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
    )
    .join(" ");

const normalizeValue = (value: string) => value?.trim() || "—";

export const toSpecificationRows = (
  specs: MarketplaceSpecEntry[] = [],
): SpecificationRow[] =>
  specs.map((item) => ({
    label: normalizeLabel(item.name),
    value: normalizeValue(item.value),
  }));

export const getSpecPreview = (
  specs: MarketplaceSpecEntry[] = [],
  maxItems = 3,
) =>
  specs
    .slice(0, maxItems)
    .map((item) => normalizeValue(item.value))
    .join(" · ");

const CONDITION_KEYS = new Set(["condition", "spec_condition"]);

export const resolveConditionLabel = (
  spec: MarketplaceSpecEntry[] = [],
  fallback = "Available",
) => {
  const normalizedMatch = spec.find((item) => {
    const normalizedName = item?.name
      ?.toLowerCase()
      .split(/\s+/)
      .join("_")
      .split("-")
      .join("_");

    return normalizedName ? CONDITION_KEYS.has(normalizedName) : false;
  })?.value;

  return normalizedMatch || fallback;
};

export const resolveConditionBadgeColor = (
  label: string,
): "blue" | "purple" | "gray" => {
  const normalized = label.toLowerCase();
  if (normalized.includes("brand new") || normalized === "new") {
    return "blue";
  }

  if (normalized.includes("refurb")) {
    return "purple";
  }

  return "gray";
};
