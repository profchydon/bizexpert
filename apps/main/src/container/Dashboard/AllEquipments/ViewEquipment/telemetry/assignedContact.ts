import type { EquipmentDetail } from "./equipmentHost";

export interface AssignedContact {
  name: string;
  email: string;
  initials: string;
}

export function resolveAssignedContact(
  row: Pick<EquipmentDetail, "assignee" | "officeId" | "contact">,
): AssignedContact | null {
  if (row.contact) return row.contact;
  if (!row.assignee || row.officeId) return null;
  return {
    name: row.assignee,
    email: "",
    initials: row.assignee
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}
