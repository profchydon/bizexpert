export interface ICredentials {
  id: string;
  company_id: string;
  public_key: null | string;
  secret_key: null | string;
  callback_url: null | string;
  webhook_url: null | string;
  status: "active" | "inactive" | "expired";
  created_at: string;
  updated_at: string;
}
