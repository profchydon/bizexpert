import { subsidiariesSeed } from "../data/subsidiariesSeed";
import type { Subsidiary } from "../types";

export interface EntityOfficeRef {
  entityId: string;
  entityName: string;
}

const COUNTRY_TO_ENTITY_REGION: Record<string, string> = {
  Mexico: "United States",
  Uruguay: "United States",
  Brazil: "United States",
  Ireland: "United Kingdom",
  France: "Germany",
  Spain: "Germany",
  Netherlands: "Germany",
  Sweden: "Germany",
  Italy: "Germany",
  Switzerland: "Germany",
  Portugal: "Germany",
  Japan: "India",
  Singapore: "India",
  Malaysia: "India",
  Australia: "India",
};

function pickSubsidiary(
  country: string,
  subsidiaries: Subsidiary[] = subsidiariesSeed,
): Subsidiary {
  const active = subsidiaries.filter(
    (subsidiary) => subsidiary.status !== "closed",
  );
  const direct = active.find((subsidiary) => subsidiary.region === country);
  if (direct) return direct;
  const region = COUNTRY_TO_ENTITY_REGION[country];
  const mapped = region
    ? active.find((subsidiary) => subsidiary.region === region)
    : undefined;
  return (
    mapped ??
    active.find((subsidiary) => subsidiary.isPrimary) ??
    active[0] ??
    subsidiaries[0]
  );
}

export function resolveEntityOffice(
  country: string,
  _seed?: string,
  subsidiaries: Subsidiary[] = subsidiariesSeed,
): EntityOfficeRef {
  const subsidiary = pickSubsidiary(country, subsidiaries);
  return {
    entityId: subsidiary.id,
    entityName: subsidiary.name,
  };
}
