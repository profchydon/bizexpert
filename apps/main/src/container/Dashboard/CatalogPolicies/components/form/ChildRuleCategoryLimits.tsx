"use client";

import { useGetAssetCategoriesQuery } from "@/api/baseQueries/assetsApi/getAssetCategories";

import type { SelectionLimit } from "../../types";
import {
  getSelectionLimitProductCountFallbacks,
  resolveSelectionLimitCategories,
  selectionLimitKey,
} from "../../selectionLimitAdapters";
import { normalizeSelectionLimitRange } from "../wizard/selectionLimitInputUtils";
import { SelectionLimitRow } from "../wizard/SelectionLimitsDrawerRows";

export function ChildRuleCategoryLimits({
  limits,
  errors,
  onChange,
}: {
  limits: SelectionLimit[];
  errors?: Map<string, string>;
  onChange: (limits: SelectionLimit[]) => void;
}) {
  const assetCategoriesQuery = useGetAssetCategoriesQuery();
  const resolvedLimits = resolveSelectionLimitCategories({
    categories: assetCategoriesQuery.data?.data ?? [],
    limits,
  });
  const productCounts = getSelectionLimitProductCountFallbacks(resolvedLimits);

  function updateLimit(
    category: string,
    updates: Partial<Pick<SelectionLimit, "min" | "max">>,
  ) {
    const nextLimits = limits.map((limit) =>
      selectionLimitKey(limit) === category
        ? normalizeSelectionLimitRange({ ...limit, ...updates })
        : limit,
    );
    onChange(nextLimits);
  }

  if (resolvedLimits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center">
        <p className="text-sm font-normal text-gray-500">
          No category limits are available on the parent policy.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col divide-y divide-gray-200">
        {resolvedLimits.map((limit) => {
          const key = selectionLimitKey(limit);
          return (
            <SelectionLimitRow
              key={key}
              limit={limit}
              productCount={productCounts.get(key) ?? 0}
              error={errors?.get(key)}
              onUpdate={updateLimit}
            />
          );
        })}
      </div>
    </div>
  );
}
