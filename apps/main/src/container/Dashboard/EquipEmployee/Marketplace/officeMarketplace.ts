import routes from "@/routes";
import { regionCountryCode } from "@/container/Dashboard/Accounts/data/regionCountryCodes";

export interface OfficeMarketplaceCountry {
  id?: string;
  name?: string;
  code?: string;
  country_code?: string;
}

export function countryMatchesOfficeRegion(
  country: OfficeMarketplaceCountry | undefined,
  region: string,
) {
  const regionNorm = region.trim().toLowerCase();
  if (!regionNorm || !country) return false;
  const name = (country.name ?? "").trim().toLowerCase();
  const code = (country.code || country.country_code || "")
    .trim()
    .toLowerCase();
  const mapped = (regionCountryCode[region] ?? "").toLowerCase();
  return (
    name === regionNorm ||
    code === regionNorm ||
    Boolean(mapped && code === mapped)
  );
}

export function findCountryForOfficeRegion<T extends OfficeMarketplaceCountry>(
  countries: T[],
  region: string,
) {
  return countries.find((country) =>
    countryMatchesOfficeRegion(country, region),
  );
}

export function marketplaceWithOffice(officeId?: string | null) {
  if (!officeId) return routes.EQUIP_EMPLOYEE_MARKETPLACE;
  return `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?office=${encodeURIComponent(officeId)}`;
}

export function withOfficeQuery(url: string, officeId?: string | null) {
  if (!officeId) return url;
  if (/[?&]office=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}office=${encodeURIComponent(officeId)}`;
}
