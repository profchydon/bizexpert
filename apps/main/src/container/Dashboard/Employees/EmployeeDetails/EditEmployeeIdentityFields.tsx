"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import type { EditEmployeeFormValues } from "./buildEditEmployeeFormData";
import { EditEmployeePhoneField } from "./EditEmployeePhoneField";
import { EDIT_EMPLOYEE_FORM_ROW_CLASS } from "./editEmployeeFormLayout";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  emailReadOnly?: boolean;
};

export function EditEmployeeIdentityFields({
  form,
  emailReadOnly = true,
}: Props) {
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
              isRequired
              placeholder="John"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="editemployeeidentityfields-input"
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
              isRequired
              placeholder="Doe"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="editemployeeidentityfields-input-2"
            />
          )}
        />
      </div>

      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              size="md"
              label="Work email"
              isRequired
              type="email"
              placeholder="john@company.com"
              value={field.value ?? ""}
              onChange={field.onChange}
              isDisabled={emailReadOnly}
              data-testid="editemployeeidentityfields-input-3"
            />
          )}
        />
        <Controller
          control={control}
          name="personal_email"
          render={({ field }) => (
            <Input
              size="md"
              label="Personal email"
              type="email"
              placeholder="john@example.com"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="editemployeeidentityfields-input-4"
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
          name="job_title"
          render={({ field }) => (
            <Input
              size="md"
              label="Job title"
              placeholder="Software Engineer"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="editemployeeidentityfields-input-5"
            />
          )}
        />
      </div>
    </>
  );
}
