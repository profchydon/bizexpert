"use client";

import React, { createContext, useContext } from "react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import type { IEmployees } from "@/types/employees";

export interface EmployeesSelectionApi {
  selectedIds: Set<string>;
  isAllPageSelected: boolean;
  isSomePageSelected: boolean;
  onToggleRow: (employee: IEmployees, checked: boolean) => void;
  onToggleAllPage: (checked: boolean) => void;
}

const EmployeesSelectionContext = createContext<EmployeesSelectionApi | null>(
  null,
);

export const EmployeesSelectionProvider = EmployeesSelectionContext.Provider;

const useSelectionApi = (): EmployeesSelectionApi => {
  const context = useContext(EmployeesSelectionContext);
  if (!context) {
    throw new Error("EmployeesSelectionProvider is missing in the tree");
  }
  return context;
};

export const HeaderSelectCheckbox: React.FC = () => {
  const { isAllPageSelected, isSomePageSelected, onToggleAllPage } =
    useSelectionApi();

  return (
    <Checkbox
      isSelected={isAllPageSelected}
      isIndeterminate={isSomePageSelected && !isAllPageSelected}
      onChange={onToggleAllPage}
      aria-label="Select all employees on this page"
      data-testid="selectioncheckboxes-checkbox"
    />
  );
};

interface RowProps {
  employee: IEmployees;
}

export const RowSelectCheckbox: React.FC<RowProps> = ({ employee }) => {
  const { selectedIds, onToggleRow } = useSelectionApi();

  return (
    <Checkbox
      isSelected={selectedIds.has(employee?.id as string)}
      onChange={(value) => onToggleRow(employee, value)}
      aria-label={`Select ${employee.first_name ?? "employee"}`}
      data-testid="selectioncheckboxes-checkbox-2"
    />
  );
};
