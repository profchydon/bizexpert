import { ICart } from "@/types/cart";
import { getCartCountry } from "./cartCountry";

export interface AssignmentCountryFilter {
  code: string;
  label: string;
  countryId?: string;
}

interface FallbackCountry {
  id?: string;
  code?: string;
  name?: string;
}

export const buildAssignmentCountries = (
  carts: ICart[],
  fallbackCountry?: FallbackCountry,
): AssignmentCountryFilter[] => {
  const map = new Map<string, AssignmentCountryFilter>();

  carts.forEach((item) => {
    const { code, label } = getCartCountry(item);
    const normalizedCode = code.toUpperCase();

    if (map.has(normalizedCode)) {
      return;
    }

    map.set(normalizedCode, {
      code: normalizedCode,
      label,
      countryId:
        fallbackCountry?.code?.toUpperCase() === normalizedCode
          ? fallbackCountry.id
          : undefined,
    });
  });

  return Array.from(map.values());
};

export const buildAssignmentCountriesKey = (
  carts: ICart[],
  fallbackCountry?: FallbackCountry,
) =>
  buildAssignmentCountries(carts, fallbackCountry)
    .map((country) => `${country.code}:${country.countryId ?? ""}`)
    .sort((a, b) => a.localeCompare(b))
    .join("|");
