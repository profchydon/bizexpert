interface StoredCartCountry {
  code: string;
  label: string;
  eta?: string;
}

type CartCountryMap = Record<string, StoredCartCountry>;

const CART_COUNTRY_STORAGE_KEY = "marketplace-cart-country-by-pricing";

const readCartCountryMap = (): CartCountryMap => {
  if (globalThis.window === undefined) {
    return {};
  }

  const raw = globalThis.localStorage.getItem(CART_COUNTRY_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as CartCountryMap;
  } catch {
    return {};
  }
};

const writeCartCountryMap = (map: CartCountryMap) => {
  if (globalThis.window === undefined) {
    return;
  }

  globalThis.localStorage.setItem(
    CART_COUNTRY_STORAGE_KEY,
    JSON.stringify(map),
  );
};

const setCartCountryForPricing = (
  pricingId: string,
  country: StoredCartCountry,
) => {
  const map = readCartCountryMap();
  map[pricingId] = country;
  writeCartCountryMap(map);
};

const removeCartCountryForPricing = (pricingId: string) => {
  const map = readCartCountryMap();
  if (!map[pricingId]) {
    return;
  }

  delete map[pricingId];
  writeCartCountryMap(map);
};

const clearCartCountryMap = () => {
  writeCartCountryMap({});
};

export type { StoredCartCountry, CartCountryMap };
export {
  readCartCountryMap,
  setCartCountryForPricing,
  removeCartCountryForPricing,
  clearCartCountryMap,
};
