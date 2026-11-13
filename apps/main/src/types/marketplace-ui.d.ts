declare module "@raydahq/marketplace-ui" {
  import type { ComponentType } from "react";
  import type { IPrice, ISpec } from "./assets";

  export interface MarketplaceSpecification {
    id?: string;
    spec: ISpec[];
    price?: IPrice;
    isFavorited?: boolean;
    images?: string[];
  }

  export interface MarketplaceProduct {
    id: string;
    specId: string;
    name: string;
    make: string;
    model: string;
    images: string[];
    spec: ISpec[];
    specifications?: MarketplaceSpecification[];
    price: IPrice;
    status: string;
    isFavorited?: boolean;
    description: string;
  }

  export const FilterPanel: ComponentType<Record<string, unknown>>;
  export const ProductDetail: ComponentType<Record<string, unknown>>;
  export const ProductCard: ComponentType<Record<string, unknown>>;
  export const FavoritesFilterBanner: ComponentType<Record<string, unknown>>;
  export const LocalTimeBanner: ComponentType<Record<string, unknown>>;
  export const MarketplaceEmptyState: ComponentType<Record<string, unknown>>;
}
