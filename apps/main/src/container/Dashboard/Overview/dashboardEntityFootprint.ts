import type {
  IDashboard,
  IDashboardEquipmentPanel,
  IDashboardOfficesPanel,
} from "@/types/dashboard";

export type EquipmentConditionSlice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

const CONDITION_SLICES: Array<{
  key: keyof IDashboardEquipmentPanel["condition"];
  label: string;
  color: string;
}> = [
  {
    key: "excellent",
    label: "Excellent",
    color: "var(--color-utility-success-500)",
  },
  {
    key: "good",
    label: "Good",
    color: "var(--color-utility-warning-400)",
  },
  {
    key: "fair",
    label: "Fair",
    color: "var(--color-utility-orange-500)",
  },
  {
    key: "poor",
    label: "Poor",
    color: "var(--color-utility-error-500)",
  },
];

export function dashboardEquipmentPanel(dashboard?: IDashboard | null) {
  return dashboard?.panels?.equipment ?? null;
}

export function dashboardOfficesPanel(dashboard?: IDashboard | null) {
  return dashboard?.panels?.offices ?? null;
}

export function isDashboardEquipmentVisible(dashboard?: IDashboard | null) {
  return dashboard?.access?.visibility?.equipment !== false;
}

export function isDashboardOfficesVisible(dashboard?: IDashboard | null) {
  return dashboard?.access?.visibility?.offices !== false;
}

export function equipmentConditionSlices(
  panel: IDashboardEquipmentPanel | null,
): EquipmentConditionSlice[] {
  return CONDITION_SLICES.map((slice) => ({
    key: slice.key,
    label: slice.label,
    value: Number(panel?.condition?.[slice.key]) || 0,
    color: slice.color,
  }));
}

export function equipmentMixFromPanel(panel: IDashboardEquipmentPanel | null) {
  return [...(panel?.mix_by_category ?? [])].sort(
    (left, right) => right.count - left.count,
  );
}

export function officesAreasFromPanel(panel: IDashboardOfficesPanel | null) {
  return [...(panel?.areas ?? [])].sort(
    (left, right) =>
      right.count - left.count || left.name.localeCompare(right.name),
  );
}
