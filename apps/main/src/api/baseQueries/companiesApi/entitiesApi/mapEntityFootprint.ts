import type { EntityDetailApiRecord } from "./entityDetailTypes";

export type EntityFootprintCounts = {
  employees: number;
  assets: number;
};

function toCount(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function mapEntityFootprint(
  entity: Pick<
    EntityDetailApiRecord,
    "employees_count" | "assets_count" | "footprint"
  >,
): EntityFootprintCounts {
  return {
    employees: toCount(entity.footprint?.employees ?? entity.employees_count),
    assets: toCount(entity.footprint?.assets ?? entity.assets_count),
  };
}
