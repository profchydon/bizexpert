"use client";

import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import {
  hasDeviceRefreshReduxState,
  isDeviceRefreshContext,
  isDeviceRefreshSearchParam,
} from "@/utils/isDeviceRefreshContext";

export function useDeviceRefreshContext(): boolean {
  const searchParams = useSearchParams();
  const hasReduxState = useAppSelector((state) =>
    hasDeviceRefreshReduxState(state),
  );
  return isDeviceRefreshSearchParam(searchParams) || hasReduxState;
}

export function useDeviceRefreshContextDetailed() {
  const searchParams = useSearchParams();
  const hasReduxState = useAppSelector((state) =>
    hasDeviceRefreshReduxState(state),
  );
  const fromSearchParam = isDeviceRefreshSearchParam(searchParams);
  return {
    active: fromSearchParam || hasReduxState,
    fromSearchParam,
    fromReduxState: hasReduxState,
    searchParams,
  };
}

export { isDeviceRefreshContext };
