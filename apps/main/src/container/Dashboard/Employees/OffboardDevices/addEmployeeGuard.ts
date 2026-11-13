import type { IEmployees } from "@/types/employees";
import { hasAssignedDevices } from "../EmployeesTable/employeeDevices";
import { resolveCountryText } from "@/utils/resolveCountryText";

export interface AddEmployeeGuardOptions {
  requireAssignedDevices?: boolean;
  requireCountry?: boolean;
}

export const addEmployeeDisabledReason = (
  employee: IEmployees,
  {
    requireAssignedDevices = false,
    requireCountry = false,
  }: AddEmployeeGuardOptions = {},
): string | undefined => {
  if (requireAssignedDevices && !hasAssignedDevices(employee))
    return "No assigned devices";
  if (requireCountry && !resolveCountryText(employee.country))
    return "No country assigned";
  return undefined;
};
