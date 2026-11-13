import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetEquipEmployeeFeesQuery } from "@/api/baseQueries/feesApi/getEquipEmployeeFees";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { useTaxContext } from "./useTaxContext";
import { buildEquipEmployeeFeesPayload } from "@/container/Dashboard/Employees/OnboardDevices/buildEquipEmployeeFeesPayload";
import type { EquipReviewEmployee } from "@/container/Dashboard/Employees/OnboardDevices/equipTypes";
import type { CountryOption } from "@/container/Dashboard/Employees/OnboardDevices/resolveEmployeeCountryId";
import type { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";

interface Props {
  review: EquipReviewEmployee[] | undefined;
  equipEmployees: IEmployees[] | undefined;
  countries: CountryOption[];
  paymentMethod?: "Card" | "Credit";
}

const useEquipEmployeeFees = ({
  review,
  equipEmployees,
  countries,
  paymentMethod = "Credit",
}: Props) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const companyCountryId = getCompanyDetails()?.country?.id;
  const companyId = useWorkspaceCompanyId();
  const { mode: taxMode, config } = useTaxContext();

  const payload = useMemo(
    () =>
      buildEquipEmployeeFeesPayload({
        review: review ?? [],
        equipEmployees,
        countries,
        companyCountryId,
        paymentMethod,
      }),
    [review, equipEmployees, countries, companyCountryId, paymentMethod],
  );

  const feeQueryArgs =
    payload && companyId ? { ...payload, companyId } : skipToken;

  const { data, isLoading, isFetching, isError } =
    useGetEquipEmployeeFeesQuery(feeQueryArgs);

  const feesData = data?.data;
  const totalFeesSummary = feesData?.fee_summary;
  const totalFeesArray = useMemo(
    () => buildFeeRows(totalFeesSummary, taxMode, config),
    [totalFeesSummary, taxMode, config],
  );

  const getEmployeeFees = (employeeId?: string) => {
    if (!employeeId) return undefined;
    const employee = feesData?.[employeeId] as
      | { fees?: Record<string, unknown> }
      | undefined;
    return employee?.fees;
  };

  return {
    feesData,
    totalFeesArray,
    totalFeesSummary,
    getEmployeeFees,
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useEquipEmployeeFees;
