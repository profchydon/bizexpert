import type { MarketplaceFilterOptionsCatalog } from "../types";

export interface MarketplaceApiFilters {
  type?: Array<{ id?: string; name?: string }>;
  state?: string[];
  hard_drive?: string[];
  ram?: string[];
  os?: string[];
  processor?: string[];
  display?: string[];
  keyboard?: string[];
  power_adapter?: string[];
  warranty?: string[];
  spec_tier?: string[];
  colour?: string[];
  price_bounds?: {
    min_price?: number | null;
    max_price?: number | null;
  } | null;
}

export const toMarketplaceFilterOptionsCatalog = (
  apiFilters?: MarketplaceApiFilters | null,
): MarketplaceFilterOptionsCatalog => ({
  type: (apiFilters?.type ?? [])
    .filter((item): item is { id: string; name: string } =>
      Boolean(item?.id && item?.name),
    )
    .map((item) => ({ id: item.id, name: item.name })),
  state: apiFilters?.state,
  hardDrive: apiFilters?.hard_drive,
  ram: apiFilters?.ram,
  os: apiFilters?.os,
  processor: apiFilters?.processor,
  display: apiFilters?.display,
  keyboard: apiFilters?.keyboard,
  powerAdapter: apiFilters?.power_adapter,
  warranty: apiFilters?.warranty,
  specTier: apiFilters?.spec_tier,
  colour: apiFilters?.colour,
});

export const priceBoundsToFilterRange = (
  bounds?: MarketplaceApiFilters["price_bounds"],
): [number, number] | null => {
  if (
    bounds?.min_price == null ||
    bounds?.max_price == null ||
    bounds.min_price > bounds.max_price
  ) {
    return null;
  }

  return [Math.floor(bounds.min_price), Math.ceil(bounds.max_price)];
};
