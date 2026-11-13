import {
  GRADE_LABELS,
  SOURCE_LABEL,
  STATUS_LABEL,
  WIPE_LABEL,
} from "../data/storageMeta";
import type { Grade, InventoryFilters, WipeStatus } from "../types/storage";

export type FilterKey =
  | "status"
  | "countryId"
  | "source"
  | "grade"
  | "deviceType"
  | "wipe";

const FILTER_KEYS: FilterKey[] = [
  "status",
  "countryId",
  "source",
  "grade",
  "deviceType",
  "wipe",
];

export function activeFilterCount(filters: InventoryFilters): number {
  return FILTER_KEYS.filter((k) => filters[k] !== "all").length;
}

export interface FilterChip {
  key: string;
  label: string;
  clear: Partial<InventoryFilters>;
}

export function activeFilterChips(filters: InventoryFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (filters.deviceType !== "all")
    chips.push({
      key: "deviceType",
      label: filters.deviceType,
      clear: { deviceType: "all" },
    });
  if (filters.status !== "all")
    chips.push({
      key: "status",
      label: STATUS_LABEL[filters.status],
      clear: { status: "all" },
    });
  if (filters.countryId !== "all")
    chips.push({
      key: "country",
      label: filters.country,
      clear: { country: "all", countryId: "all" },
    });
  if (filters.source !== "all")
    chips.push({
      key: "source",
      label: SOURCE_LABEL[filters.source],
      clear: { source: "all" },
    });
  if (filters.grade !== "all")
    chips.push({
      key: "grade",
      label: `Grade ${filters.grade} · ${GRADE_LABELS[filters.grade as Grade]}`,
      clear: { grade: "all" },
    });
  if (filters.wipe !== "all")
    chips.push({
      key: "wipe",
      label: `Wipe · ${WIPE_LABEL[filters.wipe as WipeStatus]}`,
      clear: { wipe: "all" },
    });
  if (filters.needsAction)
    chips.push({
      key: "needsAction",
      label: "Needs action · 180+ days, no check",
      clear: { needsAction: false },
    });
  return chips;
}
