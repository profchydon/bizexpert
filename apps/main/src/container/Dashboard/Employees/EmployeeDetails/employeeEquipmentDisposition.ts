import type { IEquipment } from "@/types/equipments";
import type { IEmployees } from "@/types/employees";
import { isAssignedDevice } from "../OffboardDevices/offboardPricing";

export const isDispositionEquipment = (equipment: IEquipment): boolean =>
  isAssignedDevice(equipment) && Boolean(equipment.id);

const formatEquipmentStatus = (status?: string) => {
  if (!status) return "its current status";
  return status.replace(/_/g, " ").toLowerCase();
};

export const getEquipmentSelectionDisabledReason = (
  equipment: IEquipment,
): string | undefined => {
  if (!equipment.id) {
    return "This equipment record is missing an identifier and cannot be selected.";
  }
  if (!isAssignedDevice(equipment)) {
    return `Only assigned equipment can be reassigned, stored, or disposed. This device is ${formatEquipmentStatus(equipment.status)}.`;
  }
  return undefined;
};

export const resolveDispositionDeviceIds = (
  employee: IEmployees | undefined,
  deviceIds: string[],
): string[] => {
  const equipment = employee?.equipment ?? [];
  const assignableIds = new Set(
    equipment
      .filter((item) => item?.id && isAssignedDevice(item))
      .map((item) => String(item.id)),
  );

  return deviceIds
    .map(String)
    .filter(
      (id, index, ids) => assignableIds.has(id) && ids.indexOf(id) === index,
    );
};
