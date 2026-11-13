import { IEquipment } from "@/types/equipments";

type CountryRecord = {
  id?: string;
  name?: string;
  code?: string;
  country_code?: string;
};

export type ResolvedDeviceRefreshCountry = {
  id?: string;
  name?: string;
  code?: string;
};

export const normalizeEquipmentItems = (
  item?: IEquipment | IEquipment[],
): IEquipment[] => {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
};

export const resolveDeviceRefreshCountry = (
  items: IEquipment[],
  urlCountryId?: string | null,
  urlCountryName?: string | null,
  countries?: CountryRecord[],
): ResolvedDeviceRefreshCountry => {
  const equipment = items[0];
  const findById = (id?: string | null) =>
    countries?.find((country) => country.id === id);
  const findByName = (name?: string | null) =>
    countries?.find(
      (country) => country.name?.toLowerCase() === name?.toLowerCase(),
    );
  const findByCode = (code?: string | null) =>
    countries?.find(
      (country) =>
        (country.code ?? country.country_code)?.toUpperCase() ===
        code?.toUpperCase(),
    );

  const fromCatalog =
    findById(urlCountryId) ??
    findByName(urlCountryName ?? equipment?.country) ??
    findByCode(equipment?.country_code);

  return {
    id: fromCatalog?.id ?? urlCountryId ?? undefined,
    name:
      fromCatalog?.name ?? urlCountryName ?? equipment?.country ?? undefined,
    code:
      fromCatalog?.code ??
      fromCatalog?.country_code ??
      equipment?.country_code ??
      undefined,
  };
};
