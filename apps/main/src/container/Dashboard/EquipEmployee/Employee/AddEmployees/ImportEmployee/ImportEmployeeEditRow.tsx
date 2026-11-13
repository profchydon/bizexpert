"use client";

import { ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import {
  addEmployeesFooterBorderClass,
  addEmployeesSectionBorderClass,
} from "../addEmployeesBorderClasses";
import { ImportEmployeeEditForm } from "./ImportEmployeeEditForm";
import { useImportEmployeeEditForm } from "./useImportEmployeeEditForm";

type Props = {
  employeeId: string;
  employeepage_instance?: boolean;
};

export function ImportEmployeeEditRow({
  employeeId,
  employeepage_instance = false,
}: Props) {
  const {
    form,
    submit,
    goBack,
    removeEmployee,
    displayName,
    levelLabel,
    managerLabel,
    departmentItems,
    levelItems,
    countryItems,
    employeeFound,
  } = useImportEmployeeEditForm({ employeeId, employeepage_instance });

  if (!employeeFound) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-tertiary">
        Employee not found in import preview.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-5">
          <Button
            color="link-gray"
            size="sm"
            iconLeading={ArrowLeft}
            onPress={goBack}
            data-testid="importemployeeeditrow-button"
          >
            Go back
          </Button>

          <div
            className={`mt-5 flex items-center justify-between pb-4 ${addEmployeesSectionBorderClass}`}
          >
            <div>
              <p className="text-sm font-semibold text-secondary">
                {displayName || "----"}
              </p>
              <p className="mt-0.5 text-sm text-tertiary">{levelLabel}</p>
            </div>
            <Button
              color="secondary"
              size="sm"
              onPress={removeEmployee}
              data-testid="importemployeeeditrow-button-2"
            >
              Remove
            </Button>
          </div>
        </div>

        <ImportEmployeeEditForm
          form={form}
          employeeId={employeeId}
          managerLabel={managerLabel}
          departmentItems={departmentItems}
          levelItems={levelItems}
          countryItems={countryItems}
        />
      </div>

      <div
        className={`flex shrink-0 items-center justify-end gap-3 px-6 py-4 ${addEmployeesFooterBorderClass}`}
      >
        <Button
          color="secondary"
          size="md"
          iconLeading={ArrowLeft}
          onPress={goBack}
          data-testid="importemployeeeditrow-button-3"
        >
          Back
        </Button>
        <Button
          size="md"
          onPress={() => void submit()}
          data-testid="importemployeeeditrow-button-4"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
