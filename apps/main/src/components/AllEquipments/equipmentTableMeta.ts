export type EquipmentSortKey =
  | "title"
  | "assignee"
  | "serial_number"
  | "spec"
  | "country"
  | "status"
  | "refresh_details";

export const EQUIPMENT_TABLE_COLUMNS: {
  key: EquipmentSortKey;
  label: string;
}[] = [
  { key: "title", label: "Equipment name" },
  { key: "assignee", label: "Assigned to" },
  { key: "serial_number", label: "Serial number" },
  { key: "spec", label: "RAM/Storage" },
  { key: "country", label: "Location" },
  { key: "status", label: "Status" },
  { key: "refresh_details", label: "Warranty" },
];
