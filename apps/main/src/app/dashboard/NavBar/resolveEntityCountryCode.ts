import lookup from "country-code-lookup";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";

export function resolveEntityCountryCode(
  country: EntityApiRecord["country"],
): string | undefined {
  if (!country) return undefined;

  if (typeof country === "object") {
    const code = country.code?.trim();
    if (code) return code.toUpperCase();
    const name = country.name?.trim();
    if (!name) return undefined;
    return lookup.byCountry(name)?.iso2?.toUpperCase();
  }

  const trimmed = country.trim();
  if (!trimmed) return undefined;
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();

  return (
    lookup.byCountry(trimmed)?.iso2?.toUpperCase() ??
    lookup.byIso(trimmed)?.iso2?.toUpperCase()
  );
}
