import type { IEmployees } from "@/types/employees";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";

export function employeeMatchesCountry(
  employee: IEmployees,
  country: string | null | undefined,
) {
  if (!country?.trim()) return true;
  const target = country.trim().toLowerCase();
  const employeeCountry = resolveCountryText(employee.country)?.toLowerCase();
  const employeeCode = resolveCountryCode(
    employee.country_code,
    employee.country,
  )?.toLowerCase();
  return employeeCountry === target || employeeCode === target;
}

export function filterEmployeesByCountry(
  employees: IEmployees[],
  country: string | null | undefined,
) {
  if (!country?.trim()) return employees;
  return employees.filter((employee) =>
    employeeMatchesCountry(employee, country),
  );
}
