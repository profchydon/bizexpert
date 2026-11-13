"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { addEmployeeSchema } from "@/container/Dashboard/EquipEmployee/Employee/AddEmployees/AddEmployee/validation";
import {
  buildEditEmployeeFormData,
  employeeLineManagerLabel,
  type EditEmployeeFormValues,
} from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import { buildEmployeeCountrySelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/buildEmployeeCountrySelectItems";
import { toSelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/editEmployeeFormOptions";
import useDepartment from "@/hooks/useDepartment";
import useLevel from "@/hooks/useLevel";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import { useAppDispatch, useAppSelector } from "@/store";
import { setImportedEmployees } from "@/store/slices/employeeSlice";
import type { ICountry } from "@/types/auth";
import type { IEmployees } from "@/types/employees";
import { importEmployeeListPath } from "./importEmployeeEditPaths";

type Options = {
  employeeId: string;
  employeepage_instance?: boolean;
};

export function useImportEmployeeEditForm({
  employeeId,
  employeepage_instance = false,
}: Options) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const importedEmployees =
    (useAppSelector(
      (state) => state.persistedReducers?.employee?.importedEmployee,
    ) as IEmployees[]) || [];

  const employee = importedEmployees.find(
    (item) => String(item.id) === String(employeeId),
  );

  const { getDepartments } = useDepartment();
  const { getLevels, levelsById } = useLevel();
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries = (countriesResponse?.data?.data as ICountry[]) ?? [];

  const departmentOptions = useTransformToValueLabel(
    getDepartments?.data?.data as never,
  );
  const levelOptions = useTransformToValueLabel(getLevels?.data?.data as never);
  const countryItems = buildEmployeeCountrySelectItems(countries);

  const countryLabel = useMemo(() => {
    const stored = employee?.country_id ?? employee?.country;
    if (!stored) return undefined;
    return (
      countries.find((item) => item.id === stored || item.name === stored)
        ?.name ?? String(stored)
    );
  }, [countries, employee?.country, employee?.country_id]);

  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: buildEditEmployeeFormData(),
  });

  useEffect(() => {
    if (!employee) return;
    form.reset(buildEditEmployeeFormData(employee, countryLabel));
  }, [countryLabel, employee, form]);

  const listPath = importEmployeeListPath(employeepage_instance);

  const goBack = () => {
    router.replace(listPath);
  };

  const removeEmployee = () => {
    dispatch(
      setImportedEmployees(
        importedEmployees.filter(
          (item) => String(item.id) !== String(employeeId),
        ) as IEmployees[],
      ),
    );
    goBack();
  };

  const submit = form.handleSubmit((values) => {
    const nextEmployees = importedEmployees
      .map((item) =>
        String(item.id) === String(employeeId) ? { ...item, ...values } : item,
      )
      .sort((a, b) => Number(a.id) - Number(b.id));

    dispatch(setImportedEmployees(nextEmployees as IEmployees[]));
    goBack();
  });

  const displayName = [employee?.first_name, employee?.last_name]
    .filter(Boolean)
    .join(" ");
  const levelLabel = employee?.level
    ? levelsById(String(employee.level)) || "----"
    : "----";

  return {
    form,
    submit,
    goBack,
    removeEmployee,
    displayName,
    levelLabel,
    managerLabel: employeeLineManagerLabel(
      employee?.line_manager ?? employee?.manager,
    ),
    departmentItems: toSelectItems(departmentOptions),
    levelItems: toSelectItems(levelOptions),
    countryItems,
    employeeFound: Boolean(employee),
  };
}
