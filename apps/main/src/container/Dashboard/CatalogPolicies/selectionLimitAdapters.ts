import type { IAssetCategory } from "@/types/assets";

import type { SelectionLimit } from "./types";

export function resolveSelectionLimitCategories({
  categories,
  limits,
}: {
  categories: IAssetCategory[];
  limits: SelectionLimit[];
}) {
  const names = new Map(
    categories.map((category) => [category.id, category.name]),
  );
  return limits.map((limit) => ({
    ...limit,
    category: limit.categoryId
      ? names.get(limit.categoryId) || limit.category
      : limit.category,
  }));
}

export function getSelectionLimitProductCountFallbacks(
  limits: SelectionLimit[],
) {
  return new Map(
    limits.map((limit) => [
      selectionLimitKey(limit),
      limit.max ?? Math.max(limit.min, 0),
    ]),
  );
}

export function selectionLimitKey(limit: SelectionLimit) {
  return limit.categoryId || limit.category;
}
