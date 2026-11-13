import { IEvents } from "./orders";

export interface IAssetCategory {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface IPrice {
  amount: string;
  id: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
}

export interface ISpec {
  name: string;
  value: string;
}

export interface ISpecification {
  price?: IPrice;
  id?: string;
  is_favourite?: boolean;
  properties: ISpec[];
  spec: ISpec[];
  spec_id?: string;
  asset_pricing?: IPrice;
  images?: string[];
}

export interface IAsset {
  id: string;
  asset_id: string;
  asset_order_id?: string;
  asset_spec_id: string;
  is_favourite?: boolean;
  name: string;
  description: string;
  year: string;
  type: string;
  make: string;
  model: string;
  category: string;
  assetCode: string;
  status: string;
  spec: ISpec[];
  country: string;
  asset_pricing: IPrice;
  createdAt: string;
  updatedAt: string;
  specifications?: ISpecification[];
  images: string[];
  events?: IEvents[];
}
