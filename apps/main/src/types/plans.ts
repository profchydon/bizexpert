export interface IPlanPrice {
  id: string;
  plan_id: string;
  currency_code: string;
  amount: string;
  billing_cycle: string;
  slug: string;
  plan_slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface IPlanFeatures {
  id: string;
  name: string;
  description: string;
  available_as_addon: boolean;
  pricing: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  laravel_through_key: string;
}

export interface IPlan {
  id: string;
  name: string;
  description: string;
  preceding_plan_name: null | string;
  features: IPlanFeatures[];
  price: IPlanPrice;
  offers: string[];
  slug: string;
  status: string;
}
