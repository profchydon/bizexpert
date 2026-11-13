export type ServerOfficeType = "physical" | "remote";

export interface OfficeEntityRef {
  id: string;
  name: string;
  billing_currency?: string | null;
  country?: string | null;
}

export interface ServerOfficeArea {
  id: string;
  name: string;
  office_id?: string;
  asset_count?: number;
}

export interface OfficeAssetMixSlice {
  type: string;
  count: number;
}

export interface OfficeSnapshot {
  employees: number;
  assets: number;
  asset_value: number;
  asset_mix: OfficeAssetMixSlice[];
  awaiting_placement?: number;
}

export interface OfficeCloseBlocker {
  code: string;
  count: number;
  message: string;
}

export interface OfficeCloseReadiness {
  can_close: boolean;
  employees: number;
  assets: number;
  blockers: OfficeCloseBlocker[];
}

export interface OfficePersonRef {
  id?: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

export interface ServerOffice {
  id: string;
  company_id: string;
  name: string;
  street_address: string | null;
  country: string | null;
  state: string | null;
  currency_code: string | null;
  currency_inherited: boolean;
  type: ServerOfficeType;
  status: string;
  is_primary: boolean;
  entity: OfficeEntityRef | null;
  areas: ServerOfficeArea[];
  created_by?: OfficePersonRef | null;
  created_at: string;
  updated_at: string;
}

export interface OfficeAdminsPage {
  data?: OfficePersonRef[] | null;
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

export interface ServerOfficeDetail extends ServerOffice {
  snapshot: OfficeSnapshot;
  office_admins?: OfficePersonRef[] | OfficeAdminsPage | null;
  close_readiness: OfficeCloseReadiness;
}

export interface CreateOfficePayload {
  name: string;
  type: ServerOfficeType;
  street_address?: string;
  subsidiary_id?: string;
  admin_user_ids?: string[];
  admin_emails?: string[];
}

export interface UpdateOfficePayload {
  name?: string;
  type?: ServerOfficeType;
  street_address?: string | null;
}

export interface ServerEntity {
  id: string;
  name: string;
  email?: string | null;
  country: string | null;
  parent_company_id: string | null;
  is_primary: boolean;
  billing_currency: string | null;
  lifecycle_status: string;
  offices_count: number;
  created_at: string;
  updated_at: string;
}

export interface OfficeAssignmentResult {
  office_id: string;
  office_area_id?: string | null;
  updated: number;
}
