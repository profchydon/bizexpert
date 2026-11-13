import type { IEmployees } from "@/types/employees";
import { resolveCountryText } from "@/utils/resolveCountryText";

export function filterEmployeesBySearch(
  employees: IEmployees[],
  searchValue: string | null,
): IEmployees[] {
  const query = searchValue?.trim().toLowerCase();
  if (!query) return employees;
  return employees.filter((employee) =>
    [
      employee.first_name,
      employee.last_name,
      employee.email,
      resolveCountryText(employee.country),
      employee.job_title,
    ].some((field) => field?.toLowerCase().includes(query)),
  );
}
