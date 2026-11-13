import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import PageState from "@/components/PageState";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useAddMultipleEmployeeAsAdminMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/addMultipleEmployeeAsAdmin";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useGetAdminEmployeesQuery } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/getAdminEmployees";
import { useInviteEmployeesMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/inviteEmployees";

interface Props {
  selectEmployees: string[];
  setSelectEmployees: (value: string[]) => void;
  onClose: () => void;
}
const AddAdmins: React.FC<Props> = ({
  selectEmployees,
  setSelectEmployees,
  onClose,
}) => {
  const [addEmployees, addEmployeesProps] =
    useAddMultipleEmployeeAsAdminMutation();

  const [inviteAdmins, inviteAdminsProps] = useInviteEmployeesMutation();

  const handleSelectEmployees = (email: string) => {
    if (selectEmployees.includes(email)) {
      setSelectEmployees(
        selectEmployees.filter((employee) => employee !== email),
      );
    } else {
      setSelectEmployees([...selectEmployees, email]);
    }
  };

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { data: adminEmployeesRes } = useGetAdminEmployeesQuery({
    companyId: company?.id,
  });
  const adminEmployees = adminEmployeesRes?.data?.data ?? [];

  const {
    data: employeeRes,
    isLoading,
    isError,
  } = useGetEmployeesQuery({
    companyId: company?.id!,
  });
  const employees = employeeRes?.data.data ?? [];

  const onSumbit = async () => {
    const data = {
      companyId: company?.id as string,
      payload: {
        emails: selectEmployees,
        role: "Administrator",
      },
    };

    const { success } = await inviteAdmins(data).unwrap();

    if (success) {
      displaySuccessMessage(
        "Employees' accounts have been granted admin access.",
      );
      setSelectEmployees([]);
      onClose();
    }
  };

  const nonAdmins = employees.filter((obj2) => {
    return !adminEmployees.some((obj1) => obj1.email === obj2.email);
  });

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="pb-6">
        <Select data-testid="addadmins-select">
          <SelectTrigger>
            <SelectValue placeholder="All employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all-employees">All employees</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-4 mb-12">
        {nonAdmins?.map((employee) => (
          <Card
            key={employee.email}
            className={cn(
              "rounded-xl cursor-pointer",
              selectEmployees.includes(employee.email) && "border-primary-600",
            )}
            onClick={() => handleSelectEmployees(employee.email)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="flex gap-x-1 items-center">
                  <Avatar>
                    <AvatarFallback className="bg-gray-100 font-medium text-sm uppercase">
                      {employee.first_name[0]} {employee.last_name[1]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-sm flex flex-col gap-y-1">
                    <span className="font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}{" "}
                      <span className="font-normal text-gray-600">
                        {employee.job_title}
                      </span>
                    </span>
                    {/* <span>Product Designer, Technology</span> */}
                  </div>
                </div>

                <div>
                  <Checkbox
                    checked={selectEmployees.includes(employee.email)}
                    data-testid="addadmins-checkbox"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DrawerFooter
        onClose={onClose}
        onSubmit={onSumbit}
        disableSubmitButton={
          selectEmployees.length === 0 || inviteAdminsProps.isLoading
        }
      />
    </PageState>
  );
};

export default AddAdmins;
