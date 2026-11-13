import { IEquipment } from "@/types/equipments";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

const unassignedAssignee = {
  id: UNASSIGNED_ORDER_SUMMARY_KEY,
  name: UNASSIGNED_ORDER_SUMMARY_KEY,
};

export const mapEquipmentListRows = (
  rows: IEquipment[] | undefined,
): IEquipment[] => {
  if (!rows) return [];

  return rows.map((item) => ({
    ...item,
    assignee: item.assignee ?? unassignedAssignee,
  }));
};
