import { Country, ICountry } from "country-state-city";

export type CountryCoordinateInput = {
  country: string;
  country_code?: string;
};

export type CountryMapCoordinate = {
  lat: number;
  lng: number;
  address: string;
  flag?: string;
  flags?: string;
};

function findCountryRecord(
  input: CountryCoordinateInput,
): ICountry | undefined {
  if (input.country_code) {
    const byCode = Country.getCountryByCode(input.country_code.toUpperCase());
    if (byCode) {
      return byCode;
    }
  }

  const normalizedCountry = input.country.trim().toLowerCase();

  return Country.getAllCountries().find(
    (country) => country.name.toLowerCase() === normalizedCountry,
  );
}

export function mapCountriesToCoordinates(
  items: CountryCoordinateInput[],
): CountryMapCoordinate[] {
  return items.flatMap((item) => {
    const countryRecord = findCountryRecord(item);

    if (!countryRecord?.latitude || !countryRecord?.longitude) {
      return [];
    }

    const lat = Number(countryRecord.latitude);
    const lng = Number(countryRecord.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return [];
    }

    return [
      {
        lat,
        lng,
        address: item.country,
        flag: countryRecord.flag,
      },
    ];
  });
}
