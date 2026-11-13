import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import DrawerRight from "@/components/DrawerRight";
import { moveDepartmentSchema } from "./validation";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Autocomplete, { MultiSelectValue } from "@/components/ui/autocomplete";
import FormField from "@/components/Custom/FormField";
import { Switch } from "@/components/ui/switch";
import { IDepartment } from "@/types/departments";
import DepartmentField from "@/components/DepartmentField";
import { IEmployees } from "@/types/employees";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useMoveMembersMutation } from "@/api/baseQueries/companiesApi/departmentsApi/moveMembers";
import { moveThenDeleteDepartment } from "./moveMembersActions";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useDeleteDepartmentMutation } from "@/api/baseQueries/companiesApi/departmentsApi/deleteDepartment";
import { mapDepartmentMembersToSelectedOptions } from "./useDepartmentMemberSelectOptions";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setDepartmentDetail: () => void;
  departmentDetail?: IDepartment;
}

const MoveMembersToDepartment: React.FC<Props> = ({
  isOpen,
  onClose,
  setDepartmentDetail,
  departmentDetail,
}) => {
  const [isSelectAllMembers, setIsSelectAllMembers] = useState(false);
  const [selectedValue, setSelectedValue] = useState<MultiSelectValue>([]);

  const memberOptions = useMemo(
    () =>
      departmentDetail?.members?.length
        ? mapDepartmentMembersToSelectedOptions(
            departmentDetail.members as unknown as IEmployees[],
          )
        : [],
    [departmentDetail?.members],
  );

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [deleteDepartment, deleteDepartmentProps] =
    useDeleteDepartmentMutation();
  const [moveMember, moveMemberProps] = useMoveMembersMutation();

  const form = useForm<z.infer<typeof moveDepartmentSchema>>({
    resolver: zodResolver(moveDepartmentSchema),
    defaultValues: {
      current_department: "",
      add_members: "",
      new_department: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof moveDepartmentSchema>) => {
    await moveThenDeleteDepartment({
      moveMember,
      deleteDepartment,
      companyId: companyId!,
      departmentId: departmentDetail?.id!,
      destinationDeptId: data.new_department,
      members: selectedValue?.map((member) => member.value),
      onSuccess: () => {
        onClose();
        form.reset();
        setSelectedValue([]);
        setDepartmentDetail();
        setIsSelectAllMembers(false);
      },
    });
  };

  useEffect(() => {
    if (departmentDetail) {
      form.setValue("current_department", departmentDetail.name);
    }
  }, [departmentDetail, form]);

  useEffect(() => {
    if (selectedValue.length !== memberOptions.length) {
      setIsSelectAllMembers(false);
    }
  }, [memberOptions.length, selectedValue.length]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={() => null}
        drawerTitle="Move Member to a department"
        drawerDescription="Reassign your members to a new department"
        hideDefaultFooterBtn
        data-testid="movememberstodepartment-drawerright"
      >
        <Form {...form}>
          <form
            className="space-y-5 mb-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="current_department"
              label="Current department"
              render={({ field }) => (
                <Input
                  placeholder=""
                  {...field}
                  disabled
                  readOnly
                  data-testid="movememberstodepartment-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="new_department"
              label="New department"
              render={({ field }) => (
                <div>
                  <DepartmentField
                    onChange={(value) => field.onChange(value)}
                    departmentToExclude={departmentDetail?.id!}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="add_members"
              label="Add members"
              render={({ field }) => (
                <div>
                  <Autocomplete
                    options={memberOptions}
                    setSelectedOption={(value) => {
                      setSelectedValue(value as MultiSelectValue);
                    }}
                    selectedOption={selectedValue}
                    isSearchable
                    isMulti
                    placeholder="Enter member's name"
                    data-testid="movememberstodepartment-autocomplete"
                  />

                  <div className="flex flex-row items-center pt-2 font-medium text-sm pl-0 px-6 gap-y-1.5 gap-x-1.5">
                    <Switch
                      checked={isSelectAllMembers}
                      onCheckedChange={(value) => {
                        setIsSelectAllMembers(value);
                        if (value) {
                          setSelectedValue(memberOptions);
                        } else {
                          setSelectedValue([]);
                        }
                      }}
                    />
                    <span>Move all members</span>
                  </div>
                </div>
              )}
            />

            <DrawerFooter
              onClose={onClose}
              onSubmit={() => null}
              submitButtonType="submit"
              saveText="Move"
              disableSubmitButton={
                !form.formState.isValid || moveMemberProps.isLoading
              }
            />
          </form>
        </Form>
      </DrawerRight>
    </div>
  );
};

export default MoveMembersToDepartment;
