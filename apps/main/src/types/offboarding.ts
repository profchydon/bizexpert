import { IEmployees } from "./employees";

export type ActionType =
  | "Transfer"
  | "Store"
  | "Sale"
  | "Archive"
  | "onboarding"
  | "offboarding";
export type DeviceRefreshActionType = ActionType | "Dispose";
export type OrderActionType = "reassign" | "storage" | "resale" | "archive";
export type OrderFlowType =
  | "offboarding"
  | "onboarding"
  | "storage_to_employee"
  | "buy_to_storage"
  | "renew_storage"
  | "device_refresh"
  | "storage_order"
  | "storage";

/**
 * Type definition for Offboarding Asset.
 */
export type Offboard_asset = {
  id: string;
  image_url: string;
  title: string;
  year: string;
  make: string;
  receiver?: IEmployees;
  collectionDate?: string;
  collectionWindow?: { start: string; end: string };
  actionType?: ActionType;
  factoryReset?: boolean;
  statusFlow?: "Completed" | null;
  status?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    country: string;
    country_code: string;
    address: string;
    employment_type: string;
    phone: string;
    job_title: string;
    offboardEmployee?: boolean;
  };
  storageDuration?: string;
  storeDate?: string | number;
  expirationDate?: string;
  estimatedSalesPrice?: number | string;
  country?: string;
  countryCode?: string;
  currency?: {
    id: string;
    name: string;
    code: string;
    symbol: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  assets: Offboard_asset[];
};

interface IResaleValue {
  minimum: number;
  maximum: number;
  estimated: number;
}

export interface FeeTransformOutput {
  [assigneeId: string]: {
    equipment: {
      equipment_id: string;
      quantity: number;
      storage?: boolean;
      resale?: boolean;
      archive?: boolean;
      dispose?: boolean;
      factory_reset?: boolean;
      reassign?: boolean;
      duration?: string;
      assignee?: string;
      estimated_value?: string;
      collection_date?: string | { start: string; end: string };
      signature_requested?: boolean;
    }[];
    total_fee?: number;
  };
}

export type GetEquipmentResaleValueResponse = ServerResponse<IResaleValue>;

export const orderFlowTypeCheck: Record<
  OrderFlowType,
  { className: string; variant?: string; label: string }
> = {
  onboarding: {
    className: "w-fit",
    variant: "success_border",
    label: "Onboarding",
  },
  offboarding: {
    className: "w-fit",
    variant: "gray_border",
    label: "Off-boarding",
  },
  storage_to_employee: {
    className: "w-fit",
    variant: "blue_border",
    label: "Storage To Employee",
  },
  buy_to_storage: {
    className: "w-fit",
    variant: "awaiting_border",
    label: "Buy To Storage",
  },
  storage_order: {
    className: "w-fit",
    variant: "gray_border",
    label: "Storage",
  },
  renew_storage: {
    className: "w-fit text-warning-700",
    variant: "mild",
    label: "Renew Storage",
  },
  device_refresh: {
    className: "w-fit text-primary-700 bg-primary-25",
    variant: "blue_border",
    label: "Device refresh",
  },
  storage: {
    className: "w-fit text-brand-700",
    variant: "blue_border",
    label: "Storage",
  },
};

export const assetActionType: Record<
  ActionType | OrderActionType,
  { className: string; variant?: string; label: string }
> = {
  Transfer: {
    className: "w-fit text-primary-700 bg-primary-25",
    variant: "blue",
    label: "Reassign",
  },
  Sale: {
    className: "w-fit text-success-700",
    variant: "success",
    label: "Sale",
  },
  Store: {
    className: "w-fit text-gray-700",
    label: "Store",
  },
  Archive: {
    className: "w-fit",
    variant: "pending",
    label: "Archive",
  },
  reassign: {
    className: "w-fit",
    variant: "blue",
    label: "Reassign",
  },
  archive: {
    className: "w-fit",
    variant: "pending",
    label: "Archive",
  },
  resale: {
    className: "w-fit text-success-700",
    variant: "success",
    label: "Resale",
  },
  storage: {
    className: "w-fit text-gray-700",
    label: "Storage",
  },
  onboarding: {
    className: "w-fit text-primary-700 bg-primary-25",
    variant: "blue",
    label: "Onboarding",
  },
  offboarding: {
    className: "w-fit text-warning-700",
    variant: "pending",
    label: "Offboarding",
  },
};

export type CalculateOffboardingFeesRequest = {
  payload: {
    country_id: string;
    service_type: string;
    orders: FeeTransformOutput;
  };
};
