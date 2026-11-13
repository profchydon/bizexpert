import type { ICountry } from "@/types/auth";

export type WizardCountryOption = {
  value: string;
  label: string;
  code: string;
};

export function mapCountriesToWizardOptions(
  countries: ICountry[] | undefined,
): WizardCountryOption[] {
  if (!countries?.length) return [];

  return [...countries]
    .filter((country) => country.name?.trim() && country.code?.trim())
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((country) => ({
      value: country.name,
      label: country.name,
      code: country.code,
    }));
}
