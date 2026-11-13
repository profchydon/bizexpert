import type {
  CatalogRuleTriggerSource,
  CatalogTriggerOutcome,
} from "./catalogPolicy";

export type CatalogTriggerHistoryMode = "manual" | "external_sync" | "override";

export interface CatalogTriggerHistory {
  id: string;
  catalog_id: string;
  rule_id: string | null;
  rule_name: string | null;
  employee_id: string;
  employee_email: string | null;
  trigger_mode: CatalogTriggerHistoryMode;
  trigger_source: CatalogRuleTriggerSource | null;
  outcome: CatalogTriggerOutcome;
  failure_payload: Record<string, unknown> | null;
  context_payload: Record<string, unknown> | null;
  resolution_events?: CatalogTriggerResolutionEvent[] | null;
  created_at: string;
}

export interface CatalogTriggerResolutionEvent {
  id: string;
  resolved_by: string;
  resolution_payload: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
}

export interface CatalogTriggerHistoryListParams {
  rule_id?: string;
  employee_id?: string;
  trigger_mode?: CatalogTriggerHistoryMode;
  trigger_source?: CatalogRuleTriggerSource;
  outcome?: CatalogTriggerOutcome;
  created_from?: string;
  created_to?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CatalogTriggerHistoryListPayload {
  data: CatalogTriggerHistory[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface TriggerCatalogRuleRequest {
  employee_id: string;
  context_payload?: Record<string, unknown> | null;
  acknowledge_existing_benefit?: boolean;
}

export interface ResolveTriggerHistoryRequest {
  resolution_payload?: Record<string, unknown> | null;
  notes?: string | null;
}
