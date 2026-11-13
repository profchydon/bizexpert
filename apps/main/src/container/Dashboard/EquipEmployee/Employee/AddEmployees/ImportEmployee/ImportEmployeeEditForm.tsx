"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import type { SelectItemType } from "@/components/base/select/select";
import type { EditEmployeeFormValues } from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import { ImportEmployeeEditIdentityFields } from "./ImportEmployeeEditIdentityFields";
import { ImportEmployeeEditRoleFields } from "./ImportEmployeeEditRoleFields";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  employeeId: string;
  managerLabel?: string;
  departmentItems: SelectItemType[];
  levelItems: SelectItemType[];
  countryItems: SelectItemType[];
};

function ImportEmployeeEditAddressField({
  form,
}: {
  form: UseFormReturn<EditEmployeeFormValues>;
}) {
  return (
    <Controller
      control={form.control}
      name="address"
      render={({ field }) => (
        <Input
          size="md"
          label="Address"
          placeholder="Enter Address"
          value={field.value ?? ""}
          onChange={field.onChange}
          data-testid="importemployeeeditform-input"
        />
      )}
    />
  );
}

export function ImportEmployeeEditForm({
  form,
  employeeId,
  managerLabel,
  departmentItems,
  levelItems,
  countryItems,
}: Props) {
  return (
    <div className="flex flex-col gap-4 px-6 pb-6">
      <ImportEmployeeEditIdentityFields form={form} />
      <ImportEmployeeEditRoleFields
        form={form}
        employeeId={employeeId}
        managerLabel={managerLabel}
        departmentItems={departmentItems}
        levelItems={levelItems}
        countryItems={countryItems}
      />
      <ImportEmployeeEditAddressField form={form} />
    </div>
  );
}
