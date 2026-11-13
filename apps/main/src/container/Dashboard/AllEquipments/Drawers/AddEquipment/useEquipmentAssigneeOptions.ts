"use client";

import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import useTransformEmployeeToValueLabel from "@/hooks/useTransformEmployeeToValueLabel";
import type { ICountry } from "@/types/auth";
import {
  employeeRowsFromListResponse,
  employeesForSelectedCountry,
  equipmentAssigneeEmployeeParams,
  findEquipmentCountryRecord,
} from "./equipmentAssigneeByCountry";

export function useEquipmentAssigneeOptions(
  companyId: string | undefined,
  countryName: string | null | undefined,
  countries: ICountry[] | undefined,
) {
  const selectedCountry = countryName?.trim() || "";
  const country = findEquipmentCountryRecord(countries, selectedCountry);
  const { data, isFetching, isUninitialized, isSuccess } = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: equipmentAssigneeEmployeeParams(country),
    },
    { skip: !companyId || !selectedCountry },
  );

  const employees = employeesForSelectedCountry(
    employeeRowsFromListResponse(data),
    selectedCountry,
  );
  const employeeOptions = useTransformEmployeeToValueLabel({ data: employees });

  return {
    employeeOptions,
    isEmployeesReady:
      Boolean(selectedCountry) && !isUninitialized && !isFetching && isSuccess,
  };
}
