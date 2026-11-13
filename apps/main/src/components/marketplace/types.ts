export type BadgeColor = "blue" | "purple" | "gray";

export interface MarketplaceCurrency {
  code?: string;
  name?: string;
  symbol?: string;
}

export interface MarketplacePrice {
  id: string;
  amount: string | number;
  currency: MarketplaceCurrency;
}

export interface MarketplaceSpecEntry {
  name: string;
  value: string;
}

export interface MarketplaceSpecification {
  id?: string;
  spec: MarketplaceSpecEntry[];
  price?: MarketplacePrice;
  isFavorited?: boolean;
  images?: string[];
}

export interface MarketplaceProduct {
  id: string;
  specId?: string;
  name: string;
  make?: string;
  model?: string;
  images: string[];
  spec: MarketplaceSpecEntry[];
  specifications?: MarketplaceSpecification[];
  price: MarketplacePrice;
  status?: string;
  isFavorited?: boolean;
  description?: string;
}

export interface MarketplaceCountryBadge {
  code?: string;
  label?: string;
}

export interface MarketplaceTypeFilterOption {
  id: string;
  name: string;
}

export interface MarketplaceFilterOptionsCatalog {
  type?: MarketplaceTypeFilterOption[];
  state?: string[];
  hardDrive?: string[];
  ram?: string[];
  os?: string[];
  processor?: string[];
  display?: string[];
  keyboard?: string[];
  powerAdapter?: string[];
  warranty?: string[];
  specTier?: string[];
  colour?: string[];
}

export interface MarketplacePriceRangeFilter {
  minPriceValue: number;
  maxPriceValue: number;
  setMinPriceValue: (value: number) => void;
  setMaxPriceValue: (value: number) => void;
  bounds?: [number, number] | null;
}

export interface MarketplaceMultiSelectFilter {
  selected: string[];
  setSelected: (values: string[]) => void;
}
