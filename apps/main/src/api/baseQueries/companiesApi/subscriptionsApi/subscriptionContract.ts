export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "pending_payment"
  | "past_due"
  | "suspended"
  | "cancelled"
  | "expired";

export interface SubscriptionPlanSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ScheduledPlanChange {
  plan_id: string;
  plan: SubscriptionPlanSummary | null;
  at: string | null;
}

export interface ExpiredSubscription {
  plan: SubscriptionPlanSummary | null;
  period: { start: string | null; end: string | null };
}

export interface SubscriptionContract {
  id: string;
  company_id: string;
  status: SubscriptionStatus;
  payment_method: "stripe_card" | "airwallex_invoice" | null;
  currency: string;
  plan: SubscriptionPlanSummary | null;
  period: { start: string | null; end: string | null };
  expired_from: ExpiredSubscription | null;
  scheduled_change: ScheduledPlanChange | null;
}

export type EntitlementValueType =
  | "boolean"
  | "numeric_limit"
  | "metered"
  | "retention"
  | "addon";

export interface SubscriptionEntitlement {
  code: string;
  name: string;
  value_type: EntitlementValueType;
  value: string;
  unit: string | null;
  allowed: boolean;
  unlimited: boolean;
  usage: number;
  remaining: number | null;
  soft_warning: boolean;
}

export interface SubscriptionEntitlementSnapshot {
  company_id: string;
  plan: SubscriptionPlanSummary | null;
  status: SubscriptionStatus;
  entitlements: SubscriptionEntitlement[];
}

export type BillingInvoiceStatus = "open" | "paid" | "void";

export interface BillingInvoiceDeviceRate {
  count: number;
  rate: string;
  rate_display: string;
}

export interface SubscriptionBillingInvoice {
  id: string;
  number: string;
  billed_on: string;
  plan: SubscriptionPlanSummary | null;
  device_count: number;
  devices: {
    company: BillingInvoiceDeviceRate;
    byod: BillingInvoiceDeviceRate;
  } | null;
  provider: "stripe" | "airwallex" | "";
  external_id: string | null;
  status: BillingInvoiceStatus | string;
  currency: string;
  amount: string;
  amount_display: string;
  paid_at: string | null;
  period: { start: string | null; end: string | null };
  links: { view: string | null; download: string | null };
}

export interface SubscriptionBillingInvoiceList {
  data: SubscriptionBillingInvoice[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface SubscriptionPlanChangeResult {
  action: "upgrade" | "downgrade_scheduled" | "same_or_lateral";
  quote: {
    currency: string;
    amount: number;
    effective_at: string | null;
    requires_payment: boolean;
  };
  contract: SubscriptionContract;
  collection: {
    status: "applied" | "pending_payment" | null;
    invoice: { amount: number; currency: string; status: string } | null;
    tx_ref: string | null;
    link: string | null;
  } | null;
}

export interface SubscriptionPlanChangeVerifyResult {
  tx_ref: string;
  status: string;
  plan: SubscriptionPlanSummary | null;
  contract: SubscriptionContract;
}
