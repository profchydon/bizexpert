import { ISubscription } from "./subscriptions";
import { ITaxContextPayload, TaxDisplayMode } from "./tax";

export interface IUser {
  created_at: string;
  email: string;
  first_name: string;
  id: string;
  phone?: string;
  job_title: string;
  address: string;
  employment_type?: string;
  last_name: string;
  stage: string;
  role: string;
  status: string;
  updated_at: string;
  company_id?: string;
  country_id?: string;
}

export interface ICompany {
  id: string;
  sso_id: string;
  agreement_signed_at?: string;
  auto_approve_join_requests?: boolean;
  tax_display_mode?: TaxDisplayMode;
  tax_context?: ITaxContextPayload;
  name: string;
  industry: null | string;
  phone: string;
  email: string;
  address: null | string;
  city: null | string;
  state: null | string;
  country: ICountry;
  size: null | string;
  trading_name?: null | string;
  currency_code: string;
  billing_currency?: string | null;
  billing_currency_code?: string | null;
  website?: null | string;
  latitude?: string;
  longitude?: string;
  created_at?: Date | string;
  updated_at: Date;
  subscription?: ISubscription | null;
}

export interface ICountry {
  id: string;
  name: string;
  currency_code: string;
  currency_symbol: string;
  code: string;
  payment_processor: string;
  status: string;
  created_at: string;
  updated_at: string;
  currency_id: string;
}

export interface IImpersonationSession {
  admin_id: string;
  admin_name: string;
  company_id: string;
  expires_at: string;
}
