import type { ActingAdmin, Office, Subsidiary } from "../types";

export function canManageEntity(
  entity: Subsidiary,
  acting: ActingAdmin,
): boolean {
  if (acting.role === "global") return true;
  if (acting.role !== "subsidiary") return false;
  return acting.administeredEntityIds.includes(entity.id);
}

export function canManageOffice(office: Office, acting: ActingAdmin): boolean {
  if (acting.role === "global") return true;
  if (acting.role !== "office") return false;
  return acting.officeIds.includes(office.id);
}

export function canCreateEntities(acting: ActingAdmin): boolean {
  return acting.role === "global";
}

export function canCreateOffices(acting: ActingAdmin): boolean {
  return acting.role === "global" || acting.role === "subsidiary";
}
