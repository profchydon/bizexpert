export interface DeliveryInfo {
  recipient_name: string;
  street_address: string;
  apartment_suite: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country?: string | null;
  country_code?: string | null;
  phone_number: string;
  alternative_contact: string | null;
  email?: string | null;
  employment_type?: string | null;
}

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface VerificationAssetOrder {
  sub_order_id: string;
  quantity: number;
  asset?: {
    id: string;
    name: string;
    description?: string;
    images?: string | string[] | null;
  };
  equipment?: {
    id: string;
    title: string;
    serial_number?: string | null;
    status?: string;
    images?: string | string[] | null;
  };
  fulfillment_date?: string;
  tracking_no?: string;
  status?: string;
}

export interface VerificationOrderEquipmentDetails {
  asset_orders?: VerificationAssetOrder[];
  storage_to_employee_orders?: VerificationAssetOrder[];
  offboarding_orders?: VerificationAssetOrder[];
}

export type VerificationContext = "pickup" | "delivery";

export interface EmployeeVerificationData {
  sub_order_id?: string;
  sub_order_type?: string;
  order_number: string;
  expected_delivery?: string | null;
  expected_pickup?: string | null;
  can_edit: boolean;
  can_update_details?: boolean;
  can_toggle_signature: boolean;
  items?: OrderItem[];
  order_equipment_details?: VerificationOrderEquipmentDetails;
  verification_context?: VerificationContext;
  delivery_info?: DeliveryInfo;
  pickup_info?: DeliveryInfo;
  delivery_notes?: string | null;
  pickup_note?: string | null;
  signature_required: boolean;
  signature_set_by?: string | null;
  signature_info_banner: string | null;
  verification_status:
    | "pending"
    | "verification_pending"
    | "verified"
    | "updated"
    | "auto_verified"
    | "expired";
  verified_by?: string | null;
  link_expires_at?: string;
}

export interface EmployeeVerificationUpdatePayload {
  recipient_name: string;
  phone_number: string;
  delivery_address: string;
  street_address: string;
  delivery_notes?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip_code?: string;
  update_personal_profile?: boolean;
  nearest_landmark?: string;
  signature_required?: boolean;
}

export interface VerificationChangeItem {
  field: string;
  from: string;
  to: string;
}

export interface ConfirmVerificationResponse {
  status: boolean;
  message: string;
  data: {
    verification_status: string;
    verified_at: string;
  };
}

export interface UpdateVerificationResponse {
  status: boolean;
  message: string;
  data: {
    verification_status: string;
    updated_at: string;
    changes: VerificationChangeItem[];
  };
}

export interface EmployeeVerificationResponse {
  status: boolean;
  message: string;
  data: EmployeeVerificationData;
}
