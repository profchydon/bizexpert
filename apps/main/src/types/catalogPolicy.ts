export type CatalogPolicyStatus = "active" | "inactive";
export type CatalogPolicySelectionMode = "fixed" | "open" | "prohibit";
export type CatalogPolicyApprovalType = "auto" | "manual";
export type CatalogRuleType = "main" | "sub";
export type CatalogRuleTriggerMode = "manual" | "external_sync";
export type CatalogRuleTriggerSource =
  | "HRIS"
  | "ENTRA"
  | "GOOGLE_WORKSPACE"
  | "FINCH";
export type CatalogTriggerOutcome =
  | "matched"
  | "superseded"
  | "failed"
  | "resolved";

export interface CatalogPolicyApiNamedReference {
  id: string;
  name: string | null;
}

export interface CatalogPolicyApiJobTitleReference {
  value: string;
  normalized?: string | null;
}

export interface CatalogPolicyApiRuleKit {
  id: string;
  name?: string | null;
  status?: string | null;
  items_count?: number | null;
}

export interface CatalogPolicyApiRulePayload {
  selection_mode?: CatalogPolicySelectionMode | null;
  approval_type?: CatalogPolicyApprovalType | null;
  budget_per_employee?: number | null;
  trigger_mode?: CatalogRuleTriggerMode | null;
  trigger_sources?: CatalogRuleTriggerSource[] | null;
  external_sync_tools?: CatalogRuleTriggerSource[] | null;
  roles?: string[] | null;
  job_titles?: string[] | null;
  levels?: string[] | null;
  departments?: string[] | null;
  countries?: string[] | null;
  kits?: string[] | null;
  allow_item_swap?: boolean | null;
  include_storage?: boolean | null;
  storage_policy?: Record<string, unknown> | null;
  selection_config?: CatalogRuleSelectionConfig | null;
  is_active?: boolean;
  acknowledge_displacement?: boolean;
}

export interface CatalogPolicyApiRequest {
  name: string;
  description?: string | null;
  purpose?: string | null;
  status?: CatalogPolicyStatus;
  is_archived?: boolean;
  approver_ids?: string[] | null;
  rule?: CatalogPolicyApiRulePayload;
}

export interface CatalogPolicyApiRule extends Omit<
  CatalogPolicyApiRulePayload,
  "roles" | "job_titles" | "levels" | "departments" | "countries" | "kits"
> {
  id: string;
  catalog_id: string;
  type: CatalogRuleType;
  name: string | null;
  roles?: (string | CatalogPolicyApiNamedReference)[] | null;
  job_titles?: (string | CatalogPolicyApiJobTitleReference)[] | null;
  levels?: (string | CatalogPolicyApiNamedReference)[] | null;
  departments?: (string | CatalogPolicyApiNamedReference)[] | null;
  countries?: (string | CatalogPolicyApiNamedReference)[] | null;
  kits?: string[] | { data?: CatalogPolicyApiRuleKit[] } | null;
  inherited_fields?: string[] | null;
  specificity_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogPolicyApiPolicy {
  id: string;
  company_id: string;
  created_by: string | null;
  name: string;
  description: string | null;
  selection_mode: CatalogPolicySelectionMode | null;
  approval_type: CatalogPolicyApprovalType | null;
  approver_type?: "admin" | "line_manager" | "specific" | null;
  purpose: string | null;
  status: CatalogPolicyStatus;
  budget_per_employee: number | string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  main_rule?: CatalogPolicyApiRule | null;
  rules?: CatalogPolicyApiRule[] | { data?: CatalogPolicyApiRule[] } | null;
  approver_ids?: string[];
  approvers?: CatalogPolicyApiApprover[];
}

export interface CatalogRuleSelectionConfig {
  categories: {
    category_id: string;
    min: number | null;
    max: number | null;
  }[];
}

export interface CatalogPolicyApiApprover {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface CatalogPolicyListPayload {
  data: CatalogPolicyApiPolicy[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface CatalogPolicyListParams {
  name?: string;
  status?: CatalogPolicyStatus | string;
  selection_mode?: CatalogPolicySelectionMode;
  approval_type?: CatalogPolicyApprovalType;
  is_archived?: boolean;
  level_id?: string;
  department_id?: string;
  country_id?: string;
  purpose?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CatalogRuleListParams {
  name?: string;
  type?: CatalogRuleType;
  is_active?: boolean;
  is_archived?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CatalogRuleListPayload {
  data: CatalogPolicyApiRule[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface CatalogRuleConflictEmployee {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface CatalogRuleConflict {
  type: "red" | "amber";
  direction?: "outranks_existing" | "outranked_by_existing" | null;
  rule_id: string;
  rule_name: string | null;
  policy_id?: string | null;
  policy_name?: string | null;
  same_policy?: boolean | null;
  specificity_score: number;
  employees_count?: number | null;
  sample_employees?: CatalogRuleConflictEmployee[] | null;
  blocks_save_without_ack?: boolean | null;
  message?: string | null;
}

export interface CatalogRuleConflictsPayload {
  conflicts: CatalogRuleConflict[];
  has_red: boolean;
  has_amber: boolean;
  requires_acknowledgment: boolean;
}

export interface CatalogPolicyImpactedEmployee {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  job_title?: string | null;
  country_id: string | null;
  country?: string | null;
  country_code?: string | null;
  level?: string | null;
  roles?: Record<string, unknown>[];
  departments?: Record<string, unknown>[];
}

export interface CatalogPolicyImpactedEmployeeListPayload {
  data: CatalogPolicyImpactedEmployee[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
