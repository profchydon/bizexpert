import { ICompany } from "./auth";
import { IPlan } from "./plans";

export interface ISubscriptionCompany extends ICompany {
  base_country?: {
    id: string;
    name: string;
    code: string;
    states: string[];
    currency_code: string;
    payment_processor: string;
    delivery_eta: null | string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  billing_currency?: string | null;
  card_brand?: string | null;
  card_last_four?: string | null;
  card_exp_month?: number | null;
  card_exp_year?: number | null;
}

export interface ISubscriptionPrice {
  id: string;
  plan_id: string;
  currency_code: string;
  amount: string;
  billing_cycle: string;
  slug: string;
  plan_slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface ISubscription {
  id: string;
  plan: IPlan;
  price: ISubscriptionPrice;
  started_at: string;
  end_date: string;
  company: ISubscriptionCompany;
  status: string;
}
