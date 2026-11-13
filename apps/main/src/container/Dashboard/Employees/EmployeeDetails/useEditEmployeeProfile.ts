"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditEmployeeMutation } from "@/api/baseQueries/companiesApi/employeesApi/editEmployee";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import useDepartment from "@/hooks/useDepartment";
import useLevel from "@/hooks/useLevel";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import type { EditEmployeeRequest } from "@/types/employees";
import type { ICountry } from "@/types/auth";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { buildEmployeeUpdatePayload } from "../../EquipEmployee/Employee/AddEmployees/AddEmployee/employeeUpdatePayload";
import { addEmployeeSchema } from "../../EquipEmployee/Employee/AddEmployees/AddEmployee/validation";
import { buildEmployeeCountrySelectItems } from "./buildEmployeeCountrySelectItems";
import {
  buildEditEmployeeFormData,
  employeeLineManagerLabel,
  type EditEmployeeFormValues,
} from "./buildEditEmployeeFormData";
import { toSelectItems } from "./editEmployeeFormOptions";

export function useEditEmployeeProfile(
  employeeId: string,
  onSaved: () => void,
) {
  const companyId = useWorkspaceCompanyId();

  const { getDepartments } = useDepartment();
  const { getLevels } = useLevel();
  const { data: countriesResponse } = useGetCountriesQuery();

  const departmentOptions = useTransformToValueLabel(
    getDepartments?.data?.data as never,
  );
  const levelOptions = useTransformToValueLabel(getLevels?.data?.data as never);
  const countryItems = buildEmployeeCountrySelectItems(
    (countriesResponse?.data?.data as ICountry[]) ?? [],
  );

  const { data: employeeResponse, isLoading } = useGetSingleEmployeeQuery(
    { companyId: companyId!, employeeId },
    { skip: !companyId || !employeeId },
  );

  const employee = employeeResponse?.data;
  const countryLabel = useMemo(
    () => employee?.country ?? "",
    [employee?.country],
  );

  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: buildEditEmployeeFormData(),
  });

  useEffect(() => {
    if (!employee) return;
    form.reset(buildEditEmployeeFormData(employee, countryLabel));
  }, [countryLabel, employee, form]);

  const [editEmployee, { isLoading: isSaving }] = useEditEmployeeMutation();

  const save = form.handleSubmit(async (values) => {
    if (!companyId) return;

    const payload = {
      companyId: companyId,
      employeeId,
      payload: buildEmployeeUpdatePayload(values, {
        countryOptions: countryItems.map((item) => ({
          value: item.id,
          label: item.label ?? item.id,
        })),
        currentEmployee: employee,
        departmentOptions,
        levelOptions,
      }),
    } as EditEmployeeRequest;

    await editEmployee(payload).unwrap();
    displaySuccessMessage(
      "Employee updated successfully",
      "Employee's details has been updated in the company's roster.",
    );
    onSaved();
  });

  const watched = form.watch();
  const canSave =
    Boolean(watched.first_name?.trim()) &&
    Boolean(watched.last_name?.trim()) &&
    Boolean(watched.email?.trim());

  const canEditAddress = employee?.can_edit_address !== false;

  return {
    form,
    save,
    isSaving,
    isLoading,
    canSave,
    employee,
    canEditAddress,
    managerLabel: employeeLineManagerLabel(
      employee?.line_manager ?? employee?.manager,
    ),
    departmentItems: toSelectItems(departmentOptions),
    levelItems: toSelectItems(levelOptions),
    countryItems,
  };
}
