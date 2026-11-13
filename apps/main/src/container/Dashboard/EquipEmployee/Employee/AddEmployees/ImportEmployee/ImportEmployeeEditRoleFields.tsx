"use client";

import { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { MarkerPin01 } from "@untitledui/icons";
import { useGetJobTitlesQuery } from "@/api/baseQueries/companiesApi/jobTitlesApi/getJobTitles";
import { Select, type SelectItemType } from "@/components/base/select/select";
import type { EditEmployeeFormValues } from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import EditEmployeeLineManagerField from "@/container/Dashboard/Employees/EmployeeDetails/EditEmployeeLineManagerField";
import { EDIT_EMPLOYEE_FORM_ROW_CLASS } from "@/container/Dashboard/Employees/EmployeeDetails/editEmployeeFormLayout";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  withCurrentSelectOption,
} from "@/container/Dashboard/Employees/EmployeeDetails/editEmployeeFormOptions";
import {
  EditEmployeeDepartmentField,
  EditEmployeeLevelField,
} from "@/container/Dashboard/Employees/EmployeeDetails/EditEmployeeCreatableFields";
import { jobTitlesToOptions } from "@/utils/jobTitleOptions";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  employeeId: string;
  managerLabel?: string;
  departmentItems: SelectItemType[];
  levelItems: SelectItemType[];
  countryItems: SelectItemType[];
};

export function ImportEmployeeEditRoleFields({
  form,
  employeeId,
  managerLabel,
  departmentItems,
  levelItems,
  countryItems,
}: Props) {
  const { control, watch, setValue } = form;
  const values = watch();
  const companyId = useWorkspaceCompanyId();
  const jobTitlesQuery = useGetJobTitlesQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );

  const jobTitleItems = useMemo(
    () =>
      jobTitlesToOptions(jobTitlesQuery.data).map((option) => ({
        id: option.value,
        label: option.label,
      })),
    [jobTitlesQuery.data],
  );

  const selectedCountry = countryItems.find(
    (item) => item.id === values.country_id,
  );

  return (
    <>
      <div className={EDIT_EMPLOYEE_FORM_ROW_CLASS}>
        <Controller
          control={control}
          name="job_title"
          render={({ field }) => (
            <Select.ComboBox
              label="Job Title"
              placeholder="Select job title"
              shortcut={false}
              icon={null}
              items={withCurrentSelectOption(
                jobTitleItems,
                values.job_title ?? "",
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
              placeholder="Select employment type"
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
            <Select.ComboBox
              label="Select country"
              placeholder="Select country"
              shortcut={false}
              icon={selectedCountry?.icon ?? MarkerPin01}
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
          )}
        />
      </div>
    </>
  );
}
