import type { z } from "zod";
import type { IEmployees } from "@/types/employees";
import type { addEmployeeSchema } from "../../EquipEmployee/Employee/AddEmployees/AddEmployee/validation";

export type EditEmployeeFormValues = z.infer<typeof addEmployeeSchema>;

export function employeeLineManagerLabel(
  manager?: Partial<IEmployees> | null,
): string | undefined {
  if (!manager) return undefined;
  return (
    [manager.first_name, manager.last_name].filter(Boolean).join(" ") ||
    manager.email ||
    undefined
  );
}

export function buildEditEmployeeFormData(
  employee?: IEmployees,
  countryLabel?: string,
): EditEmployeeFormValues {
  return {
    first_name: employee?.first_name ?? "",
    last_name: employee?.last_name ?? "",
    email: employee?.email ?? "",
    personal_email: employee?.personal_email ?? "",
    phone: employee?.phone ?? "",
    job_title: employee?.job_title ?? "",
    manager_id:
      employee?.line_manager?.id ??
      employee?.manager?.id ??
      employee?.manager_id ??
      "",
    employment_type: employee?.employment_type ?? "",
    level: employee?.level_position?.id ?? employee?.level ?? "",
    department_id:
      employee?.departments?.[0]?.id ?? employee?.department_id ?? "",
    country_id: countryLabel ?? employee?.country ?? "",
    address: employee?.address ?? "",
    landmark: employee?.landmark ?? "",
    tax_number: employee?.tax_number ?? "",
  };
}
