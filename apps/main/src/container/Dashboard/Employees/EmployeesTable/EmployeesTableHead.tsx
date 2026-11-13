"use client";

import { ChevronSelectorVertical } from "@untitledui/icons";
import { HeaderSelectCheckbox } from "./selectionCheckboxes";
import {
  EMPLOYEES_COLUMN_TEMPLATE,
  employeesTableHeadClass,
} from "./employeesTableClasses";

const COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "email", label: "Email address", sortable: true },
  { key: "devices", label: "Devices", sortable: false },
  { key: "country", label: "Country", sortable: true },
] as const;

const EmployeesTableHead = () => {
  return (
    <div
      className={employeesTableHeadClass}
      style={{ gridTemplateColumns: EMPLOYEES_COLUMN_TEMPLATE }}
    >
      <HeaderSelectCheckbox />
      {COLUMNS.map((col) => (
        <span
          key={col.key}
          className="inline-flex items-center gap-1 text-quaternary"
        >
          {col.label}
          {col.sortable && (
            <ChevronSelectorVertical className="size-3 text-fg-quaternary" />
          )}
        </span>
      ))}
      <span />
    </div>
  );
};

export default EmployeesTableHead;
