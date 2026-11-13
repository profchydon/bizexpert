import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddEmployeeAsAdminMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/addEmployeeAsAdmin";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { Form } from "@/components/ui/form";
import { SingleSelectValue } from "@/components/ui/autocomplete";
import type { AddEmployeeRequest } from "@/types/employees";
import useDepartment from "@/hooks/useDepartment";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import AddNewEmployeeFields from "./AddNewEmployeeFields";
import { addNewEmployeeSchema } from "./validation";

interface Props {
  onClose: () => void;
}

const AddNewEmployee: React.FC<Props> = ({ onClose }) => {
  const form = useForm<z.infer<typeof addNewEmployeeSchema>>({
    resolver: zodResolver(addNewEmployeeSchema),
    defaultValues: {
      address: "",
      country_id: "",
      department_id: "",
      email: "",
      employment_type: "",
      first_name: "",
      job_title: "",
      last_name: "",
      level: "",
      phone: "",
    },
  });

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const { getDepartments } = useDepartment();
  const departmentOptions = useTransformToValueLabel(
    getDepartments?.data?.data as never,
  );
  const [selectedCountry, setSelectedCountry] = useState<SingleSelectValue>();
  const selectedCountryId = form.watch("country_id");
  const { data: getCountries } = useGetCountriesQuery();
  const [addEmployeeAsAdmin, addEmployeeAsAdminProps] =
    useAddEmployeeAsAdminMutation();

  const countryCode = getCountries?.data?.data?.find(
    (item: { id: string; code?: string }) => item.id === selectedCountryId,
  )?.code;

  const onSubmit = async (data: z.infer<typeof addNewEmployeeSchema>) => {
    const payload = {
      companyId: company?.id as string,
      payload: { ...data, role: "Administrator" },
    } as unknown as AddEmployeeRequest;

    try {
      await addEmployeeAsAdmin(payload).unwrap();
      displaySuccessMessage(
        "Employee added successfully as admin",
        "New employee has been added as an admin to the company.",
      );
      form.reset();
      onClose();
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <AddNewEmployeeFields
          control={form.control}
          selectedCountry={selectedCountry}
          selectedCountryId={selectedCountryId}
          countryCode={countryCode}
          departmentOptions={departmentOptions ?? []}
          onCountryChange={(value) => {
            setSelectedCountry(value);
            form.setValue("address", "");
          }}
        />
        <DrawerFooter
          onClose={onClose}
          onSubmit={() => null}
          submitButtonType="submit"
          isSubmitLoading={addEmployeeAsAdminProps.isLoading}
        />
      </form>
    </Form>
  );
};

export default AddNewEmployee;
