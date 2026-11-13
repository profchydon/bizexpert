import type {
  OfficePersonRef,
  ServerOffice,
  ServerOfficeDetail,
} from "@/types/offices";
import type { Office, OfficeAdminRef } from "../../types";

const DAY_MS = 86_400_000;

export type MaybePersonList =
  | OfficePersonRef[]
  | { data?: OfficePersonRef[] | null }
  | null
  | undefined;

export function toPersonList(value: MaybePersonList): OfficePersonRef[] {
  if (Array.isArray(value)) return value;
  const nested = (value as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(nested) ? (nested as OfficePersonRef[]) : [];
}

export function personDisplayName(person: OfficePersonRef | null | undefined) {
  if (!person) return "";
  if (person.name) return person.name;
  const full = [person.first_name, person.last_name].filter(Boolean).join(" ");
  return full || person.email || "";
}

export function coerceOfficePersonRefs(value: unknown): OfficePersonRef[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if ("data" in value) return toPersonList(value as MaybePersonList);
  return [value as OfficePersonRef];
}

export function officeStatusFromServer(status: string): Office["status"] {
  const normalized = (status ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "closed") return "closed";
  if (normalized === "shutting_down") return "shutting_down";
  return "active";
}

export function createdDaysAgo(
  createdAt: string | undefined,
  now = Date.now(),
): number | undefined {
  if (!createdAt) return undefined;
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return undefined;
  return Math.max(0, Math.floor((now - created) / DAY_MS));
}

export function toOfficeAdminRefs(admins: unknown): OfficeAdminRef[] {
  return coerceOfficePersonRefs(admins)
    .map((person) => ({
      id: person.id ? String(person.id) : undefined,
      name: personDisplayName(person),
    }))
    .filter((admin) => Boolean(admin.name));
}

export function toUiOffice(
  row: ServerOffice,
  admins: OfficePersonRef[] | unknown = [],
): Office {
  const adminRefs = toOfficeAdminRefs(admins);

  return {
    id: row.id,
    name: row.name,
    subsidiaryId: row.entity?.id ?? row.company_id,
    subsidiaryName: row.entity?.name ?? "",
    region: row.country ?? row.entity?.country ?? "",
    type: row.type === "remote" ? "Remote" : "Physical",
    currency: row.currency_code ?? row.entity?.billing_currency ?? "",
    address: row.street_address ?? undefined,
    officeAdmins: adminRefs.map((admin) => admin.name),
    officeAdminRefs: adminRefs,
    status: officeStatusFromServer(row.status),
    isPrimary: row.is_primary,
    createdDaysAgo: createdDaysAgo(row.created_at),
    createdBy: personDisplayName(row.created_by) || undefined,
  };
}

export function toUiOfficeFromDetail(
  detail: ServerOfficeDetail & { admins?: unknown },
): Office {
  return toUiOffice(detail, detail.office_admins ?? detail.admins);
}
