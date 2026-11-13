import type { SelectItemType } from "@/components/base/select/select";
import type { Office } from "@/container/Dashboard/Accounts/types";
import { getInitials } from "@/utils/getInitials";
import type { AssignmentDestination, EmployeeOption } from "./types";
import { isEmployeeInCountry } from "./utils";

export const EMP = "emp:";
export const OFF = "office:";
export const STORAGE_OPTION = "storage";
export const ADD_EMPLOYEE_OPTION = "add-employee";

export function optionKeyFor(
  destination: AssignmentDestination | null | undefined,
): string | null {
  if (!destination) return null;
  if (destination.type === "employee") return EMP + destination.employeeId;
  if (destination.type === "office") return OFF + destination.officeId;
  if (destination.type === "storage") return STORAGE_OPTION;
  return null;
}

export function uniformDestination(
  assignments: { destination: AssignmentDestination }[],
): AssignmentDestination | null {
  if (assignments.length === 0) return null;
  const first = optionKeyFor(assignments[0].destination);
  if (!first) return null;
  return assignments.every(
    (assignment) => optionKeyFor(assignment.destination) === first,
  )
    ? assignments[0].destination
    : null;
}

export function officesInCountry(
  offices: Office[],
  countryLabel?: string,
  countryCode?: string,
): Office[] {
  const targets = [countryLabel, countryCode]
    .map((value) => (value || "").trim().toLowerCase())
    .filter(Boolean);
  if (targets.length === 0) return offices;
  return offices.filter((office) => {
    const region = (office.region || "").trim().toLowerCase();
    return targets.some((target) => region === target);
  });
}

export function destinationForOption(
  key: string,
  employees: EmployeeOption[],
  offices: Office[],
  contacts: Record<
    string,
    { contactEmployeeId: string; contactEmployeeName: string }
  >,
): AssignmentDestination | null {
  if (key === STORAGE_OPTION) return { type: "storage" };
  if (key.startsWith(EMP)) {
    const employee = employees.find(
      (item) => item.id === key.slice(EMP.length),
    );
    return employee
      ? {
          type: "employee",
          employeeId: employee.id,
          employeeName: employee.name,
        }
      : null;
  }
  if (key.startsWith(OFF)) {
    const office = offices.find((item) => item.id === key.slice(OFF.length));
    if (!office) return null;
    const contact = contacts[office.id];
    return {
      type: "office",
      officeId: office.id,
      officeName: office.name,
      contactEmployeeId: contact?.contactEmployeeId ?? "",
      contactEmployeeName: contact?.contactEmployeeName ?? "",
    };
  }
  return null;
}

export interface DestinationOptions {
  people: SelectItemType[];
  offices: SelectItemType[];
  storage: SelectItemType;
}

export function buildDestinationOptions(
  employees: EmployeeOption[],
  offices: Office[],
  countryLabel?: string,
  countryCode?: string,
): DestinationOptions {
  return {
    people: peopleInCountry(employees, countryLabel, countryCode).map(
      (employee) => ({
        id: EMP + employee.id,
        label: employee.name,
        initials: getInitials(employee.name || "") || undefined,
        supportingText: employee.raw?.job_title || undefined,
      }),
    ),
    offices: officesInCountry(offices, countryLabel, countryCode).map(
      (office) => ({ id: OFF + office.id, label: office.name }),
    ),
    storage: { id: STORAGE_OPTION, label: "Rayda storage" },
  };
}

export function peopleInCountry(
  employees: EmployeeOption[],
  countryLabel?: string,
  countryCode?: string,
): EmployeeOption[] {
  return employees.filter((employee) =>
    isEmployeeInCountry(employee, countryLabel, countryCode),
  );
}
