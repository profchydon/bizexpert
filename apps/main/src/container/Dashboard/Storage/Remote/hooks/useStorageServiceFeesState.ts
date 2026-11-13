"use client";

import { useMemo } from "react";
import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import type { CheckoutItem } from "./useStorageCheckout";
import {
  buildStorageServiceFeeTable,
  lineFeeForAction,
  subtotalForActions,
  type StorageServiceFeeTable,
} from "../utils/storageServiceFees";

export interface StorageServiceFeesValue {
  feeTable: StorageServiceFeeTable | null;
  isFeesLoading: boolean;
  isFeesReady: boolean;
  isFeesError: boolean;
  lineFee: (item: CheckoutItem) => number;
  subtotal: (items: CheckoutItem[]) => number;
}

export function useStorageServiceFeesState(): StorageServiceFeesValue {
  const { data, isLoading, isFetching, isError, isSuccess, isUninitialized } =
    useGetServiceFeesQuery(undefined, { refetchOnMountOrArgChange: true });
  const feeTable = useMemo(
    () => buildStorageServiceFeeTable(data?.data),
    [data],
  );
  const isFeesReady = isSuccess && feeTable !== null;
  const isFeesLoading =
    !isFeesReady && (isUninitialized || isLoading || isFetching);

  return {
    feeTable,
    isFeesLoading,
    isFeesReady,
    isFeesError: isError && !isFeesReady,
    lineFee: (item) => lineFeeForAction(item, feeTable),
    subtotal: (items) => subtotalForActions(items, feeTable),
  };
}

export type { StorageServiceFeeTable };
