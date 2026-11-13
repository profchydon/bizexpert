export type EntityMembershipScope = "member" | "entity" | "office" | "global";

export interface EntityMembershipBillingArrangement {
  mode: string;
  invoice_to?: string;
  payment_method?: string;
}

export interface EntityMembership {
  id: string;
  name: string;
  is_primary: boolean;
  country: string;
  parent_company_id: string | null;
  role: string;
  scope: EntityMembershipScope | string;
  office_ids: string[];
  via_global_admin: boolean;
  billing_currency?: string;
  billing_status_badge?: string;
  offices_count?: number;
  billing_arrangement?: EntityMembershipBillingArrangement;
}
