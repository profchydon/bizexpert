import type { CatalogOption } from "./useCatalogPolicyOptions";

export function scopedOptions(options: CatalogOption[], selected: string[]) {
  if (!selected.length) return options;
  const selectedValues = new Set(selected);
  return options.filter(
    (option) =>
      selectedValues.has(option.value) || selectedValues.has(option.label),
  );
}
