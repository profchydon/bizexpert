export interface OfficeAdminOption {
  value: string;
  label: string;
  email?: string;
  country?: string;
  countryCode?: string;
}

export interface CompanyUserRow {
  id?: string | number | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  country?: { name?: string | null; code?: string | null } | string | null;
  country_code?: string | null;
}

export function countryFieldsFromUser(user: CompanyUserRow): {
  country?: string;
  countryCode?: string;
} {
  if (typeof user.country === "string") {
    return {
      country: user.country,
      countryCode: user.country_code ?? undefined,
    };
  }

  return {
    country: user.country?.name ?? undefined,
    countryCode: user.country?.code ?? user.country_code ?? undefined,
  };
}

export function toOfficeAdminOption(user: CompanyUserRow): OfficeAdminOption {
  const email = user.email?.trim();
  return {
    value: String(user.id ?? ""),
    label: [user.first_name, user.last_name].filter(Boolean).join(" "),
    ...(email ? { email } : {}),
    ...countryFieldsFromUser(user),
  };
}

export function adminOptionMatchesCountry(
  option: OfficeAdminOption,
  country: string | null | undefined,
): boolean {
  const target = country?.trim().toLowerCase();
  if (!target) return false;
  return (
    option.country?.trim().toLowerCase() === target ||
    option.countryCode?.trim().toLowerCase() === target
  );
}

export function filterAdminOptionsByCountry(
  options: OfficeAdminOption[],
  country: string | null | undefined,
): OfficeAdminOption[] {
  if (!country?.trim()) return [];
  return options.filter((option) => adminOptionMatchesCountry(option, country));
}

export function applyAdminCountryScope(
  options: OfficeAdminOption[],
  country: string | null | undefined,
  filterByCountry: boolean,
): OfficeAdminOption[] {
  if (!filterByCountry) return options;
  return filterAdminOptionsByCountry(options, country);
}

export function mergeAdminOptions(
  current: OfficeAdminOption[],
  incoming: OfficeAdminOption[],
  page: number,
): OfficeAdminOption[] {
  const base = page <= 1 ? [] : current;
  const seen = new Set(base.map((option) => option.value));
  return [...base, ...incoming.filter((option) => !seen.has(option.value))];
}
