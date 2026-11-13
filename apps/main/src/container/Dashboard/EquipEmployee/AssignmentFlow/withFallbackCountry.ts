import { ICart } from "@/types/cart";
import { readCartCountryMap } from "@/hooks/cartCountryMemory";

interface FallbackCountry {
  code?: string;
  name?: string;
}

const hasMeaningfulCountryValue = (value?: string) => {
  const normalized = (value || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return normalized !== "selected country" && normalized !== "undefined";
};

const withFallbackCountry = (
  items: ICart[],
  fallbackCountry?: FallbackCountry,
) => {
  const rememberedByPricing = readCartCountryMap();

  return items.map((item) => {
    const remembered = rememberedByPricing[item.pricing.id];
    if (remembered?.label) {
      return {
        ...item,
        country: {
          code: remembered.code,
          name: remembered.label,
          label: remembered.label,
        },
      } as ICart;
    }

    if (!fallbackCountry?.name) {
      return item;
    }

    const extended = item as ICart & {
      country?: { code?: string; name?: string; label?: string };
    };

    const hasExistingCountry =
      hasMeaningfulCountryValue(extended.country?.name) ||
      hasMeaningfulCountryValue(extended.country?.label) ||
      hasMeaningfulCountryValue(item.asset?.country);

    if (hasExistingCountry) {
      return item;
    }

    return {
      ...item,
      country: {
        code: fallbackCountry.code,
        name: fallbackCountry.name,
        label: fallbackCountry.name,
      },
    } as ICart;
  });
};

export default withFallbackCountry;
