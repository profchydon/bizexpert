import type { IEmployees } from "@/types/employees";

export type EmployeeOption = {
  value: string;
  label: string;
};

export function employeesToOptions(
  employees: Partial<IEmployees>[] = [],
  excludeEmployeeId?: string,
): EmployeeOption[] {
  return employees.flatMap((employee) => {
    const id = stringValue(employee.id);
    if (!id || id === excludeEmployeeId) return [];
    return [{ value: id, label: employeeOptionLabel(employee) }];
  });
}

export function employeeOptionLabel(employee: Partial<IEmployees>) {
  const name = [employee.first_name, employee.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return (
    name || employee.email || stringValue(employee.id) || "Unnamed employee"
  );
}

function stringValue(value: unknown) {
  if (typeof value === "number") return String(value);
  return typeof value === "string" && value.trim() ? value : undefined;
}
