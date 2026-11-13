import type { OfficeScopedEquipment } from "../../utils/mapOfficeMembers";
import { deviceTypeIcon } from "./deviceTypeMeta";
import type { PickerOption } from "./OfficeMemberPicker";

export function toAssetPickerOption(row: OfficeScopedEquipment): PickerOption {
  const Icon = deviceTypeIcon(row.type);
  const location = row.office?.name ? `In ${row.office.name}` : "Unassigned";
  return {
    id: String(row.id ?? ""),
    label: row.title,
    supportingText: `${row.serial_number || "No serial"} · ${location}`,
    icon: <Icon className="size-4" aria-hidden />,
  };
}
