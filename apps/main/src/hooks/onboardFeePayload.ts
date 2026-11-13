import type { ICart } from "@/types/cart";

interface CountryOption {
  id?: string;
  code?: string;
  name?: string;
}

export function resolveOnboardItemCountryId({
  countries,
  item,
  selectedCountryId,
}: {
  countries: CountryOption[];
  item: ICart & {
    country?: { id?: string; code?: string; name?: string; label?: string };
  };
  selectedCountryId?: string;
}) {
  if (item.pricing?.country_id) return item.pricing.country_id;
  if (item.country?.id) return item.country.id;

  const countryCode = item.country?.code?.trim().toLowerCase();
  if (countryCode) {
    const match = countries.find(
      (country) => country.code?.trim().toLowerCase() === countryCode,
    );
    if (match?.id) return match.id;
  }

  const countryLabel = (
    item.country?.label ||
    item.country?.name ||
    item.asset?.country ||
    ""
  )
    .trim()
    .toLowerCase();

  if (countryLabel) {
    const match = countries.find(
      (country) => country.name?.trim().toLowerCase() === countryLabel,
    );
    if (match?.id) return match.id;
  }

  return selectedCountryId;
}

export function shouldSkipOnboardingFeeQuery({
  buyToStorage,
  employeeCountryId,
  hasPayload,
}: {
  buyToStorage: boolean;
  employeeCountryId?: string;
  hasPayload: boolean;
}) {
  return !hasPayload || buyToStorage || !employeeCountryId;
}
