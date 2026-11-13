import type { FilterAssetTypeOption } from "./types";

export const buildAssetTypeOptions = (
  rawAssetTypes: string[],
  assetTypeNames: Map<string, string>,
): FilterAssetTypeOption[] => {
  const valuesByLabel = new Map<string, string[]>();

  rawAssetTypes.forEach((rawValue) => {
    const value = (rawValue ?? "").trim();
    if (!value) return;

    const label = assetTypeNames.get(value)?.trim() || value;
    const values = valuesByLabel.get(label) ?? [];

    if (!values.includes(value)) {
      values.push(value);
    }

    valuesByLabel.set(label, values);
  });

  return Array.from(valuesByLabel.entries())
    .map(([label, values]) => ({ label, value: values.join(",") }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
