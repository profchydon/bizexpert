"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { MarkerPin01 } from "@untitledui/icons";
import type { EditEmployeeFormValues } from "./buildEditEmployeeFormData";
import EditEmployeeLineManagerField from "./EditEmployeeLineManagerField";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  withCurrentSelectOption,
} from "./editEmployeeFormOptions";
import {
  EditEmployeeDepartmentField,
  EditEmployeeLevelField,
} from "./EditEmployeeCreatableFields";
import {
  EDIT_EMPLOYEE_FORM_ROW_CLASS,
  EditEmployeeLockedField,
} from "./editEmployeeFormLayout";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  employeeId: string;
  canEditAddress: boolean;
  lockCountry?: boolean;
  managerLabel?: string;
  departmentItems: SelectItemType[];
  levelItems: SelectItemType[];
  countryItems: SelectItemType[];
  countryRequired?: boolean;
};

export function EditEmployeeRoleFields({
  form,
  employeeId,
  canEditAddress,
  lockCountry = false,
  managerLabel,
  departmentItems,
  levelItems,
  countryItems,
  countryRequired = false,
}: Props) {
  const { control, watch, setValue } = form;
  const values = watch();
  const selectedCountry = countryItems.find(
    (item) => item.id === values.country_id,
  );

  return (
    <>
      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="tax_number"
          render={({ field }) => (
            <Input
              size="md"
              label="Tax ID (Optional)"
              placeholder="123-45-6789"
              value={field.value ?? ""}
              onChange={field.onChange}
              data-testid="editemployeerolefields-input"
            />
          )}
        />
        <Controller
          control={control}
          name="manager_id"
          render={({ field }) => (
            <EditEmployeeLineManagerField
              value={field.value}
              selectedLabel={managerLabel}
              excludeEmployeeId={employeeId}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="employment_type"
          render={({ field }) => (
            <Select.ComboBox
              label="Employment type"
              placeholder="Select"
              shortcut={false}
              icon={null}
              items={withCurrentSelectOption(
                EMPLOYMENT_TYPE_OPTIONS,
                values.employment_type ?? "",
              )}
              selectedKey={field.value || null}
              onSelectionChange={(key) =>
                field.onChange(key ? String(key) : "")
              }
            >
              {(item) => <Select.Item {...item} />}
            </Select.ComboBox>
          )}
        />
        <Controller
          control={control}
          name="level"
          render={({ field }) => (
            <EditEmployeeLevelField
              items={levelItems}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="department_id"
          render={({ field }) => (
            <EditEmployeeDepartmentField
              items={departmentItems}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="country_id"
          render={({ field }) => (
            <EditEmployeeLockedField locked={!canEditAddress}>
              <Select.ComboBox
                label="Country"
                isRequired={countryRequired}
                placeholder="Select"
                shortcut={false}
                icon={selectedCountry?.icon ?? MarkerPin01}
                isDisabled={!canEditAddress || lockCountry}
                items={withCurrentSelectOption(
                  countryItems,
                  values.country_id ?? "",
                )}
                selectedKey={field.value || null}
                onSelectionChange={(key) => {
                  field.onChange(key ? String(key) : "");
                  setValue("address", "");
                }}
              >
                {(item) => <Select.Item {...item} />}
              </Select.ComboBox>
            </EditEmployeeLockedField>
          )}
        />
      </div>
    </>
  );
}
