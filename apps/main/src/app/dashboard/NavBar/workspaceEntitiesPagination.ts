import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { ENTITIES_PAGE_SIZE } from "@/container/Dashboard/Accounts/constants/entitiesPagination";

export const WORKSPACE_ENTITIES_PAGE_SIZE = ENTITIES_PAGE_SIZE;

export function mergeWorkspaceEntityPages(
  previous: EntityApiRecord[],
  incoming: EntityApiRecord[],
  currentPage: number,
): EntityApiRecord[] {
  if (currentPage <= 1) return incoming;

  const seen = new Set(previous.map((entity) => entity.id));
  const appended = incoming.filter((entity) => !seen.has(entity.id));
  return [...previous, ...appended];
}

export function hasMoreWorkspaceEntityPages(
  currentPage?: number,
  lastPage?: number,
  loadedCount?: number,
  total?: number,
): boolean {
  const page = Number(currentPage) || 0;
  const last = Number(lastPage) || 0;

  if (page > 0 && last > 0 && page < last) return true;
  if (
    total != null &&
    loadedCount != null &&
    total > 0 &&
    loadedCount < total
  ) {
    return true;
  }

  return false;
}
