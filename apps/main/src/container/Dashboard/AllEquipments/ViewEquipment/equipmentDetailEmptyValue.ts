export const EQUIPMENT_DETAIL_EMPTY_VALUE = "—";

export const equipmentDetailMissingValue = (value?: string | null) =>
  value?.trim() ? value : EQUIPMENT_DETAIL_EMPTY_VALUE;
