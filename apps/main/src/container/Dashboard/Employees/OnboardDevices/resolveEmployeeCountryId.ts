import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";

export interface CountryOption {
  id?: string;
  name?: string;
  code?: string;
  country_code?: string;
}

interface EmployeeCountry {
  country?: unknown;
  country_code?: unknown;
}

const normalize = (value?: string | null): string =>
  (value ?? "").trim().toLowerCase();

export const resolveEmployeeCountry = (
  employee: EmployeeCountry | undefined,
  countries: CountryOption[] | undefined,
): CountryOption | undefined => {
  if (!employee) return undefined;

  const code = normalize(
    resolveCountryCode(employee.country_code, employee.country),
  );
  const name = normalize(resolveCountryText(employee.country));
  if (!code && !name) return undefined;

  return (countries ?? []).find((country) => {
    const countryCode = normalize(country.code ?? country.country_code);
    const countryName = normalize(country.name);
    return Boolean(
      (code && countryCode === code) || (name && countryName === name),
    );
  });
};

export const resolveEmployeeCountryId = (
  employee: EmployeeCountry | undefined,
  countries: CountryOption[] | undefined,
): string | undefined => resolveEmployeeCountry(employee, countries)?.id;
