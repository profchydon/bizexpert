import { skipToken } from "@reduxjs/toolkit/query";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetRenewStorageFeeQuery } from "@/api/baseQueries/feesApi/getRenewStorageFee";
import { useGetStorageOnboardingFeesQuery } from "@/api/baseQueries/feesApi/getStorageOnboardingFees";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import dayjs from "dayjs";
import { useTaxContext } from "./useTaxContext";

function calculateTotalEquipment(data: any) {
  let totalEquipment = 0;

  Object.keys(data).forEach((key) => {
    data[key].equipment?.forEach((equipment: any) => {
      totalEquipment += equipment.quantity;
    });
  });

  return totalEquipment;
}

function calculateTotalAssets(orders: Record<string, any>) {
  let totalAssets = 0;

  Object.values(orders).forEach((order) => {
    totalAssets += order.equipment?.length || 0;
  });

  return totalAssets;
}

function useOnboardingFees(
  payload: Record<string, unknown> | undefined,
  companyId: string | undefined,
  enabled: boolean,
) {
  return useGetStorageOnboardingFeesQuery(
    payload && companyId && enabled
      ? ({ ...payload, companyId } as Parameters<
          typeof useGetStorageOnboardingFeesQuery
        >[0])
      : skipToken,
  );
}

function useRenewStorageFees(
  payload: Record<string, unknown> | undefined,
  companyId: string | undefined,
  enabled: boolean,
) {
  return useGetRenewStorageFeeQuery(
    payload && companyId && enabled
      ? ({ ...payload, companyId } as Parameters<
          typeof useGetRenewStorageFeeQuery
        >[0])
      : skipToken,
  );
}

interface Props {
  employees: IEmployees | IEmployees[];
  paymentMethod?: "Card" | "Credit";
  renewInstance?: boolean;
  isSignatureRequired?: boolean;
}

const useStorageOnboardFeeAction = ({
  employees,
  paymentMethod,
  renewInstance,
  isSignatureRequired = false,
}: Props) => {
  const { country: equipEmployeeCountry } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const employee_country_id = equipEmployeeCountry?.id;
  const { mode: taxMode, config } = useTaxContext();

  const employeeList = Array.isArray(employees) ? employees : [employees];

  const orders = employeeList.reduce(
    (acc, employee) => {
      let equipments: unknown;

      if (!renewInstance) {
        equipments = employee?.items?.map((item: any) => ({
          equipment_id: item.id!,
          quantity: 1,
          employee_id: !item.storageDuration ? employee?.id : undefined,
          fulfillment_date: employee.fulfilment_date
            ? dayjs(employee.fulfilment_date).format("YYYY-MM-DD")
            : undefined,
          device_setup: item?.device_setup ? item?.device_setup : undefined,
          note: employee?.note ? employee?.note : undefined,
          signature_requested: isSignatureRequired,
        }));
      } else {
        equipments = employee?.items?.map((item: any) => ({
          equipment_id: item.id!,
          storage_duration: `${item?.storageDuration} ${item?.storageDuration > 1 ? "months" : "month"}`,
          quantity: 1,
        }));
      }

      if ((equipments as IEmployees[])?.length) {
        acc[employee.id!] = { equipment: equipments! };
      }

      return acc;
    },
    {} as Record<string, any>,
  );

  const totalAssets = calculateTotalAssets(orders);

  const payload: any =
    orders && Object.keys(orders).length > 0
      ? {
          payment_method: paymentMethod ?? "Credit",
          country_id: company?.country?.id,
          service_type: !renewInstance ? "Onboarding" : "Storage",
          employee_country_id: employee_country_id,
          orders,
        }
      : undefined;

  const {
    data: onboardData,
    isLoading: isOnboardLoading,
    isFetching: isOnboardFetching,
    isError: isOnboardError,
  } = useOnboardingFees(payload, companyId, !renewInstance);

  const {
    data: renewStorageData,
    isLoading: isRenewStorageLoading,
    isFetching: isRenewStorageFetching,
    isError: isRenewStorageError,
  } = useRenewStorageFees(payload, companyId, renewInstance as boolean);

  const feesRes = renewInstance ? renewStorageData : onboardData;
  const isLoading = renewInstance ? isRenewStorageLoading : isOnboardLoading;
  const isFetching = renewInstance ? isRenewStorageFetching : isOnboardFetching;
  const isError = renewInstance ? isRenewStorageError : isOnboardError;

  const data = feesRes?.data ?? feesRes;
  // @ts-ignore
  const totalFeesSummary = data?.fee_summary;

  let employeeFees;
  if (!Array.isArray(employees)) {
    // @ts-ignore
    employeeFees = data?.[employees.id]?.fees;
  } else {
    employeeFees = Object.fromEntries(
      // @ts-ignore
      employeeList.map((employee) => [employee.id, data?.[employee.id]?.fees]),
    );
  }

  const totalEquipment = data ? calculateTotalEquipment(data) : 0;

  const totalFeesArray = buildFeeRows(totalFeesSummary, taxMode, config);

  return {
    isLoading: isFetching || isLoading,
    isError,
    data,
    employeeFees,
    totalFeesSummary,
    totalFeesArray,
    totalAssets,
    totalEquipment,
    payload,
  };
};

export default useStorageOnboardFeeAction;
