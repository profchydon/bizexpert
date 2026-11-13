import countryToCurrency from "country-to-currency";
import type {
  AddressComponent,
  I_Location,
  LatLng,
  ParsedAddress,
} from "./types";

export function parseAddressComponents(
  components: AddressComponent[],
): ParsedAddress {
  const parsed: ParsedAddress = {
    country: "",
    state: "",
    city: "",
    street: "",
    streetNumber: "",
    isoCode: "",
  };

  for (const component of components) {
    if (component.types.includes("street_number")) {
      parsed.streetNumber = component.long_name;
    } else if (component.types.includes("route")) {
      parsed.street = component.long_name;
    } else if (component.types.includes("locality")) {
      parsed.city = component.long_name;
    } else if (component.types.includes("administrative_area_level_1")) {
      parsed.state = component.long_name;
    } else if (component.types.includes("country")) {
      parsed.country = component.long_name;
      parsed.isoCode = component.short_name;
    }
  }

  return parsed;
}

export function streetAddressError(parsed: ParsedAddress): string | null {
  if (!parsed.street || !parsed.streetNumber) {
    return "Please select a valid street address with a street number.";
  }
  return null;
}

export function countryMismatchError(
  parsed: ParsedAddress,
  specificCountry: string | null,
): string | null {
  if (specificCountry && parsed.isoCode !== specificCountry) {
    return `Selected address is not within the specified country (${specificCountry}).`;
  }
  return null;
}

export function currencyCodeForIso(isoCode: string): string {
  return (
    (countryToCurrency as Record<string, string | undefined>)[isoCode] ?? ""
  );
}

export function buildOfficeLocation(
  address: string,
  latLng: LatLng,
  parsed: ParsedAddress,
): I_Location {
  return {
    lat: latLng.lat,
    lng: latLng.lng,
    address,
    street: `${parsed.streetNumber} ${parsed.street}`,
    city: parsed.city,
    state: parsed.state,
    country: parsed.country,
    isoCode: parsed.isoCode,
    currencyCode: currencyCodeForIso(parsed.isoCode),
    streetNumber: parsed.streetNumber,
  };
}
