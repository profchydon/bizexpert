import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetBuyToStorageFeesQuery } from "@/api/baseQueries/feesApi/getBuyToStorageFees";
import { useGetOnboardingboardFeesQuery } from "@/api/baseQueries/feesApi/getOnboardingboardFees";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import dayjs from "dayjs";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { useTaxContext } from "./useTaxContext";
import {
  resolveOnboardItemCountryId,
  shouldSkipOnboardingFeeQuery,
} from "./onboardFeePayload";
import {
  buildOfficeCheckoutOrders,
  isOfficeRecipient,
} from "@/container/Dashboard/EquipEmployee/AssignmentFlow/officeCheckout";

function calculateTotalEquipment(data: any) {
  let totalEquipment = 0;

  Object.keys(data).forEach((key) => {
    data[key].assets?.forEach((equipment: any) => {
      totalEquipment += equipment.quantity;
    });
  });

  return totalEquipment;
}

function calculateTotalAssets(orders: Record<string, any>) {
  let totalAssets = 0;

  Object.values(orders).forEach((order) => {
    totalAssets += order.assets?.length || 0;
  });

  return totalAssets;
}

interface Props {
  employees: IEmployees | IEmployees[];
  paymentMethod?: "Card" | "Credit";
  buyToStorage?: boolean;
  employeeCountry?: string;
  isSignatureRequired?: boolean;
  skipFeeQuery?: boolean;
}

const useOnboardFeeAction = ({
  employees,
  paymentMethod,
  buyToStorage = false,
  employeeCountry,
  isSignatureRequired = false,
  skipFeeQuery = false,
}: Props) => {
  const { country: equipEmployeeCountry } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );
  const { data: countriesRes } = useGetCountriesQuery();
  const countries = countriesRes?.data?.data ?? [];

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const selectedMartketPlaceCountryId =
    equipEmployeeCountry?.id ?? employeeCountry;

  const employeeList = Array.isArray(employees) ? employees : [employees];

  const officeOrders = buildOfficeCheckoutOrders(employeeList);
  const orders = employeeList.reduce(
    (acc, employee) => {
      if (isOfficeRecipient(employee)) {
        return acc;
      }
      const equipments = employee?.items?.map((item) => {
        const shouldStore =
          item?.storage === true || Boolean(item?.storageDuration);
        return {
          employee_country_id: resolveOnboardItemCountryId({
            countries,
            item,
            selectedCountryId: selectedMartketPlaceCountryId,
          }),
          asset_pricing_id: item.pricing.id,
          quantity: item?.quantity,
          employee_id: shouldStore ? undefined : employee?.id,
          fulfillment_date: employee.fulfilment_date
            ? dayjs(employee.fulfilment_date).format("YYYY-MM-DD")
            : undefined,
          device_setup: item?.device_setup ? item?.device_setup : undefined,
          note: employee?.note ? employee?.note : undefined,
          storage: shouldStore ? true : undefined,
          storage_duration: item.storageDuration
            ? item.storageDuration
            : undefined,
          catalog_request_id: employee?.requestId
            ? // @ts-ignore
              employee?.requestId
            : undefined,
          signature_requested: isSignatureRequired,
        };
      });

      if (equipments?.length) {
        acc[employee.id!] = {
          assets: equipments,
        };
      }

      return acc;
    },
    {} as Record<string, any>,
  );

  const totalAssets = calculateTotalAssets(orders);

  const derivedEmployeeCountryId =
    Object.values(orders)
      .flatMap((order: any) => order?.assets ?? [])
      .find((asset: any) => Boolean(asset?.employee_country_id))
      ?.employee_country_id ??
    officeOrders[0]?.office_country_id ??
    selectedMartketPlaceCountryId;

  const hasPeopleOrders = Object.keys(orders).length > 0;
  const hasOfficeOrders = officeOrders.length > 0;
  const payload: any =
    hasPeopleOrders || hasOfficeOrders
      ? {
          payment_method: paymentMethod ?? "Credit",
          country_id: company?.country?.id!,
          service_type: "Onboarding",
          ...(hasPeopleOrders
            ? { employee_country_id: derivedEmployeeCountryId!, orders }
            : {}),
          ...(hasOfficeOrders ? { office_orders: officeOrders } : {}),
        }
      : undefined;

  const feeQueryArgs =
    payload && companyId ? { companyId, ...payload } : undefined;

  const {
    data: onboardingFeesRes,
    isLoading: isOnboardingLoading,
    isFetching: isOnboardingFetching,
    isError: isOnboardingError,
  } = useGetOnboardingboardFeesQuery(feeQueryArgs!, {
    skip:
      !feeQueryArgs ||
      shouldSkipOnboardingFeeQuery({
        buyToStorage,
        employeeCountryId: derivedEmployeeCountryId,
        hasPayload: Boolean(payload),
      }) ||
      skipFeeQuery,
  });

  const {
    data: buyToStorageFeesRes,
    isLoading: isBuyToStorageLoading,
    isFetching: isBuyToStorageFetching,
    isError: isBuyToStorageError,
  } = useGetBuyToStorageFeesQuery(feeQueryArgs!, {
    skip: !feeQueryArgs || !buyToStorage || skipFeeQuery,
  });

  const feesRes = buyToStorage ? buyToStorageFeesRes : onboardingFeesRes;
  const isLoading = buyToStorage ? isBuyToStorageLoading : isOnboardingLoading;
  const isFetching = buyToStorage
    ? isBuyToStorageFetching
    : isOnboardingFetching;
  const isError = buyToStorage ? isBuyToStorageError : isOnboardingError;

  const data = feesRes?.data;
  const totalFeesSummary = feesRes?.data?.fee_summary;

  let employeeFees;
  if (Array.isArray(employees)) {
    employeeFees = Object.fromEntries(
      employeeList.map((employee) => [employee.id, data?.[employee.id]?.fees]),
    );
  } else {
    employeeFees = data?.[employees.id]?.fees;
  }

  const totalEquipment = data ? calculateTotalEquipment(data) : 0;

  const { mode: taxMode, config } = useTaxContext();

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

export default useOnboardFeeAction;
