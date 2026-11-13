import { Clipboard, Laptop01, Safe, Users01 } from "@untitledui/icons";
import routes from "@/routes";
import type { CountryEntry } from "./types";

export const buildCountryMetricLinks = (country: CountryEntry) => {
  const encodedName = encodeURIComponent(country.name);

  return [
    {
      icon: Users01,
      label: `${country.employees} Employees`,
      href:
        country.employees > 0
          ? `${routes.EMPLOYEES}?countryId=${encodedName}`
          : undefined,
    },
    {
      icon: Laptop01,
      label: `${country.equipment} Equipment`,
      href:
        country.equipment > 0
          ? `${routes.ASSET_VAULT}?ci=${country.countryId}&cn=${encodedName}`
          : undefined,
    },
    {
      icon: Safe,
      label: `${country.storage} Items stored`,
      href:
        country.storage > 0
          ? `${routes.STORAGE}/${country.countryId}`
          : undefined,
    },
    {
      icon: Clipboard,
      label: `${country.catalogs} Catalogs`,
      href: country.catalogs > 0 ? routes.CATALOGS : undefined,
    },
  ].filter((row) => row.href);
};
