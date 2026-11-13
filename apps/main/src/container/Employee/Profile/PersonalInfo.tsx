import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { profileFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useEditEmployeeMutation } from "@/api/baseQueries/companiesApi/employeesApi/editEmployee";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import PageState from "@/components/PageState";
import PersonalInfoFields from "./PersonalInfoFields";

const PersonalInfo = () => {
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();

  const {
    data: employeeRes,
    isLoading,
    isError,
  } = useGetSingleEmployeeQuery({
    companyId: company?.id!,
    employeeId: user?.id!,
  });
  const employee = employeeRes?.data;
  const [updateEmployee, updateEmployeeProps] = useEditEmployeeMutation();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      await updateEmployee({
        payload: {
          last_name: data.last_name,
          first_name: data.first_name,
          phone: data.phone,
          address: data.address,
          country_id: company?.country.id!,
        } as never,
        companyId: company?.id!,
        employeeId: employee?.id!,
      }).unwrap();
      displaySuccessMessage(
        "Update sucessful",
        "Personal info succesfully updated.",
      );
    } catch (error) {
      showApiError(error);
    }
  };

  useEffect(() => {
    if (employee) {
      form.reset({
        first_name: employee.first_name,
        last_name: employee.last_name,
        phone: employee.phone ?? "",
        email: employee.email,
        address: employee.address ?? "",
      });
    }
  }, [employee, form]);

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <Form {...form}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Personal info</h2>
          <span className="text-sm">
            Update your password and personal details here.
          </span>
        </div>
        <Separator className="my-6" />
        <PersonalInfoFields
          form={form}
          departments={employee?.departments}
          isSaving={updateEmployeeProps.isLoading}
          onSubmit={onSubmit}
        />
      </Form>
    </PageState>
  );
};

export default PersonalInfo;
