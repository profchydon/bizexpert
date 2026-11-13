import routes from "@/routes";

type SearchParamsLike =
  | {
      get: (key: string) => string | null;
    }
  | null
  | undefined;

type DeviceRefreshReduxSlice = {
  persistedReducers?: {
    equipEmployee?: {
      selectedEquipment?: unknown;
      refreshDeviceItems?: unknown[];
    };
  };
};

export const isDeviceRefreshSearchParam = (
  searchParams: SearchParamsLike,
): boolean => searchParams?.get("device-refresh") === "true";

const hasSelectedRefreshEquipment = (selected: unknown): boolean => {
  if (!selected) {
    return false;
  }
  if (Array.isArray(selected)) {
    return selected.length > 0;
  }
  return true;
};

export const hasDeviceRefreshReduxState = (
  state: DeviceRefreshReduxSlice,
): boolean => {
  const equip = state.persistedReducers?.equipEmployee;
  return (
    hasSelectedRefreshEquipment(equip?.selectedEquipment) ||
    (equip?.refreshDeviceItems?.length ?? 0) > 0
  );
};

export const isDeviceRefreshContext = (
  searchParams: SearchParamsLike,
  state: DeviceRefreshReduxSlice,
): boolean =>
  isDeviceRefreshSearchParam(searchParams) || hasDeviceRefreshReduxState(state);

export const shouldBlockAssignmentFlowForDeviceRefresh = (
  searchParams: SearchParamsLike,
): boolean => isDeviceRefreshSearchParam(searchParams);

export const buildDeviceRefreshMarketplaceHref = (
  searchParams: SearchParamsLike,
): string => {
  const params = new URLSearchParams({ "device-refresh": "true" });
  if (searchParams?.get("single-instance") === "true") {
    params.set("single-instance", "true");
  }
  return `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?${params.toString()}`;
};
