import type { OfficeScopedEquipment } from "./mapOfficeMembers";

export function equipmentOwnerCompanyId(
  row: OfficeScopedEquipment,
): string | undefined {
  const raw = row as OfficeScopedEquipment & {
    company_id?: string;
    companyId?: string;
  };
  return raw.company_id ?? raw.companyId;
}

export function isOfficeAddableAsset(
  row: OfficeScopedEquipment,
  officeId: string,
  officeEntityId: string,
  accountCompanyId?: string,
): boolean {
  if (row.assignee) return false;
  if (row.office_id === officeId) return false;
  const ownerId = equipmentOwnerCompanyId(row);
  if (!ownerId) return true;
  if (ownerId === officeEntityId) return true;
  if (accountCompanyId && ownerId === accountCompanyId) return true;
  return false;
}
