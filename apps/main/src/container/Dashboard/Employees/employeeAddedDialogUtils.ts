import type { IEmployees } from "@/types/employees";
import { withListLocation } from "@/utils/tableListPage";

export const employeeDetailPath = (employeeId: string, page = 1) =>
  withListLocation(`/dashboard/employees/${employeeId}`, { page });

export const employeeDisplayName = (employee?: IEmployees | null) => {
  const name = [employee?.first_name, employee?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || employee?.email || "employee";
};
