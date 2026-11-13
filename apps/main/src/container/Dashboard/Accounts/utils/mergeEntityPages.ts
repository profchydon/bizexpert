import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";

export function mergeEntityPages(
  existing: EntityApiRecord[],
  incoming: EntityApiRecord[],
  page: number,
): EntityApiRecord[] {
  if (page <= 1) return incoming;

  const ids = new Set(existing.map((entity) => String(entity.id)));
  return [
    ...existing,
    ...incoming.filter((entity) => !ids.has(String(entity.id))),
  ];
}
