import React from "react";
import CreatableSelectField from "./CreatableSelectField";
import { OnChangeValue } from "react-select";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import useDepartment from "@/hooks/useDepartment";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import { useCreateDepartmentMutation } from "@/api/baseQueries/companiesApi/departmentsApi/createDepartment";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { CreateDepartmentRequest } from "@/types/departments";

interface Props {
  onChange: (value: string) => void;
  departmentToExclude?: string;
  defaultValue?: { value: string; label: string }[];
  isDisabled?: boolean;
}

const DepartmentField: React.FC<Props> = ({
  onChange,
  departmentToExclude,
  isDisabled,
  defaultValue,
}) => {
  const companyId = useWorkspaceCompanyId();

  const { getDepartments } = useDepartment();
  const formateDepartmentValueLabel = useTransformToValueLabel(
    // @ts-ignore
    getDepartments?.data?.data,
  );

  const [createDepartment, createDepartmentProps] =
    useCreateDepartmentMutation();

  const handleCreateDepartmentOption = async (inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue };

    const departmentValues = {
      name: newOption?.label as string,
    };

    const payload = {
      companyId: companyId!,
      payload: departmentValues,
    } as CreateDepartmentRequest;

    return await createDepartment(payload)
      .unwrap()
      .then((res) => {
        displaySuccessMessage("Department created");
      })
      .catch(showApiError);
  };

  const getOptions = () => {
    if (departmentToExclude) {
      return formateDepartmentValueLabel.filter(
        (dept) => dept.value !== departmentToExclude,
      );
    } else {
      return formateDepartmentValueLabel;
    }
  };

  return (
    <CreatableSelectField
      options={getOptions()}
      isLoading={createDepartmentProps?.isLoading}
      onChange={(
        newValue: OnChangeValue<{ value: string; label: string }, false>,
      ) => {
        onChange(newValue?.value!);
      }}
      onCreateOption={handleCreateDepartmentOption}
      placeholder="Select or create department"
      defaultValue={defaultValue as any}
      isDisabled={isDisabled}
    />
  );
};

export default DepartmentField;
