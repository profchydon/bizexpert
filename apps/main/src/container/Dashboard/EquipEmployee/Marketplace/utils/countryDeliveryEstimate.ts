import { readCartCountryMap } from "@/hooks/cartCountryMemory";
import { formatDeliveryEstimate } from "./formatDeliveryEstimate";

export interface CountryEtaLookup {
  id?: string;
  name?: string;
  code?: string;
  eta?: string | null;
}

export interface SelectedCountry {
  id?: string;
  name?: string;
  code?: string;
}

export const resolveCountryEta = (
  selectedCountry: SelectedCountry | undefined,
  countries: CountryEtaLookup[],
): string | undefined => {
  const selectedCountryCode = selectedCountry?.code?.toUpperCase();
  const selectedCountryLabel = selectedCountry?.name;

  return (
    countries.find((item) => {
      if (selectedCountry?.id && item?.id === selectedCountry.id) {
        return true;
      }

      if (
        selectedCountryCode &&
        item?.code?.toUpperCase() === selectedCountryCode
      ) {
        return true;
      }

      return (
        (item?.name || "").toLowerCase() ===
        (selectedCountryLabel || "").toLowerCase()
      );
    })?.eta ?? undefined
  );
};

export const resolveDeliveryEstimate = (
  pricingId: string | undefined,
  selectedCountry: SelectedCountry | undefined,
  countries: CountryEtaLookup[],
): string => {
  const countryEta = resolveCountryEta(selectedCountry, countries);
  const rememberedDelivery = pricingId
    ? readCartCountryMap()[pricingId]?.eta
    : undefined;

  return formatDeliveryEstimate(countryEta || rememberedDelivery);
};
