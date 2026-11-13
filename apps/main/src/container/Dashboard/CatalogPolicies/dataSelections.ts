import {
  airpods,
  chargerAnker,
  headphonesSony,
  laptopLenovo,
  laptopMacbook,
  monitorDell,
  monitorLg,
  monitorSamsung,
  mouseLogitech,
  totalOf,
} from "./dataKits";
import { mockEmployees } from "./dataEmployees";
import type {
  EmployeeSelection,
  KitItem,
  MockEmployee,
  SelectionStatus,
} from "./types";

function makeSelection(
  id: string,
  ruleId: string,
  employee: MockEmployee,
  items: KitItem[],
  status: SelectionStatus,
  submittedAt: string,
  reviewedAt: string | null = null,
  changeRequestNotes: string | null = null,
): EmployeeSelection {
  return {
    id,
    ruleId,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeRole: employee.role,
    employeeLevel: employee.level,
    employeeCountry: employee.country,
    employeeCountryCode: employee.countryCode,
    items,
    totalCost: totalOf(items),
    status,
    submittedAt,
    reviewedAt,
    changeRequestNotes,
  };
}

let employeeSelections: EmployeeSelection[] = [
  makeSelection(
    "sel-1",
    "rule-5",
    mockEmployees[21],
    [laptopLenovo, monitorLg, mouseLogitech, airpods],
    "PENDING",
    "2026-04-21T09:14:00Z",
  ),
  makeSelection(
    "sel-2",
    "rule-5",
    mockEmployees[18],
    [laptopMacbook, monitorDell, headphonesSony, chargerAnker],
    "PENDING",
    "2026-04-22T11:02:00Z",
  ),
  makeSelection(
    "sel-3",
    "rule-5",
    mockEmployees[12],
    [laptopMacbook, mouseLogitech, airpods],
    "CHANGES_REQUESTED",
    "2026-04-19T13:20:00Z",
    "2026-04-20T10:11:00Z",
    "Please review your accessory selection.",
  ),
  makeSelection(
    "sel-4",
    "rule-5",
    mockEmployees[19],
    [laptopLenovo, monitorSamsung, airpods],
    "APPROVED",
    "2026-04-18T09:45:00Z",
    "2026-04-18T12:30:00Z",
  ),
  makeSelection(
    "sel-5",
    "rule-6",
    mockEmployees[12],
    [laptopMacbook, monitorLg, headphonesSony],
    "APPROVED",
    "2026-04-17T12:00:00Z",
    "2026-04-17T16:20:00Z",
  ),
  makeSelection(
    "sel-6",
    "rule-7",
    mockEmployees[14],
    [laptopLenovo, monitorSamsung, airpods],
    "CHANGES_REQUESTED",
    "2026-04-19T13:20:00Z",
    "2026-04-20T10:11:00Z",
    "Please pick the LG monitor instead.",
  ),
];

export function getSelectionsForRule(ruleId: string) {
  return employeeSelections.filter((selection) => selection.ruleId === ruleId);
}

export function approveSelection(id: string) {
  employeeSelections = employeeSelections.map((selection) =>
    selection.id === id
      ? {
          ...selection,
          status: "APPROVED",
          reviewedAt: new Date().toISOString(),
          changeRequestNotes: null,
        }
      : selection,
  );
}

export function approveSelections(ids: string[]) {
  const now = new Date().toISOString();
  employeeSelections = employeeSelections.map((selection) =>
    ids.includes(selection.id)
      ? {
          ...selection,
          status: "APPROVED",
          reviewedAt: now,
          changeRequestNotes: null,
        }
      : selection,
  );
}

export function requestSelectionChanges(id: string, notes: string) {
  employeeSelections = employeeSelections.map((selection) =>
    selection.id === id
      ? {
          ...selection,
          status: "CHANGES_REQUESTED",
          reviewedAt: new Date().toISOString(),
          changeRequestNotes: notes,
        }
      : selection,
  );
}
