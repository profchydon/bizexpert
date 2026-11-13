export interface EntityAdminInvitationEntity {
  id: string;
  name: string;
}

export interface EntityAdminInvitationAccountCompany {
  id: string;
  name: string;
}

export interface EntityAdminInvitation {
  id: string;
  email: string;
  user_id: string | null;
  user_invitation_code?: string | null;
  employee_invitation_code?: string | null;
  has_account?: boolean;
  company_id: string;
  account_company_id: string;
  office_id: string | null;
  scope_role: string;
  code: string;
  status: string;
  expires_at: string;
  entity: EntityAdminInvitationEntity;
  account_company: EntityAdminInvitationAccountCompany;
  created_at: string;
}

export interface AcceptEntityAdminInvitationData {
  membership_id: string;
  company_id: string;
  office_id: string | null;
  role_id: string;
}
