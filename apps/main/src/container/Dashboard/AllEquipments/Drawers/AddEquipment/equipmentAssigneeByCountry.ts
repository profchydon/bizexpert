import type { ICountry } from "@/types/auth";
import type { IEmployees } from "@/types/employees";
import { filterEmployeesByCountry } from "@/container/Dashboard/Accounts/utils/filterEmployeesByCountry";

export function findEquipmentCountryRecord(
  countries: ICountry[] | undefined,
  countryName: string | null | undefined,
) {
  const name = countryName?.trim();
  if (!name) return undefined;
  return countries?.find((country) => country.name === name);
}

export function equipmentAssigneeEmployeeParams(
  country?: Pick<ICountry, "id" | "code"> | null,
) {
  return {
    paginate: false as const,
    ...(country?.id ? { country_id: country.id } : {}),
    ...(country?.code ? { country_code: country.code } : {}),
  };
}

export function employeesForSelectedCountry(
  employees: IEmployees[] | undefined,
  countryName: string | null | undefined,
) {
  return filterEmployeesByCountry(employees ?? [], countryName);
}

export function employeeRowsFromListResponse(data: unknown): IEmployees[] {
  if (!data || typeof data !== "object") return [];
  const payload = (data as { data?: unknown }).data;
  if (Array.isArray(payload)) return payload as IEmployees[];
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: IEmployees[] }).data;
  }
  return [];
}

export function shouldClearAssignee(
  assignee: string,
  optionValues: string[],
  isEmployeesReady: boolean,
) {
  if (!isEmployeesReady || !assignee) return false;
  return !optionValues.includes(assignee);
}
