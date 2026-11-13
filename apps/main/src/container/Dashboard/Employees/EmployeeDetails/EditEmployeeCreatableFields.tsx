"use client";

import { useCreateDepartmentMutation } from "@/api/baseQueries/companiesApi/departmentsApi/createDepartment";
import { useCreateLevelMutation } from "@/api/baseQueries/companiesApi/levelsApi/createLevel";
import type { SelectItemType } from "@/components/base/select/select";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { CreateDepartmentRequest } from "@/types/departments";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { CreatableNamedComboBox } from "./CreatableNamedComboBox";
import { createdNamedResourceId } from "./createdNamedResourceId";

type FieldProps = {
  items: SelectItemType[];
  value: string;
  onChange: (value: string) => void;
};

export function EditEmployeeLevelField({
  items,
  value,
  onChange,
}: Readonly<FieldProps>) {
  const companyId = useWorkspaceCompanyId();
  const [createLevel, createLevelProps] = useCreateLevelMutation();

  return (
    <CreatableNamedComboBox
      label="Level"
      placeholder="Select or create level"
      emptyLabel="Type to create a level"
      items={items}
      selectedKey={value}
      isCreating={createLevelProps.isLoading}
      onSelect={onChange}
      onCreate={async (name) => {
        if (!companyId) {
          return null;
        }
        try {
          const response = await createLevel({
            companyId,
            name,
            members: [],
          }).unwrap();
          displaySuccessMessage("Level created");
          return createdNamedResourceId(response) ?? name;
        } catch (error) {
          showApiError(error);
          return null;
        }
      }}
    />
  );
}

export function EditEmployeeDepartmentField({
  items,
  value,
  onChange,
}: Readonly<FieldProps>) {
  const companyId = useWorkspaceCompanyId();
  const [createDepartment, createDepartmentProps] =
    useCreateDepartmentMutation();

  return (
    <CreatableNamedComboBox
      label="Department"
      placeholder="Select or create department"
      emptyLabel="Type to create a department"
      items={items}
      selectedKey={value}
      isCreating={createDepartmentProps.isLoading}
      onSelect={onChange}
      onCreate={async (name) => {
        if (!companyId) {
          return null;
        }
        try {
          const payload = {
            companyId,
            payload: { name },
          } as CreateDepartmentRequest;
          const response = await createDepartment(payload).unwrap();
          displaySuccessMessage("Department created");
          return createdNamedResourceId(response) ?? name;
        } catch (error) {
          showApiError(error);
          return null;
        }
      }}
    />
  );
}
