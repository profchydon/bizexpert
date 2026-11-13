export type EntityBillingStatusBadge =
  | "operational"
  | "card_pending"
  | "card_only"
  | "suspended"
  | "delegated"
  | "closed";

export type EntityBillingResponsibility = "self" | "delegated";

export type EntityCreditState = "card_only" | "assessing" | "active_credit";

export interface EntityDelegatedPayer {
  id: string;
  name: string;
  billing_currency: string;
}

export interface EntityCountryRef {
  id: string;
  name: string;
  code: string;
  currency_code?: string;
  currency_symbol?: string;
  payment_processor?: string;
}

export interface EntityBillingArrangement {
  mode: "self_billing" | "delegated";
  invoice_to: string;
  payment_method: string;
}

export interface EntityApiRecord {
  id: string;
  name: string;
  email: string;
  country: string | EntityCountryRef;
  parent_company_id: string | null;
  is_primary: boolean;
  billing_currency: string;
  billing_responsibility: EntityBillingResponsibility;
  delegated_payer_id: string | null;
  lifecycle_status: string;
  credit_state: string;
  card_captured: boolean;
  permanent_card_only: boolean;
  billing_status_badge: EntityBillingStatusBadge | string;
  credit_label: string;
  credit_check: string;
  billing_arrangement: EntityBillingArrangement;
  delegated_payer: EntityDelegatedPayer | null;
  offices_count: number;
  created_at: string;
  updated_at: string;
}

export interface EntitiesListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export interface EntitiesListPayload {
  data: EntityApiRecord[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface EntityConsent {
  processor: string;
  url?: string;
  session_id?: string;
  card_captured?: boolean;
  customer_id?: string;
  environment?: string;
}

export interface CreateEntityRequest {
  name: string;
  email: string;
  country?: string;
  billing_currency?: string;
  return_path?: string;
  delegated_payer_id?: string | null;
  admin_user_ids?: string[];
  admin_emails?: string[];
}

export interface CreateEntityData extends EntityApiRecord {
  consent?: EntityConsent | null;
}

export interface UpdateEntityRequest {
  name?: string;
  admin_user_ids?: string[];
}
