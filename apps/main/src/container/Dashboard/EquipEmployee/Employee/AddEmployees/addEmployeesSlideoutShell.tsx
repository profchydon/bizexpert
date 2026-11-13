"use client";

import type { ReactNode } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { CloseButton } from "@/components/base/buttons/close-button";
import { EMPLOYEE_FORM_SLIDEOUT_RESIZE } from "@/container/Dashboard/Employees/EmployeeDetails/employeeDetailSlideoutResize";
import {
  AddEmployeesPanelTabs,
  type EmployeeAddTab,
} from "./addEmployeesPanelTabs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeTab: EmployeeAddTab;
  onTabChange: (tab: EmployeeAddTab) => void;
  hideTabs?: boolean;
  disabledTabs?: EmployeeAddTab[];
  children: ReactNode;
};

export function AddEmployeesSlideoutShell({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  hideTabs = false,
  disabledTabs = [],
  children,
}: Props) {
  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Add employees"
      dialogClassName="overflow-hidden"
      resizeOptions={EMPLOYEE_FORM_SLIDEOUT_RESIZE}
      data-testid="addemployees-drawerright"
    >
      <div className="flex w-full shrink-0 items-start justify-between px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-primary">Add employees</h2>
          <p className="mt-0.5 text-sm text-tertiary">
            Download template to add employees or invite team members to add
            their details
          </p>
        </div>
        <CloseButton size="sm" onPress={onClose} />
      </div>

      {hideTabs ? (
        <div className="h-px w-full shrink-0 bg-border-secondary" />
      ) : (
        <AddEmployeesPanelTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          disabledTabs={disabledTabs}
        />
      )}

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-secondary">
        {children}
      </div>
    </SlideoutMenu>
  );
}
