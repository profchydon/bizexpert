import { ICart } from "@/types/cart";

interface CartCountry {
  code: string;
  label: string;
}

const getCartCountry = (item: ICart): CartCountry => {
  const extended = item as ICart & {
    country?: { code?: string; name?: string; label?: string };
  };

  const code =
    extended.country?.code?.toUpperCase() ||
    (extended.country?.name || "").slice(0, 2).toUpperCase() ||
    (item.asset?.country || "").slice(0, 2).toUpperCase() ||
    "US";

  const label =
    extended.country?.label ||
    extended.country?.name ||
    item.asset?.country ||
    "Selected Country";

  return { code, label };
};

export { getCartCountry };
export type { CartCountry };
