export type KitFulfillmentMode = "split" | "hold";
export type KitStatus = "draft" | "active" | "archived";

export interface IKitItemSummary {
  name: string | null;
  images: string[];
  quantity: number;
}

export interface IKitAssetSpecification {
  id?: string;
  name?: string | null;
  images?: string[] | null;
  category?: string | null;
  make?: string | null;
  model?: string | null;
  type?: string | null;
  spec_tier?: string | null;
  [key: string]: unknown;
}

export interface IKitItem {
  id: string;
  kit_id?: string;
  asset_specification_id: string;
  required: boolean;
  quantity: number;
  sort_order: number;
  asset_specification?: IKitAssetSpecification | null;
  created_at: string;
  updated_at: string;
}

export interface IKitListItem {
  id: string;
  name: string | null;
  status: KitStatus;
  is_archived: boolean;
  fulfillment_mode: KitFulfillmentMode | null;
  items_count: number;
  items_summary: IKitItemSummary[];
  updated_at: string;
}

export interface IKit {
  id: string;
  company_id: string;
  name: string | null;
  description: string | null;
  fulfillment_mode: KitFulfillmentMode | null;
  status: KitStatus;
  is_archived: boolean;
  items_count: number;
  items_summary: IKitItemSummary[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  items?: IKitItem[] | null;
}

export interface IKitListPayload {
  data: IKitListItem[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface IKitItemListPayload {
  data: IKitItem[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface IKitListParams {
  id?: string;
  status?: KitStatus | string;
  fulfillment_mode?: KitFulfillmentMode | string;
  search?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
  published_from?: string;
  published_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface IKitItemListParams {
  asset_specification_id?: string;
  required?: string;
  quantity_from?: number;
  quantity_to?: number;
  sort_order_from?: number;
  sort_order_to?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface IKitAssetsParams {
  country_id?: string;
  storage?: string;
  state?: string;
  RAM?: string;
  keyboard?: string;
  colour?: string;
  power_adapter?: string;
  os?: string;
  spec_tier?: string;
  warranty?: string;
  type?: string;
  category?: string;
  model?: string;
  make?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  favourites?: boolean;
  page?: number;
  per_page?: number;
}

export interface ICreateKitRequest {
  name: string;
  description?: string | null;
  fulfillment_mode: KitFulfillmentMode;
}

export interface IUpdateKitRequest {
  name?: string | null;
  description?: string | null;
  fulfillment_mode?: KitFulfillmentMode | null;
}

export interface ICreateKitItemPayload {
  asset_specification_id: string;
  required?: boolean;
  quantity?: number;
}

export interface IAddKitItemsRequest {
  items: ICreateKitItemPayload[];
}

export interface IUpdateKitItemRequest {
  asset_specification_id?: string;
  required?: boolean;
  quantity?: number;
  sort_order?: number;
}
