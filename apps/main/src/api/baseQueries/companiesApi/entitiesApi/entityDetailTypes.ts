import type { ServerOffice } from "@/types/offices";
import type { EntityApiRecord, EntityCountryRef } from "./types";

export interface EntityPersonRef {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface EntityPersonListPayload {
  data: EntityPersonRef[];
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

export type EntityPersonListInput =
  | EntityPersonRef[]
  | EntityPersonListPayload
  | null
  | undefined;

export interface EntityParentRef {
  id: string;
  name: string;
}

export interface EntityCostCentreSpendRow {
  id: string;
  name: string;
  country: string | EntityCountryRef;
  spend_this_month: number | null;
}

export interface EntityCostCentreSpend {
  entities: EntityCostCentreSpendRow[];
  total_this_month: number | null;
}

export interface EntityCloseReadinessCheck {
  code: string;
  passed: boolean;
  message: string;
  count?: number;
}

export interface EntityCloseReadiness {
  can_close: boolean;
  authorized_admin: boolean;
  active_offices: number;
  outstanding_ar: number;
  checks: EntityCloseReadinessCheck[];
  blockers: string[];
}

export interface EntityFootprintPayload {
  scope?: string;
  company_id?: string;
  employees?: number | null;
  assets?: number | null;
}

export interface EntityDetailApiRecord extends EntityApiRecord {
  parent?: EntityParentRef | null;
  admins?: EntityPersonListInput;
  offices?: ServerOffice[];
  employees_count?: number | null;
  assets_count?: number | null;
  footprint?: EntityFootprintPayload | null;
  created_by?: EntityPersonRef | null;
  cost_centre_spend?: EntityCostCentreSpend | null;
  close_readiness?: EntityCloseReadiness | null;
}
