import type { IEmployees } from "@/types/employees";
import type { IEquipment } from "@/types/equipments";
import type { Subsidiary } from "../types";
import { resolveEntityOffice } from "./resolveEntityOffice";
import { resolveCountryText } from "@/utils/resolveCountryText";

export interface EntityFootprint {
  employees: number;
  assets: number;
}

export function employeeBelongsToEntity(
  employee: IEmployees,
  entityId: string,
  subsidiaries?: Subsidiary[],
): boolean {
  const country = resolveCountryText(employee.country);
  if (!country) return false;
  return (
    resolveEntityOffice(country, String(employee.id ?? ""), subsidiaries)
      .entityId === entityId
  );
}

export function equipmentBelongsToEntity(
  equipment: IEquipment,
  entityId: string,
  subsidiaries?: Subsidiary[],
): boolean {
  const country = equipment.country?.trim();
  if (!country) return false;
  return (
    resolveEntityOffice(country, String(equipment.id ?? ""), subsidiaries)
      .entityId === entityId
  );
}

export function isActiveVaultEquipment(equipment: IEquipment): boolean {
  return equipment.status?.toLowerCase() !== "archived";
}

export function computeEntityFootprint(
  entityId: string,
  employees: IEmployees[],
  equipments: IEquipment[],
  subsidiaries?: Subsidiary[],
): EntityFootprint {
  return {
    employees: employees.filter((employee) =>
      employeeBelongsToEntity(employee, entityId, subsidiaries),
    ).length,
    assets: equipments
      .filter(isActiveVaultEquipment)
      .filter((equipment) =>
        equipmentBelongsToEntity(equipment, entityId, subsidiaries),
      ).length,
  };
}
