export type DeviceRefreshCountryRow = {
  country_id?: string;
  country_name?: string;
  country_code?: string;
  average_age?: string;
  overdue_count?: number;
};

const matchesCountryName = (name: string, normalized: string): boolean => {
  if (!normalized) return true;
  if (normalized.length >= 3) return name.includes(normalized);
  return name.split(/\s+/).some((word) => word.startsWith(normalized));
};

export const filterDeviceRefreshCountries = (
  countries: DeviceRefreshCountryRow[] | undefined,
  query: string,
): DeviceRefreshCountryRow[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return countries ?? [];

  return (countries ?? []).filter((country) => {
    const name = country.country_name?.toLowerCase() ?? "";
    const code = country.country_code?.toLowerCase() ?? "";
    return matchesCountryName(name, normalized) || code === normalized;
  });
};
