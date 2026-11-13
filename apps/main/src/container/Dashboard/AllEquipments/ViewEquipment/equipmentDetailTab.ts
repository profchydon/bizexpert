export const DEFAULT_EQUIPMENT_DETAIL_TAB = "overview";

const HIDDEN_EQUIPMENT_DETAIL_TABS = new Set(["telemetry"]);

export function isHiddenEquipmentDetailTab(value: string | null): boolean {
  return value !== null && HIDDEN_EQUIPMENT_DETAIL_TABS.has(value);
}

export function resolveEquipmentDetailTab(
  value: string | null,
  visibleTabIds: readonly string[],
): string {
  if (isHiddenEquipmentDetailTab(value)) {
    return DEFAULT_EQUIPMENT_DETAIL_TAB;
  }
  if (value && visibleTabIds.includes(value)) {
    return value;
  }
  return DEFAULT_EQUIPMENT_DETAIL_TAB;
}
