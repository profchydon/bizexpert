import { useCallback, useMemo } from "react";

import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import type { EquipEmployeeInitiateReq } from "@/api/baseQueries/companiesApi/transactionsApi/equipEmployeePayment";
import { buildEquipEmployeeInitiatePayload } from "@/container/Dashboard/Employees/OnboardDevices/buildEquipEmployeeInitiatePayload";
import type { CountryOption } from "@/container/Dashboard/Employees/OnboardDevices/resolveEmployeeCountryId";
import useEquipEmployeeFees from "@/hooks/useEquipEmployeeFees";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetEquipEmployees,
  resetEquipReview,
  resetSelectedEmployees,
} from "@/store/slices/employeeSlice";

interface Props {
  enabled: boolean;
  companyCountryId?: string;
  additionalEmails: string[];
  isSignatureRequired: boolean;
  note: string;
  paymentMethod: "Card" | "Credit";
}

export interface BuildInitiateArgs {
  redirectUrl: string;
  paymentMethod: "Card" | "Bank" | "Credit";
}

export const useEquipEmployeeCheckout = ({
  enabled,
  companyCountryId,
  additionalEmails,
  isSignatureRequired,
  note,
  paymentMethod,
}: Props) => {
  const dispatch = useAppDispatch();
  const review = useAppSelector(
    (state) => state.persistedReducers.employee?.equipReview,
  );
  const equipEmployees = useAppSelector(
    (state) => state.persistedReducers.employee?.equipEmployees,
  );

  const { data: countriesRes } = useGetCountriesQuery();
  const countries = useMemo<CountryOption[]>(
    () => countriesRes?.data?.data ?? countriesRes?.data ?? [],
    [countriesRes],
  );

  const {
    totalFeesArray,
    totalFeesSummary,
    getEmployeeFees,
    isLoading,
    isError,
  } = useEquipEmployeeFees({
    review: enabled ? review : undefined,
    equipEmployees,
    countries,
    paymentMethod,
  });

  const totalEquipment = useMemo(
    () =>
      (review ?? []).reduce(
        (sum, employee) =>
          sum +
          employee.devices.reduce(
            (count, device) => count + device.quantity,
            0,
          ),
        0,
      ),
    [review],
  );

  const build = useCallback(
    ({
      redirectUrl,
      paymentMethod: method,
    }: BuildInitiateArgs): EquipEmployeeInitiateReq | undefined =>
      buildEquipEmployeeInitiatePayload({
        review,
        equipEmployees,
        countries,
        companyCountryId,
        paymentMethod: method,
        redirectUrl,
        additionalRecipients: additionalEmails,
        isSignatureRequired,
        note,
      }),
    [
      review,
      equipEmployees,
      countries,
      companyCountryId,
      additionalEmails,
      isSignatureRequired,
      note,
    ],
  );

  const onSuccess = useCallback(() => {
    dispatch(resetEquipReview());
    dispatch(resetEquipEmployees());
    dispatch(resetSelectedEmployees());
  }, [dispatch]);

  const checkout = enabled ? { build, onSuccess } : null;

  return {
    checkout,
    getEmployeeFees,
    isError,
    isLoading,
    totalEquipment,
    totalFeesArray,
    totalFeesSummary,
  };
};
