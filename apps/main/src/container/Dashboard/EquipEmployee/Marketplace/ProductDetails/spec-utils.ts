import { ISpec } from "@/types/assets";

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

const toSpecificationRows = (specs: ISpec[] = []): SpecificationRow[] => {
  return specs.map((item) => ({
    label: normalizeLabel(item.name),
    value: normalizeValue(item.value),
  }));
};

const getSpecPreview = (specs: ISpec[] = [], maxItems = 3) => {
  return specs
    .slice(0, maxItems)
    .map((item) => normalizeValue(item.value))
    .join(" · ");
};

export { getSpecPreview, toSpecificationRows };
