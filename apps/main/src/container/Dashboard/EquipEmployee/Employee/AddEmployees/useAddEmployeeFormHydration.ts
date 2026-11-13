"use client";

import { useEffect, useRef } from "react";
import qs from "qs";
import { useSearchParams } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import type { EditEmployeeFormValues } from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import type { ICountry } from "@/types/auth";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  employeepage_instance?: boolean;
  initialCountry?: string;
  duplicateLevelName?: string;
  levelData?: unknown;
  countries?: ICountry[];
  equipCountryName?: string;
};

export function useAddEmployeeFormHydration({
  form,
  employeepage_instance,
  initialCountry,
  duplicateLevelName,
  levelData,
  countries,
  equipCountryName,
}: Props) {
  const searchParams = useSearchParams();
  const hasHydratedFromQueryRef = useRef(false);
  const formatLevelValueLabel = useTransformToValueLabel(levelData as never);
  const duplicateLevelOption = formatLevelValueLabel?.find(
    (item) => item.label === duplicateLevelName,
  );
  const countryOptions = useTransformToValueLabel(countries as never);
  const initialCountryOption = countryOptions?.find(
    (item) => item.label === initialCountry,
  );

  useEffect(() => {
    if (hasHydratedFromQueryRef.current) {
      return;
    }

    hasHydratedFromQueryRef.current = true;
    const queryObject = qs.parse(searchParams.toString(), {
      ignoreQueryPrefix: true,
    });
    const formValues = form.getValues();

    Object.keys(queryObject).forEach((key) => {
      if (key in formValues) {
        form.setValue(
          key as keyof EditEmployeeFormValues,
          queryObject[key] as never,
        );
      }
    });
  }, [form, searchParams]);

  useEffect(() => {
    if (duplicateLevelOption?.value) {
      form.setValue("level", duplicateLevelOption.value);
    }
  }, [duplicateLevelOption?.value, form]);

  useEffect(() => {
    if (initialCountryOption?.label) {
      form.setValue("country_id", initialCountryOption.label);
      return;
    }

    if (!employeepage_instance && equipCountryName) {
      form.setValue("country_id", equipCountryName);
    }
  }, [
    employeepage_instance,
    equipCountryName,
    form,
    initialCountryOption?.label,
  ]);
}
