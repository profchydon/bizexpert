import { IAsset } from "./assets";
import { IEquipment } from "./equipments";

export interface ICancellationStatus {
  can_cancel: boolean;
  instant?: boolean;
  has_pending_request: boolean;
  pending_request_id: string | null;
  status: string;
  cutoff_reason?: string | null;
  cutoff_message?: string | null;
}

export interface ICancellationRequestedBy {
  id: string;
  name: string;
  email: string;
}

export interface ICancellationRequest {
  id: string;
  order_id: string;
  suborder_id: string | null;
  suborder_type: string | null;
  company_id: string;
  type: string;
  status: string;
  reason: string;
  additional_details: string | null;
  previous_order_status: Record<string, string>;
  admin_notes: string | null;
  requested_by: ICancellationRequestedBy;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  refund_preview?: ICancellationRefundPreview | null;
  refund_status?: string | null;
}

export interface ICancellationRefundPreview {
  currency: string;
  payment_method: string;
  rail: string;
  amount_paid: number;
  spent_services?: number;
  refundable_before_fee?: number;
  gateway_fee?: number;
  net_refund: number;
  rows?: Array<{
    label: string;
    value: number | string;
    deduction?: boolean;
    note?: string;
    kind?: "payment" | "subtotal" | "deduction" | "total";
  }>;
  policy_rules?: string[];
}

export interface IOrder {
  id: string;
  company_id?: string;
  subsidiary_id?: string;
  order_number: string;
  status:
    | "in_progress"
    | "completed"
    | "awaiting"
    | "processing"
    | "cancelled"
    | "awaiting_cancellation";
  total_amount: string;
  employee_count: number;
  type?: string;
  country: string;
  country_code: string;
  ordered_by: string;
  payment_method: string;
  transaction_id?: string | null;
  quantity: string;
  sub_orders?: ISubOrder[];
  order_date: string;
  budget_count?: string;
  catalog?: string;
  currency?: string;
  no_of_items?: string;
  signature_required?: boolean | null;
  signature_requested?: boolean | null;
  signature_status?: "not_required" | "required" | "partial_required";
  cancellation_status?: ICancellationStatus;
  cancellation_requests?: ICancellationRequest[];
  pending_cancellation_request?: ICancellationRequest | null;
  cancellation_refund_preview?: ICancellationRefundPreview | null;
  delivery_date_meta?: {
    expected_delivery_on?: string;
    expected_delivery_previous_on?: string;
    expected_delivery_delta_days?: number;
    completed_on?: string | null;
  };
}

export interface IOrderParty {
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  landmark?: string;
  job_title?: string;
  country?: string;
  country_code?: string;
  employment_type?: string;
}

export interface IOrderDetails {
  from?: IOrderParty;
  to?: IOrderParty;
  collection_date_start?: string | null;
  collection_date_end?: string | null;
  estimated_price?: string | number;
  duration?: string;
  [key: string]: unknown;
}

export type VerificationContext = "pickup" | "delivery";

export interface IEvents {
  id: string;
  asset_order_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ITrackingEvent {
  id: string;
  storage_request_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ISubOrder {
  id: string;
  employee_id: string;
  employee_first_name: string;
  employee_last_name: string;
  address: string;
  job_title: null | string;
  status:
    | "in_progress"
    | "completed"
    | "awaiting"
    | "pending"
    | "awaiting_cancellation"
    | "verification_pending";
  recipient_type?: "employee" | "office";
  office_id?: string | null;
  office_name?: string | null;
  office_address?: string | null;
  contact_employee_id?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  assets: IAsset[];
  events: IEvents[];
  equipment?: IEquipment;
  equipment_id?: string;
  action?: string;
  quantity?: number;
  storage_duration?: number | string;
  amount?: string;
  total_amount?: string | number;
  type?: "reassign" | "storage" | "resale" | "buy_to_storage";
  collection_date?: string;
  collection_date_start?: string | null;
  collection_date_end?: string | null;
  order_details?: IOrderDetails;
  signature_required?: boolean | null;
  signature_requested?: boolean | null;
  signature_status?: "not_required" | "required" | "partial_required";
  order_number?: string;
  tracking_no?: string;
  external_tracking_link?: string | null;
  courier_name?: string | null;
  tracking_events?: ITrackingEvent[];
  note?: unknown[];
  storage_location?: string;
  cancellation_status?: ICancellationStatus;
  cancellation_requests?: ICancellationRequest[];
  pending_cancellation_request?: ICancellationRequest | null;
  employee_note?: string;
  employee_verified_at?: string;
  employee_landmark?: string;
  verification_status?: string;
  pending_contexts?: string[];
  pickup_verification_status?: string;
  delivery_verification_status?: string;
}
