"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import type { EditEmployeeFormValues } from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import { EditEmployeePhoneField } from "@/container/Dashboard/Employees/EmployeeDetails/EditEmployeePhoneField";
import { EDIT_EMPLOYEE_FORM_ROW_CLASS } from "@/container/Dashboard/Employees/EmployeeDetails/editEmployeeFormLayout";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
};

export function ImportEmployeeEditIdentityFields({ form }: Props) {
  const { control } = form;

  return (
    <>
      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="first_name"
          render={({ field }) => (
            <Input
              size="md"
              label="First name"
              placeholder="Enter first name"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="importemployeeeditidentityfields-input"
            />
          )}
        />
        <Controller
          control={control}
          name="last_name"
          render={({ field }) => (
            <Input
              size="md"
              label="Last name"
              placeholder="Enter last name"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="importemployeeeditidentityfields-input-2"
            />
          )}
        />
      </div>

      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="personal_email"
          render={({ field }) => (
            <Input
              size="md"
              label="Personal email (Optional)"
              type="email"
              placeholder="Enter employee's personal email"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="importemployeeeditidentityfields-input-3"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              size="md"
              label="Work email"
              type="email"
              placeholder="Enter email"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="importemployeeeditidentityfields-input-4"
            />
          )}
        />
      </div>

      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <EditEmployeePhoneField
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="tax_number"
          render={({ field }) => (
            <Input
              size="md"
              label="National ID/Tax Number (Optional)"
              placeholder="Enter National ID/Tax Number"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="importemployeeeditidentityfields-input-5"
            />
          )}
        />
      </div>
    </>
  );
}
