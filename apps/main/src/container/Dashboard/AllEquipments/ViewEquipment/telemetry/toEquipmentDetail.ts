import type { IEquipment } from "@/types/equipments";
import type { TelemetryDevice } from "@/types/telemetry";
import type { AssignedContact } from "./assignedContact";
import type { EquipmentDetail } from "./equipmentHost";
import { resolveOwnership } from "./ownership";
import type { Ownership } from "./types";

export function assigneeName(equipment: IEquipment | undefined): string {
  const assignee = equipment?.assignee;
  if (!assignee) return "";
  if (typeof assignee === "string") return assignee;
  return assignee.name ?? "";
}

export function toEquipmentDetail(
  equipment: IEquipment,
  device?: TelemetryDevice,
): EquipmentDetail {
  const contact = toAssignedContact(equipment, device);
  const ownership =
    (device?.telemetry_ownership as Ownership | undefined) ??
    resolveOwnership({
      ownership: equipment.telemetry_ownership,
      source: equipment.source,
    });

  return {
    id: equipment.id ?? device?.equipment_id ?? "",
    name: equipment.title || device?.title || "",
    serial: equipment.serial_number || device?.serial_number || "",
    type: equipment.type || device?.type || "",
    assignee: contact?.name || assigneeName(equipment),
    officeId: equipment.office?.id ?? device?.office_id ?? undefined,
    source: equipment.source,
    ownership,
    contact,
  };
}

function toAssignedContact(
  equipment: IEquipment,
  device?: TelemetryDevice,
): AssignedContact | null {
  if (device?.assignee_contact?.email || device?.assignee_contact?.name) {
    return {
      name: device.assignee_contact.name,
      email: device.assignee_contact.email,
      initials: device.assignee_contact.initials,
    };
  }

  const assignee = equipment.assignee;
  if (!assignee || typeof assignee === "string") return null;
  if (!assignee.name && !assignee.email) return null;

  const name = assignee.name || assignee.email || "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    name,
    email: assignee.email ?? "",
    initials,
  };
}
