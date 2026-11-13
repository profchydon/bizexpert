import { Link04, Upload01, UserPlus01 } from "@untitledui/icons";
import type { ComponentType } from "react";
import type { EmployeeAddTab } from "../EquipEmployee/Employee/AddEmployees/addEmployeesPanelTabs";

export type EmployeeImportOption = {
  key: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  recommended: boolean;
  tab: EmployeeAddTab;
};

export const employeeImportOptions: EmployeeImportOption[] = [
  {
    key: "hris",
    icon: Link04,
    title: "Connect HRIS",
    description: "Auto-import from BambooHR, Workday, Rippling and more",
    recommended: true,
    tab: "hris",
  },
  {
    key: "csv",
    icon: Upload01,
    title: "Upload Employee CSV",
    description: "Import your employee list from a spreadsheet",
    recommended: false,
    tab: "import",
  },
  {
    key: "manual",
    icon: UserPlus01,
    title: "Add employee manually",
    description: "Add employees one at a time with a simple form",
    recommended: false,
    tab: "add",
  },
];
