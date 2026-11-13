import type { IEmployees } from "@/types/employees";

type DuplicateEmployeeValue = string | null | undefined;

const duplicateEmployeeFields = [
  "first_name",
  "last_name",
  "email",
  "personal_email",
  "phone",
  "tax_number",
  "level",
  "department_id",
  "job_title",
  "manager_id",
  "employment_type",
  "country_id",
  "address",
  "landmark",
] as const;

export function duplicateEmployeeFormValues(employee?: IEmployees | null) {
  const manager = employee?.line_manager ?? employee?.manager;

  return {
    first_name: employee?.first_name,
    last_name: employee?.last_name,
    email: employee?.email,
    personal_email: employee?.personal_email,
    phone: employee?.phone,
    tax_number: employee?.tax_number,
    level: employee?.level_position?.id ?? employee?.level,
    department_id:
      employee?.department_id ??
      employee?.department?.id ??
      employee?.departments?.[0]?.id,
    job_title: employee?.job_title,
    manager_id: manager?.id,
    employment_type: employee?.employment_type,
    country_id: employee?.country ?? employee?.country_id,
    address: employee?.address,
    landmark: employee?.landmark,
  } satisfies Record<
    (typeof duplicateEmployeeFields)[number],
    DuplicateEmployeeValue
  >;
}

export function duplicateEmployeeSearch(employee?: IEmployees | null) {
  const values = duplicateEmployeeFormValues(employee);
  const manager = employee?.line_manager ?? employee?.manager;
  const managerName = employeeManagerName(manager);
  const levelName = employee?.level_position?.name ?? employee?.level;
  const params = new URLSearchParams();

  duplicateEmployeeFields.forEach((field) => {
    const value = values[field];
    if (value) params.set(field, String(value));
  });

  if (managerName) params.set("manager_name", managerName);
  if (levelName) params.set("level_name", levelName);

  return params.toString();
}

export function duplicatedEmployeeRedirectPath(
  employee?: Pick<IEmployees, "id"> | null,
) {
  return employee?.id ? `/dashboard/employees/${employee.id}` : null;
}

function employeeManagerName(manager?: Partial<IEmployees> | null) {
  if (!manager) return undefined;
  return (
    [manager.first_name, manager.last_name].filter(Boolean).join(" ") ||
    manager.email
  );
}
