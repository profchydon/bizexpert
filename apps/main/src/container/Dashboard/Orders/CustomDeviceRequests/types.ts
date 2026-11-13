// ── Core domain types for the Custom Device Requests feature ─────────────────

export type RequestStatus =
  | "pending"
  | "waiting_for_action"
  | "accepted"
  | "confirmed"
  | "rejected"
  | "expired";

export type FilterTab = "all" | RequestStatus;

export type SortField = "id" | "budget" | "country";

export type SortDirection = "asc" | "desc";

export type DeviceResponseType = "quoted" | "alternative" | "unavailable";

export interface AlternativeDevice {
  name: string;
  price: number;
  specs?: string;
}

export interface DeviceVendorResponse {
  type: DeviceResponseType;
  quotedPrice?: number;
  alternative?: AlternativeDevice;
  unavailableReason?: string;
}

export interface RFQDevice {
  responseDeviceId?: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  assetType: string;
  assetTypeName?: string;
  specification?: Record<string, string>;
  description?: string;
  vendorResponse?: DeviceVendorResponse;
}

export interface CustomDeviceRequest {
  rfqId: string;
  id: string;
  catalogOrderRequest?: {
    id: string;
    catalogId: string;
    catalogName?: string;
  };
  devices: RFQDevice[];
  requestBudget: number;
  requiredBudget?: number;
  country: string;
  countryId?: string;
  countryCode?: string;
  currency?: string;
  responseId?: string;
  status: RequestStatus;
  createdAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  hideDeviceSelection?: boolean;
  vendorNote?: string;
}

export interface RequestFilters {
  countries: string[];
  assetTypes: string[];
  budgetRange: [number, number];
}

export interface FilterCountryOption {
  id: string;
  name: string;
  code?: string;
}

export interface FilterAssetTypeOption {
  value: string;
  label: string;
}
