import { ICart } from "@/types/cart";
import { IEmployees } from "@/types/employees";

export type ContactSource = "office-default" | "row";

export type AssignmentDestination =
  | { type: "employee"; employeeId: string; employeeName: string }
  | {
      type: "office";
      officeId: string;
      officeName: string;
      contactEmployeeId: string;
      contactEmployeeName: string;
    }
  | { type: "storage" }
  | { type: "unassigned" };

export interface OfficeTarget {
  officeId: string;
  officeName: string;
  contactEmployeeId: string;
  contactEmployeeName: string;
}

export interface AssignmentUnit {
  unitId: string;
  cartItem: ICart;
  destination: AssignmentDestination;
  contactSource?: ContactSource;
}

export interface AssignmentState {
  assignments: AssignmentUnit[];
  selectedIds: Set<string>;
  fulfilmentDatesByEmployee: Record<string, string>;
  deviceSetupsByUnit: Record<string, string>;
}

export type AssignmentAction =
  | { type: "RESET_FROM_CART"; items: ICart[] }
  | {
      type: "ASSIGN_EMPLOYEE";
      unitId: string;
      employeeId: string;
      employeeName: string;
    }
  | { type: "ASSIGN_STORAGE"; unitId: string }
  | { type: "TOGGLE_SELECT"; unitId: string }
  | { type: "SET_SELECTION"; unitIds: string[] }
  | { type: "CLEAR_SELECTION" }
  | { type: "BATCH_ASSIGN_EMPLOYEE"; employeeId: string; employeeName: string }
  | { type: "BATCH_ASSIGN_STORAGE" }
  | {
      type: "BATCH_ASSIGN_DESTINATION";
      destination: AssignmentDestination;
    }
  | {
      type: "ASSIGN_DESTINATION";
      unitId: string;
      destination: AssignmentDestination;
    }
  | {
      type: "SET_OFFICE_CONTACT";
      unitId: string;
      contactEmployeeId: string;
      contactEmployeeName: string;
      source: ContactSource;
    }
  | {
      type: "SET_OFFICE_DEFAULT_CONTACT";
      officeId: string;
      contactEmployeeId: string;
      contactEmployeeName: string;
    }
  | {
      type: "BATCH_SET_OFFICE_CONTACT";
      contactEmployeeId: string;
      contactEmployeeName: string;
      source: ContactSource;
    }
  | {
      type: "ASSIGN_ALL_IN_COUNTRY";
      countryCode: string;
      destination: AssignmentDestination;
    }
  | { type: "SET_UNIT_FULFILLMENT_DATE"; unitId: string; date: string | null }
  | { type: "BATCH_SET_FULFILLMENT_DATE"; date: string | null }
  | { type: "REMOVE_COUNTRY"; countryCode: string }
  | { type: "REMOVE_UNIT"; unitId: string }
  | {
      type: "SET_EMPLOYEE_FULFILMENT_DATE";
      employeeId: string;
      fulfilmentDate: string;
    }
  | {
      type: "SET_UNIT_DEVICE_SETUP";
      unitId: string;
      deviceSetup: string;
    };

export interface EmployeeOption {
  id: string;
  name: string;
  countryCode?: string;
  countryName?: string;
  raw: IEmployees;
}
