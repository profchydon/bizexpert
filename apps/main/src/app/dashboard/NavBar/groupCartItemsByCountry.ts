import { ICart } from "@/types/cart";
import { CartCountryMap } from "@/hooks/cartCountryMemory";

interface CountryGroup {
  country: { code: string; label: string };
  items: ICart[];
}

const groupCartItemsByCountry = (
  items: ICart[],
  fallback: { code: string; label: string },
  rememberedByPricing: CartCountryMap = {},
): CountryGroup[] => {
  const groups = new Map<string, CountryGroup>();

  const hasMeaningful = (value?: string) => {
    const normalized = (value || "").trim().toLowerCase();
    if (!normalized) {
      return false;
    }

    return normalized !== "selected country" && normalized !== "undefined";
  };

  items.forEach((item) => {
    const cartCountry = item as ICart & {
      country?: { code?: string; name?: string; label?: string };
    };
    const remembered = rememberedByPricing[item.pricing.id];
    const assetCountry = item.asset?.country;
    const code =
      (hasMeaningful(remembered?.code) ? remembered.code.toUpperCase() : "") ||
      (hasMeaningful(cartCountry.country?.code)
        ? cartCountry.country?.code?.toUpperCase()
        : "") ||
      (hasMeaningful(assetCountry)
        ? assetCountry.slice(0, 2).toUpperCase()
        : "") ||
      fallback.code;
    const label =
      (hasMeaningful(remembered?.label) ? remembered.label : "") ||
      (hasMeaningful(cartCountry.country?.label)
        ? cartCountry.country?.label
        : "") ||
      (hasMeaningful(cartCountry.country?.name)
        ? cartCountry.country?.name
        : "") ||
      (hasMeaningful(assetCountry) ? assetCountry : "") ||
      fallback.label;
    const existing = groups.get(code);

    if (existing) {
      existing.items.push(item);
      return;
    }

    groups.set(code, {
      country: { code, label },
      items: [item],
    });
  });

  const grouped = Array.from(groups.values());
  grouped.sort((a, b) => a.country.label.localeCompare(b.country.label));
  grouped.forEach((group) => {
    group.items.sort((a, b) => {
      const first = a.pricing?.created_at
        ? new Date(a.pricing.created_at).getTime()
        : 0;
      const second = b.pricing?.created_at
        ? new Date(b.pricing.created_at).getTime()
        : 0;
      return first - second;
    });
  });

  return grouped;
};

export type { CountryGroup };
export { groupCartItemsByCountry };
