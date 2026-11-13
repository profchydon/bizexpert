import type { IEmployees } from "@/types/employees";
import { resolveCountryText } from "@/utils/resolveCountryText";
import type { IEquipment } from "@/types/equipments";
import type { OfficeAsset } from "../types/officeAsset";
import type { OfficeEmployee } from "../types/officeEmployee";

export type OfficeScopedEmployee = IEmployees & {
  office_id?: string | null;
  office?: { id: string; name: string } | null;
};

export type OfficeScopedEquipment = IEquipment & {
  office_id?: string | null;
  office?: { id: string; name: string } | null;
  office_area_id?: string | null;
  office_area?: { id: string; name: string } | null;
};

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function humanizeToken(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/_/g, " ").trim();
}

export function toOfficeEmployee(row: OfficeScopedEmployee): OfficeEmployee {
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ");
  return {
    id: String(row.id ?? ""),
    name,
    initials: initialsOf(name),
    role: row.job_title || "—",
    dept: row.departments?.[0]?.name || row.department?.name || "—",
    email: row.email ?? "",
    country: resolveCountryText(row.country) ?? "",
  };
}

export function toOfficeAsset(
  row: OfficeScopedEquipment,
  fallbackCurrency = "",
): OfficeAsset {
  const price = Number(row.purchase_price);
  const assigneeName = row.assignee?.name?.trim() ?? "";
  const officeAreaName = row.office_area?.name?.trim() ?? "";
  return {
    id: String(row.id ?? ""),
    name: row.title ?? "",
    deviceType: row.type || "Other",
    serial: row.serial_number || "—",
    condition: humanizeToken(row.state) || "—",
    assignedTo: assigneeName || officeAreaName || "No specific area",
    assigneeId: row.assignee?.id ? String(row.assignee.id) : "",
    assigneeName,
    officeAreaName,
    value: Number.isFinite(price) ? price : 0,
    currency: row.currency?.code ?? fallbackCurrency,
    awaitingPlacement:
      !assigneeName &&
      ["unassigned", "awaiting_assignment"].includes(
        (row.status || "").toLowerCase(),
      ),
  };
}
