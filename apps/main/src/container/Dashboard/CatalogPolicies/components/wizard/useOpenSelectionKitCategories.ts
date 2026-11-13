"use client";

import { useMemo } from "react";

import { useGetKitCategoriesQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKitCategories";

import type { CatalogRule } from "../../types";
import { uniqueKitCategoryIds } from "./useOpenSelectionKitCategories.utils";

export function useOpenSelectionKitCategories({
  companyId,
  draft,
  enabled,
}: {
  companyId?: string;
  draft: CatalogRule;
  enabled: boolean;
}) {
  const kitIds = useMemo(() => [...draft.kitIds].sort(), [draft.kitIds]);
  const shouldFetch =
    enabled &&
    draft.selectionMode === "OPEN" &&
    kitIds.length > 0 &&
    Boolean(companyId);
  const query = useGetKitCategoriesQuery(
    { companyId: companyId!, kitIds },
    { skip: !shouldFetch },
  );

  return {
    categoryIds: useMemo(
      () => uniqueKitCategoryIds(query.data?.data),
      [query.data?.data],
    ),
    isLoading: shouldFetch && (query.isLoading || query.isFetching),
    async refetchCategoryIds() {
      if (!shouldFetch) return [];
      const response = await query.refetch();
      return uniqueKitCategoryIds(response.data?.data);
    },
  };
}
