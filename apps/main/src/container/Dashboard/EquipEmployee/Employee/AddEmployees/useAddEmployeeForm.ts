"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAddEmployeesMutation } from "@/api/baseQueries/companiesApi/employeesApi/addEmployees";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import {
  buildEditEmployeeFormData,
  type EditEmployeeFormValues,
} from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import { buildEmployeeCountrySelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/buildEmployeeCountrySelectItems";
import { toSelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/editEmployeeFormOptions";
import useDepartment from "@/hooks/useDepartment";
import useLevel from "@/hooks/useLevel";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import { useWorkspaceScopedCompanyArgs } from "@/hooks/useWorkspaceScopedCompanyArgs";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import type { AddEmployeeRequest, IEmployees } from "@/types/employees";
import type { ICountry } from "@/types/auth";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import {
  buildAddEmployeeRouteQuery,
  shouldReplaceAddEmployeeRoute,
} from "./addEmployeeRouteSync";
import {
  canSaveAddEmployee,
  getAddEmployeeSaveDisabledReason,
} from "./addEmployeeCanSave";
import { addEmployeeSchema } from "./AddEmployee/validation";
import { useAddEmployeeFormHydration } from "./useAddEmployeeFormHydration";

type Options = {
  onClose: () => void;
  onAfterAdd?: () => void;
  employeepage_instance?: boolean;
  onEmployeeAdded?: (employee: IEmployees) => void;
  initialCountry?: string;
  suppressRouteSync?: boolean;
  lockCountryToInitial?: boolean;
  /** Adds the employee to this company instead of the active workspace. */
  companyId?: string;
};

export function useAddEmployeeForm({
  onClose,
  onAfterAdd,
  employeepage_instance = false,
  onEmployeeAdded,
  initialCountry,
  suppressRouteSync = true,
  lockCountryToInitial = false,
  companyId: companyIdOverride,
}: Options) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const duplicateManagerName = searchParams.get("manager_name") ?? undefined;
  const duplicateLevelName = searchParams.get("level_name") ?? undefined;

  const { companyId: workspaceCompanyId } = useWorkspaceScopedCompanyArgs();
  const companyId = companyIdOverride ?? workspaceCompanyId;
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];
  const { country } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const { getDepartments } = useDepartment();
  const { getLevels } = useLevel();
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries = (countriesResponse?.data?.data as ICountry[]) ?? [];

  const departmentOptions = useTransformToValueLabel(
    getDepartments?.data?.data as never,
  );
  const levelOptions = useTransformToValueLabel(getLevels?.data?.data as never);
  const countryItems = buildEmployeeCountrySelectItems(countries);

  const equipCountryName = useMemo(
    () => countries.find((item) => item.id === country?.id)?.name,
    [countries, country?.id],
  );

  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: buildEditEmployeeFormData(),
  });

  useAddEmployeeFormHydration({
    form,
    employeepage_instance,
    initialCountry,
    duplicateLevelName,
    levelData: getLevels?.data?.data,
    countries,
    equipCountryName,
  });

  const watchedFields = form.watch();

  useEffect(() => {
    if (suppressRouteSync) {
      return;
    }

    const subscription = form.watch((values) => {
      const nextQuery = buildAddEmployeeRouteQuery(values);
      const currentSearch = globalThis.location.search;

      if (
        !shouldReplaceAddEmployeeRoute(
          globalThis.location.pathname,
          currentSearch,
          nextQuery,
          employeepage_instance,
        )
      ) {
        return;
      }

      const basePath = employeepage_instance
        ? "/dashboard/employees"
        : "/dashboard/equip-employee/employees";
      const path = nextQuery ? `${basePath}?${nextQuery}` : basePath;

      router.replace(path);
    });

    return () => subscription.unsubscribe();
  }, [employeepage_instance, form, router, suppressRouteSync]);

  const [addEmployees, { isLoading: isSubmitting }] = useAddEmployeesMutation();

  const submit = form.handleSubmit(async (values) => {
    if (!companyId) return;

    const payload = {
      companyId,
      payload: values,
    } as AddEmployeeRequest;

    const res = await addEmployees(payload).unwrap();
    const newEmployee = res?.data as IEmployees;

    if (!employeepage_instance) {
      if (!employees || employees.length < 1) {
        dispatch(setSelectedEmployees([newEmployee]));
      } else {
        dispatch(setSelectedEmployees([...employees, newEmployee]));
      }
    }

    displaySuccessMessage(
      "Employee added successfully",
      "New employee has been added to the company roster.",
    );

    if (onEmployeeAdded) {
      onEmployeeAdded(newEmployee);
      form.reset(buildEditEmployeeFormData());
      onClose();
      onAfterAdd?.();
      return;
    }

    form.reset(buildEditEmployeeFormData());
    onClose();
    onAfterAdd?.();
  });

  const canSave = canSaveAddEmployee(watchedFields, companyId);
  const saveDisabledReason = getAddEmployeeSaveDisabledReason(
    watchedFields,
    companyId,
    isSubmitting,
  );

  return {
    form,
    submit,
    isSubmitting,
    canSave,
    saveDisabledReason,
    managerLabel: duplicateManagerName,
    departmentItems: toSelectItems(departmentOptions),
    levelItems: toSelectItems(levelOptions),
    countryItems,
    lockCountryToInitial,
  };
}
