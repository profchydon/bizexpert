import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";

export function isSwitchableWorkspaceEntity(entity: EntityApiRecord): boolean {
  if (entity.lifecycle_status?.toLowerCase() === "closed") return false;
  if (entity.billing_status_badge === "closed") return false;
  return true;
}

export function filterSwitcherEntities(
  entities: EntityApiRecord[],
  options: { excludePrimary?: boolean } = {},
): EntityApiRecord[] {
  return entities
    .filter(isSwitchableWorkspaceEntity)
    .filter((entity) => !(options.excludePrimary && entity.is_primary))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function findPrimaryWorkspaceEntity(
  entities: EntityApiRecord[],
): EntityApiRecord | undefined {
  return entities.find((entity) => entity.is_primary);
}
