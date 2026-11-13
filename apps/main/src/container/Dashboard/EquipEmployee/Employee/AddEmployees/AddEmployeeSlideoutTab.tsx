"use client";

import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import EditEmployeeForm from "@/container/Dashboard/Employees/EmployeeDetails/EditEmployeeForm";
import type { IEmployees } from "@/types/employees";
import { addEmployeesFooterBorderClass } from "./addEmployeesBorderClasses";
import { useAddEmployeeForm } from "./useAddEmployeeForm";

type Props = {
  onClose: () => void;
  onAfterAdd?: () => void;
  employeepage_instance?: boolean;
  onEmployeeAdded?: (employee: IEmployees) => void;
  initialCountry?: string;
  suppressRouteSync?: boolean;
  lockCountryToInitial?: boolean;
  companyId?: string;
};

export default function AddEmployeeSlideoutTab({
  onClose,
  onAfterAdd,
  employeepage_instance,
  onEmployeeAdded,
  initialCountry,
  suppressRouteSync,
  lockCountryToInitial,
  companyId,
}: Props) {
  const {
    form,
    submit,
    isSubmitting,
    canSave,
    saveDisabledReason,
    managerLabel,
    departmentItems,
    levelItems,
    countryItems,
  } = useAddEmployeeForm({
    onClose,
    onAfterAdd,
    employeepage_instance,
    onEmployeeAdded,
    initialCountry,
    suppressRouteSync,
    lockCountryToInitial,
    companyId,
  });

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <EditEmployeeForm
          form={form}
          employeeId=""
          canEditAddress
          emailReadOnly={false}
          managerLabel={managerLabel}
          departmentItems={departmentItems}
          levelItems={levelItems}
          countryItems={countryItems}
          lockCountry={lockCountryToInitial}
          countryRequired
          freeTextAddress
        />
      </div>

      <div
        className={`flex w-full shrink-0 items-center justify-end gap-3 px-6 py-4 ${addEmployeesFooterBorderClass}`}
      >
        <Button
          size="md"
          color="secondary"
          onClick={onClose}
          data-testid="addemployeeslideouttab-button"
        >
          Cancel
        </Button>
        <DisabledWithTooltip
          isDisabled={!canSave}
          reason={saveDisabledReason}
          placement="top end"
        >
          <Button
            size="md"
            isDisabled={!canSave}
            isLoading={isSubmitting}
            onClick={() => void submit()}
            data-testid="addemployeeslideouttab-button-2"
          >
            Add employee
          </Button>
        </DisabledWithTooltip>
      </div>
    </>
  );
}
