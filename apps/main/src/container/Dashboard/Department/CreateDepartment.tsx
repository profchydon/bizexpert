import React, { useState } from "react";
import { z } from "zod";

import DrawerRight from "@/components/DrawerRight";
import { useForm } from "react-hook-form";
import { createDepartmentSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Autocomplete, { MultiSelectValue } from "@/components/ui/autocomplete";
import { useCreateDepartmentMutation } from "@/api/baseQueries/companiesApi/departmentsApi/createDepartment";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import FormField from "@/components/Custom/FormField";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { Form } from "@/components/ui/form";
import { useDepartmentMemberSelectOptions } from "./useDepartmentMemberSelectOptions";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDepartment: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedValue, setSelectedValue] = useState<MultiSelectValue>([]);
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const { options: memberOptions } =
    useDepartmentMemberSelectOptions(companyId);

  const [createDepartment, createDepartmentProps] =
    useCreateDepartmentMutation();

  const form = useForm<z.infer<typeof createDepartmentSchema>>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      department_name: "",
      add_members: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof createDepartmentSchema>) => {
    const members = selectedValue.map((member) => member.value);
    const departmentValues = {
      name: data.department_name,
      members: members,
    };

    const payload = {
      companyId: companyId!,
      payload: departmentValues,
    } as any;

    try {
      await createDepartment(payload).unwrap();
      displaySuccessMessage(
        "Department Successfully created",
        "You have successfully created a new department",
      );
      onClose();
      form.reset();
      setSelectedValue([]);
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <Form {...form}>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={() => null}
        drawerDescription="Fill in the required fields below"
        drawerTitle="Create department"
        hideDefaultFooterBtn
        data-testid="createdepartment-drawerright"
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="department_name"
              label="Department name"
              render={({ field }) => (
                <Input
                  placeholder="Enter department name"
                  {...field}
                  data-testid="createdepartment-input"
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
                  data-testid="createdepartment-autocomplete"
                />
              )}
            />
          </div>

          <DrawerFooter
            onClose={onClose}
            onSubmit={() => null}
            saveText="Create Dept."
            submitButtonType="submit"
            disableSubmitButton={createDepartmentProps.isLoading}
          />
        </form>
      </DrawerRight>
    </Form>
  );
};

export default CreateDepartment;
