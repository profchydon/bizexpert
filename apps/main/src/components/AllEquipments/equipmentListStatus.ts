export const ARCHIVED_EQUIPMENT_LIST_STATUS = "archived";
export const UNASSIGNED_API_EQUIPMENT_STATUS = "unassigned";

export const toApiEquipmentStatus = (status: string): string =>
  status.toLowerCase() === UNASSIGNED_API_EQUIPMENT_STATUS
    ? UNASSIGNED_API_EQUIPMENT_STATUS
    : status;

export const resolveEquipmentListStatus = (
  archived?: boolean,
  filterStatus?: string | null,
): string | undefined | null => {
  if (archived) return ARCHIVED_EQUIPMENT_LIST_STATUS;
  if (!filterStatus) return undefined;
  return filterStatus.split(",").map(toApiEquipmentStatus).join(",");
};
