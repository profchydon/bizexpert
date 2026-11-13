import React, { useEffect, useState } from "react";
import { z } from "zod";

import DrawerRight from "@/components/DrawerRight";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createDepartmentSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Autocomplete, { MultiSelectValue } from "@/components/ui/autocomplete";
import FormField from "@/components/Custom/FormField";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useEditDepartmentMutation } from "@/api/baseQueries/companiesApi/departmentsApi/editDepartment";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { IEmployees } from "@/types/employees";
import { IDepartment } from "@/types/departments";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  mapDepartmentMembersToSelectedOptions,
  useDepartmentMemberSelectOptions,
} from "./useDepartmentMemberSelectOptions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  department?: IDepartment;
}

const EditDepartment: React.FC<Props> = ({ isOpen, onClose, department }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const form = useForm<z.infer<typeof createDepartmentSchema>>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      department_name: "",
      add_members: undefined,
    },
  });

  const [editDepartment, editDepartmentProps] = useEditDepartmentMutation();
  const [selectedValue, setSelectedValue] = useState<MultiSelectValue>([]);
  const { options: memberOptions } =
    useDepartmentMemberSelectOptions(companyId);

  const onSubmit = async (data: z.infer<typeof createDepartmentSchema>) => {
    const members = selectedValue.map((member) => member.value);

    if (!department) return;

    try {
      await editDepartment({
        companyId: companyId!,
        departmentId: department?.id!,
        name: data.department_name,
        members: members,
      }).unwrap();
      displaySuccessMessage("Department updated");
      form.reset();
      setSelectedValue([]);
      onClose();
    } catch (error) {
      showApiError(error);
    }
  };

  useEffect(() => {
    if (!department) {
      return;
    }

    form.setValue("department_name", department.name!);
    setSelectedValue(
      department.members?.length
        ? mapDepartmentMembersToSelectedOptions(
            department.members as unknown as IEmployees[],
          )
        : [],
    );
  }, [department, form]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={() => null}
        hideDefaultFooterBtn
        drawerTitle="Edit department"
        drawerDescription="You can make changes to this department here"
        data-testid="editdepartment-drawerright"
      >
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="department_name"
              label="Department name"
              render={({ field }) => (
                <Input
                  placeholder="Enter department name"
                  {...field}
                  data-testid="editdepartment-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="add_members"
              label="Add members(Optional)"
              render={() => (
                <Autocomplete
                  options={memberOptions}
                  setSelectedOption={(value) => {
                    setSelectedValue(value as MultiSelectValue);
                  }}
                  selectedOption={selectedValue}
                  isSearchable
                  isMulti
                  placeholder="Enter member's name"
                  data-testid="editdepartment-autocomplete"
                />
              )}
            />

            <DrawerFooter
              onSubmit={() => null}
              onClose={onClose}
              submitButtonType="submit"
              disableSubmitButton={editDepartmentProps.isLoading}
            />
          </form>
        </Form>
      </DrawerRight>
    </div>
  );
};

export default EditDepartment;
