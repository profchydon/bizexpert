export interface CatalogOrderRequestListPayload {
  data?: CatalogOrderRequestApi[];
  requests?: CatalogOrderRequestApi[];
  order_requests?: CatalogOrderRequestApi[];
  pending_approvals?: CatalogOrderRequestApi[];
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

export interface CatalogOrderRequestApi {
  id: string;
  catalog_id?: string | null;
  catalog_rule_id?: string | null;
  catalog_policy_id?: string | null;
  employee_id?: string | null;
  policy_id?: string | null;
  status?: string | null;
  employee?: CatalogOrderRequestEmployee | null;
  catalog?: NamedEntity | null;
  catalog_policy?: NamedEntity | null;
  policy?: NamedEntity | null;
  matched_rule?: NamedEntity | null;
  rule?: NamedEntity & { allow_item_swap?: boolean | null };
  kit?: NamedEntity | null;
  items?:
    | CatalogOrderRequestItem[]
    | { data?: CatalogOrderRequestItem[] }
    | null;
  allow_item_swap?: boolean | null;
  fulfillment?: CatalogOrderRequestFulfillment | null;
  order_id?: string | null;
  order_note?: string | null;
  total_amount?: string | number | null;
  budget_evaluation?: CatalogOrderRequestBudgetEvaluation | null;
  currency?: string | CatalogOrderRequestCurrency | null;
  created_at?: string | null;
  updated_at?: string | null;
  approved_at?: string | null;
  actioned_by?: ActionedBy | null;
  approved_by?: string | ActionedBy | null;
  approver?: ActionedBy | null;
  rejected_by?: ActionedBy | null;
  rejection_reason?: string | null;
  order?: { order_number?: string | null } | null;
  rfqs?: CatalogOrderRequestRfq[] | null;
}

export interface CatalogOrderRequestRfq {
  id?: string | null;
  request_id?: string | null;
  status?: string | null;
}

export interface CatalogOrderRequestEmployee {
  id?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  address?: string | null;
  country_code?: string | null;
  country_id?: string | null;
  employment_type?: string | null;
  employee_type?: string | null;
  phone_number?: string | null;
  phone?: string | null;
  role?: string | null;
  job_title?: string | null;
  level?: string | NamedEntity | null;
  country?: string | NamedEntity | null;
}

export interface CatalogOrderRequestItem {
  id?: string | null;
  asset_pricing_id?: string | null;
  asset_specification_id?: string | null;
  kit_item_id?: string | null;
  name?: string | null;
  category?: string | NamedEntity | null;
  quantity?: number | string | null;
  amount?: number | string | null;
  budget_per_unit?: number | string | null;
  tier?: string | null;
  source?: string | null;
  lead_time_days?: number | string | null;
  image_url?: string | null;
  images?: string[] | null;
  product?: ProductEntity | null;
  asset?: ProductEntity | null;
  rfq_resolution?: CatalogOrderRequestRfqResolution | null;
}

export interface CatalogOrderRequestRfqResolution {
  status?: string | null;
  accepted?: boolean | null;
  declined?: boolean | null;
}

export interface CatalogOrderRequestCurrency {
  id?: string | null;
  code?: string | null;
  name?: string | null;
  symbol?: string | null;
}

export interface CatalogOrderRequestBudgetEvaluation {
  budget?: number | string | null;
  total?: number | string | null;
  committed_total?: number | string | null;
  is_exceeded?: boolean | null;
  breakdown?: Record<string, number | string | null> | null;
}

export interface CatalogOrderRequestFulfillment {
  summary?: {
    marketplace_count?: number | string | null;
    rfq_count?: number | string | null;
    storage_count?: number | string | null;
    unavailable_count?: number | string | null;
  } | null;
  marketplace?: unknown[] | null;
  rfq?: unknown[] | null;
  storage?: unknown[] | null;
  unavailable?: unknown[] | null;
}

interface NamedEntity {
  id?: string | null;
  name?: string | null;
  code?: string | null;
}

interface ProductEntity extends NamedEntity {
  images?: string[] | null;
  image_url?: string | null;
  category?: string | NamedEntity | null;
}

interface ActionedBy {
  id?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}
