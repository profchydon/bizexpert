import type { IDashboardCountrySummary } from "@/types/dashboard";
import type { CountryEntry } from "./types";

export const mapDashboardCountrySummary = (
  items: IDashboardCountrySummary[],
): CountryEntry[] =>
  items.map((item) => ({
    code: item.country_code.toUpperCase(),
    countryId: item.country_id,
    name: item.country,
    employees: item.employee_count,
    equipment: item.equipment_count,
    storage: item.equipment_in_storage_count,
    catalogs: item.catalog_count,
  }));
