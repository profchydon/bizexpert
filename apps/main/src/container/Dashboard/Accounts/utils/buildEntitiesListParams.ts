import type { EntitiesListParams } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import type { SubsidiaryStatus } from "../types";
import { mapSubsidiaryStatusesToApiBadges } from "./subsidiaryStatus";

export function buildEntitiesListParams(input: {
  page?: number;
  perPage?: number;
  search?: string;
  statuses?: SubsidiaryStatus[];
}): EntitiesListParams {
  const trimmedSearch = input.search?.trim();
  const badges = mapSubsidiaryStatusesToApiBadges(input.statuses ?? []);

  return {
    page: input.page,
    per_page: input.perPage,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    ...(badges.length > 0 ? { status: badges.join(",") } : {}),
  };
}
