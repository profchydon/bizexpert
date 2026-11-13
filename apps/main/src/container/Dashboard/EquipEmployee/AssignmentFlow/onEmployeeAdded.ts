import { IEmployees } from "@/types/employees";
import { Dispatch } from "react";
import { AssignmentAction } from "./types";

export type AddEmployeeTarget =
  | { kind: "row"; unitId: string; countryLabel: string }
  | { kind: "batch"; countryLabel: string };

const assignNewEmployee = (
  employee: IEmployees,
  target: AddEmployeeTarget,
  assignmentDispatch: Dispatch<AssignmentAction>,
) => {
  const employeeId = String(employee.id);
  const employeeName =
    `${employee.first_name || ""} ${employee.last_name || ""}`.trim();

  if (target.kind === "row") {
    assignmentDispatch({
      type: "ASSIGN_EMPLOYEE",
      unitId: target.unitId,
      employeeId,
      employeeName,
    });
    return;
  }

  assignmentDispatch({
    type: "BATCH_ASSIGN_EMPLOYEE",
    employeeId,
    employeeName,
  });
};

export default assignNewEmployee;
