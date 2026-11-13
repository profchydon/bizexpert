import { AssignmentState, EmployeeOption } from "./types";
import { getCartCountry } from "./cartCountry";

export interface CrossBorderPair {
  unitId: string;
  deviceName: string;
  deviceCountry: string;
  employeeName: string;
  employeeCountry: string;
}

const getEmployeeCountry = (employeeId: string, employees: EmployeeOption[]) =>
  employees.find((employee) => employee.id === employeeId)?.countryName ||
  employees.find((employee) => employee.id === employeeId)?.raw.country ||
  "";

const isUnitCrossBorder = (
  employeeId: string,
  cartCountryLabel: string,
  employees: EmployeeOption[],
) => {
  const employeeCountry = getEmployeeCountry(employeeId, employees);
  if (!employeeCountry) {
    return false;
  }

  return employeeCountry !== cartCountryLabel;
};

const getCrossBorderPairs = (
  state: AssignmentState,
  employees: EmployeeOption[],
): CrossBorderPair[] => {
  return state.assignments.flatMap((assignment) => {
    if (assignment.destination.type !== "employee") {
      return [];
    }

    const deviceCountry = getCartCountry(assignment.cartItem).label;
    if (
      !isUnitCrossBorder(
        assignment.destination.employeeId,
        deviceCountry,
        employees,
      )
    ) {
      return [];
    }

    return [
      {
        unitId: assignment.unitId,
        deviceName: assignment.cartItem.asset?.name || "Device",
        deviceCountry,
        employeeName: assignment.destination.employeeName,
        employeeCountry:
          getEmployeeCountry(assignment.destination.employeeId, employees) ||
          "Unknown",
      },
    ];
  });
};

export { getCrossBorderPairs, isUnitCrossBorder };
