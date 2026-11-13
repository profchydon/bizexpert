import type {
  CatalogPolicyApiRulePayload,
  CatalogRuleType,
} from "../../../../types/catalogPolicy";

export type CompanyCatalogArgs = { companyId: string; catalogId: string };
export type RuleArgs = CompanyCatalogArgs & { ruleId: string };
export type OrderRequestArgs = CompanyCatalogArgs & { orderRequestId: string };
export type CompanyOrderRequestArgs = {
  companyId: string;
  orderRequestId: string;
};

export type CreateCatalogRulePayload = CatalogPolicyApiRulePayload & {
  type: CatalogRuleType;
  name?: string | null;
};

export type CheckCatalogRuleConflictsPayload = {
  levels: string[];
  departments: string[];
  countries: string[];
};

export type CatalogOrderRequestsParams = {
  page?: number;
  per_page?: number;
  search?: string | null;
  status?: string | null;
};

export type CatalogOrderRequestApprovalStats = {
  approved_all_time?: number | string | null;
  approved_last_seven_days?: number | string | null;
  pending_approval_count?: number | string | null;
  pending_rfq_count?: number | string | null;
  rejected_all_time?: number | string | null;
  rejected_last_seven_days?: number | string | null;
};

export type CatalogOrderRequestApprovalStatsPayload = {
  approvers?: {
    id?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    catalogs?: { id?: string | null; name?: string | null }[];
    stats?: CatalogOrderRequestApprovalStats;
  }[];
  scope?: string;
  stats?: CatalogOrderRequestApprovalStats;
  window_days?: number | string | null;
};

export type RejectCatalogOrderRequestPayload = {
  reason: string;
};

export type ApproveCatalogOrderRequestPayload = {
  acknowledge_budget_warning?: boolean;
  additional_recipients?: string[];
  confirm_proceed_with_unavailable_items?: boolean;
  debit_wallet_on_approval?: boolean;
  note?: string;
  order_note?: string;
  payment_method?: "Card" | "Credit" | string | null;
  redirect_url?: string | null;
  signature_requested?: boolean;
};

export type ApproveOrderRequestArgs = OrderRequestArgs & {
  payload?: ApproveCatalogOrderRequestPayload;
};

export type SwapCatalogOrderRequestPayload = {
  acknowledge_budget_warning: boolean;
  acknowledge_category_change: boolean;
  acknowledge_existing_item: boolean;
  acknowledge_outside_kit_scope: boolean;
  quantity: number;
  reason: string;
  replacement_asset_specification_id: string;
};

export type SwapOrderRequestArgs = OrderRequestArgs & {
  originalKitItemId: string;
  payload: SwapCatalogOrderRequestPayload;
};

export type ConvertCatalogOrderRequestToRfqDevice = {
  asset_type?: string;
  budget_per_unit: number;
  description?: string;
  kit_item_id: string;
  name?: string;
  quantity: number;
};

export type ConvertCatalogOrderRequestToRfqPayload = {
  devices: ConvertCatalogOrderRequestToRfqDevice[];
};

export type ConvertOrderRequestToRfqArgs = OrderRequestArgs & {
  payload: ConvertCatalogOrderRequestToRfqPayload;
};
