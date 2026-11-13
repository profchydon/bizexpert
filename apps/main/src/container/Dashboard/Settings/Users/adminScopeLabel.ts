import type { IEmployees } from "@/types/employees";

type OfficeNamed = { id?: string; name?: string } | null | undefined;

export function adminScopeLabel(admin: IEmployees): string {
  const office =
    admin.office ||
    (admin.user_company as { office?: OfficeNamed } | undefined)?.office;
  if (office?.name) return office.name;
  const role = admin.roles?.[0]?.name || "";
  if (role.toLowerCase().includes("office")) return "Office";
  return "Company-wide";
}
