"use client";

import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import {
  useGetStorageActionFeesQuery,
  type StorageActionFeePaymentMethod,
} from "@/api/baseQueries/feesApi/getStorageActionFees";
import { toStorageActionFeeOrders } from "@/api/baseQueries/feesApi/storageActionFeeOrders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { useTaxContext } from "@/hooks/useTaxContext";
import { useStorageServerCart } from "@/container/Dashboard/Storage/Remote/hooks/useStorageServerCart";
import {
  resolveStorageActionCountryId,
  storageActionCountryNameFromItems,
} from "./storageActionFeeCountry";

export function useStorageActionFees(
  enabled: boolean,
  paymentMethod: StorageActionFeePaymentMethod = "Credit",
  fallbackCountryName?: string,
) {
  const companyId = useWorkspaceCompanyId();
  const { items, isLoading: isCartLoading } = useStorageServerCart();
  const { data: countriesRes, isLoading: isCountriesLoading } =
    useGetCountriesQuery(undefined, {
      skip: !enabled,
    });
  const countries = countriesRes?.data?.data ?? [];
  const countryName =
    storageActionCountryNameFromItems(items) ?? fallbackCountryName;
  const countryId = resolveStorageActionCountryId(countries, countryName);
  const orders = useMemo(
    () => (companyId ? toStorageActionFeeOrders(items, companyId) : []),
    [companyId, items],
  );
  const { mode: taxMode, config } = useTaxContext();
  const { data, isLoading, isFetching, isError } = useGetStorageActionFeesQuery(
    enabled && companyId && countryId && orders.length > 0
      ? {
          companyId,
          payment_method: paymentMethod,
          country_id: countryId,
          orders,
        }
      : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const totalFeesSummary = data?.data?.fee_summary;
  const totalFeesArray = useMemo(
    () => buildFeeRows(totalFeesSummary, taxMode, config),
    [config, taxMode, totalFeesSummary],
  );

  return {
    totalFeesSummary,
    totalFeesArray,
    countryId,
    orders,
    isLoading:
      (enabled &&
        (!countryId || orders.length === 0) &&
        (isCartLoading || isCountriesLoading)) ||
      isLoading ||
      isFetching,
    isError,
  };
}
