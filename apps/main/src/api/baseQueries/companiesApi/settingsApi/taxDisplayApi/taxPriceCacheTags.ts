export const TAX_DISPLAY_COMPANY_TAGS = ["TaxDisplay", "Catalogs"] as const;

export const TAX_PRICE_CACHE_TAGS_BY_SLICE = {
  assetsApi: ["Assets"],
  cartApi: ["Cart"],
  feesApi: ["Fees"],
} as const;

export const TAX_PRICE_CACHE_SLICE_KEYS = [
  "companiesApi",
  ...Object.keys(TAX_PRICE_CACHE_TAGS_BY_SLICE),
] as const;
