import type {
  EntityPersonListInput,
  EntityPersonRef,
} from "./entityDetailTypes";

export function normalizeEntityPersonList(
  value: EntityPersonListInput,
): EntityPersonRef[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.data)) return value.data;
  return [];
}

export function mapEntityPersonLabel(
  person: EntityPersonRef | null | undefined,
) {
  if (!person) return "";
  const fullName = [person.first_name, person.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || person.email?.trim() || "";
}

export function mapEntityAdminLabels(admins: EntityPersonListInput) {
  const list = normalizeEntityPersonList(admins);
  if (!list.length) return [];
  return list.map(mapEntityPersonLabel).filter(Boolean);
}

export function mapEntityAdminUserIds(admins: EntityPersonListInput) {
  const list = normalizeEntityPersonList(admins);
  if (!list.length) return [];
  return list.map((admin) => admin.id).filter(Boolean);
}

export interface EntityAdminRow {
  id: string;
  name: string;
  email: string;
}

export function mapEntityAdminRows(
  admins: EntityPersonListInput,
): EntityAdminRow[] {
  return normalizeEntityPersonList(admins)
    .filter((admin) => admin.id)
    .map((admin) => ({
      id: admin.id,
      name: mapEntityPersonLabel(admin) || "Admin",
      email: admin.email?.trim() || "",
    }));
}
