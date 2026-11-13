import type {
  DateWindow,
  DeviceLine,
  OffboardReviewEmployee,
} from "@/types/offboard";
import type { OffboardEmployeeBasic } from "./EmployeeSwitcherStrip";
import { calculateServiceFeesTotal } from "./offboardPricing";

export type { OffboardReviewEmployee } from "@/types/offboard";

export const buildOffboardReview = (
  employees: OffboardEmployeeBasic[],
  getWindow: (employeeId: string) => DateWindow | undefined,
  getSelectedLines: (employeeId: string) => DeviceLine[],
): OffboardReviewEmployee[] =>
  employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    country: employee.country,
    window: getWindow(employee.id),
    devices: getSelectedLines(employee.id),
  }));

export const employeeReviewTotal = (employee: OffboardReviewEmployee): number =>
  calculateServiceFeesTotal(employee.devices);

export const reviewGrandTotal = (employees: OffboardReviewEmployee[]): number =>
  employees.reduce(
    (total, employee) => total + employeeReviewTotal(employee),
    0,
  );
