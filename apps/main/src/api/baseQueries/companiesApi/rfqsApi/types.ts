export interface RfqCountry {
  id: string;
  name: string;
  code: string;
}

export interface RfqDevice {
  name: string;
  description: string | null;
  asset_type: string;
  quantity: number;
  budget_per_unit: string;
  total_budget: string;
  specification?: Record<string, string> | null;
}

export interface RfqResponseDevice {
  id?: string;
  name: string;
  description: string | null;
  availability: boolean | "quote" | "alternative" | "unavailable" | string;
  quote_per_unit: string | null;
  sub_total_quote: string;
  quantity: number;
}

export interface RfqResponse {
  id: string;
  devices: RfqResponseDevice[];
  total_quote: string;
  note: string | null;
  response_expired?: boolean;
  response_expires_at?: string | null;
  created_at: string;
}

export interface RfqCatalogOrderRequest {
  id: string;
  catalog_id: string;
  catalog?: {
    id?: string;
    name?: string;
  } | null;
}

export interface RfqRecord {
  id: string;
  catalog_order_request?: RfqCatalogOrderRequest | null;
  country: RfqCountry;
  currency: string;
  request_id: string;
  devices: RfqDevice[];
  total_request_budget: string;
  response: RfqResponse | null;
  status: string;
  response_expired?: boolean;
  response_expires_at?: string | null;
  customer_rejection_reason?: string | null;
  client_rejection_reason: string | null;
  approved_at?: string | null;
  created_at: string;
  expires_at?: string | null;
}

export interface RfqFilterCountry {
  id: string;
  name: string;
  code: string;
}

export interface RfqBudgetRangeFilter {
  min: string;
  max: string;
}

export interface RfqListFilters {
  countries: RfqFilterCountry[];
  asset_types: string[];
  budget_range: RfqBudgetRangeFilter;
}

export interface RfqListData {
  rfqs: RfqRecord[];
  filters?: RfqListFilters;
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export type RfqListResponseData = RfqRecord[] | RfqListData;

export interface GetRfqsParams {
  asset_type?: string;
  status?: string;
  country_id?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}
