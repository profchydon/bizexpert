import { DeviceRefreshCountryRow } from "./filterDeviceRefreshCountries";

type PaginatedPayload = {
  data?: DeviceRefreshCountryRow[];
  current_page?: number;
  last_page?: number;
  total?: number;
};

const emptySummaryPage = () => ({
  countries: [] as DeviceRefreshCountryRow[],
  currentPage: 1,
  lastPage: 1,
  total: 0,
});

export const extractEquipmentSummaryPage = (
  payload?: PaginatedPayload | DeviceRefreshCountryRow[],
) => {
  if (!payload) return emptySummaryPage();

  if (Array.isArray(payload)) {
    return {
      countries: payload,
      currentPage: 1,
      lastPage: 1,
      total: payload.length,
    };
  }

  const countries = payload.data ?? [];

  return {
    countries,
    currentPage: payload.current_page ?? 1,
    lastPage: payload.last_page ?? 1,
    total: payload.total ?? countries.length,
  };
};
