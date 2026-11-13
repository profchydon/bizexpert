import { regionCountryCode } from "../data/regionCountryCodes";
import type { Subsidiary } from "../types";

export function entityMatchesCountry(
  entity: Subsidiary,
  country: string | null | undefined,
  countryCode?: string | null,
) {
  if (!country?.trim()) return true;

  const target = country.trim().toLowerCase();
  const code = countryCode?.trim().toLowerCase();
  const entityCountry = entity.region?.trim().toLowerCase();
  if (!entityCountry) return false;

  if (entityCountry === target) return true;
  if (code && entityCountry === code) return true;

  const selectedCode = regionCountryCode[country.trim()]?.toLowerCase();
  if (selectedCode && entityCountry === selectedCode) return true;

  const entityName = Object.entries(regionCountryCode)
    .find(([, value]) => value.toLowerCase() === entityCountry)?.[0]
    ?.toLowerCase();

  return entityName === target;
}

export function filterEntitiesByCountry(
  entities: Subsidiary[],
  country: string | null | undefined,
  countryCode?: string | null,
) {
  if (!country?.trim()) return entities;
  return entities.filter((entity) =>
    entityMatchesCountry(entity, country, countryCode),
  );
}
