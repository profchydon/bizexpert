type Specification = {
  id?: string;
  spec?: { value?: string }[];
  asset_pricing?: { id?: string };
};

type CountryChoice = {
  id?: string;
  name?: string;
  code?: string;
};

export function marketplaceAssetCountryId(
  selectedCountryId?: string,
  companyCountryId?: string,
) {
  return selectedCountryId || companyCountryId || undefined;
}

export function marketplaceDisplayCountry(
  selected?: CountryChoice,
  companyCountry?: CountryChoice,
) {
  if (selected?.id) return selected;
  if (!companyCountry?.id) return undefined;
  return {
    id: companyCountry.id,
    name: companyCountry.name,
    code: companyCountry.code,
  };
}

export function isMarketplaceProductDetailsPending(input: {
  hasAsset: boolean;
  isError: boolean;
}) {
  return !input.isError && !input.hasAsset;
}

export function resolveMarketplaceSpecification<T extends { id?: string }>(
  specifications: T[] | undefined,
  specId?: string,
) {
  if (!specifications?.length) return undefined;
  return (
    specifications.find((spec) => spec.id && spec.id === specId) ??
    specifications[0]
  );
}

export function specificationSummary(spec?: Specification) {
  return (
    spec?.spec
      ?.map((item) => item.value)
      .filter(Boolean)
      .join(" ") ?? ""
  );
}

export function marketplacePricingId(
  spec?: Specification,
  assetPricingId?: string,
) {
  return spec?.asset_pricing?.id ?? assetPricingId;
}
