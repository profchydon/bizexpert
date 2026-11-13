export interface IInStorageInventoryCountry {
  id: string;
  name: string;
  code: string;
}

export interface IInStorageInventoryEntity {
  id: string;
  name: string;
}

export interface IInStorageInventoryGrade {
  grade: string;
  label: string;
  checked_at: string | null;
  checked_days_ago: number | null;
  synthetic: boolean;
}

export type IInStorageWipeStatus =
  | string
  | null
  | {
      required?: boolean;
      status?: string | null;
      label?: string | null;
    };

export interface IInStorageInventoryAction {
  type: string;
  label: string;
  allowed: boolean;
  reason: string | null;
  message: string | null;
}

export interface IInStorageInventoryItem {
  id: string;
  title: string;
  asset_type: string;
  serial_number: string | null;
  image_url: string | null;
  country: IInStorageInventoryCountry;
  entity: IInStorageInventoryEntity;
  source: string;
  source_label: string;
  storage_status: string;
  storage_status_label: string;
  needs_action: boolean;
  grade: IInStorageInventoryGrade;
  wipe_status: IInStorageWipeStatus;
  entry_date: string;
  days_in_storage: number;
  specs?: Record<string, string>;
  actions?: IInStorageInventoryAction[];
  available_actions?: string[];
}

export interface IInStorageInventoryParams {
  search?: string;
  page?: number;
  per_page?: number;
  group_by?: "country";
  country_id?: string;
  entity_id?: string;
  asset_type?: string;
  storage_status?: string;
  grade?: string;
  wipe_status?: string;
  needs_action?: boolean;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  source?: string;
}

export type IInStorageInventoryExportParams = Omit<
  IInStorageInventoryParams,
  "page" | "per_page" | "group_by"
>;

export interface IInStorageInventorySelectedExportBody {
  equipment_ids: string[];
}

export interface IInStorageInventorySummaryAssetType {
  asset_type: string;
  count: number;
}

export interface IInStorageInventorySummaryStatus {
  status: string;
  count: number;
}

export interface IInStorageInventorySummaryCountry {
  country_id: string;
  country: string;
  country_code: string;
  count: number;
}

export interface IInStorageInventorySummary {
  total_count: number;
  asset_type_count: number;
  needs_action_count: number;
  by_asset_type: IInStorageInventorySummaryAssetType[];
  by_status: IInStorageInventorySummaryStatus[];
  by_country: IInStorageInventorySummaryCountry[];
}

export interface IInStorageEquipmentDetailLifecycle {
  event: string;
  label: string;
  description: string;
  occurred_at: string;
}

export interface IInStorageEquipmentDetailTracking {
  status: string;
  status_label: string;
  location: IInStorageInventoryCountry;
  source: string;
  source_label: string;
  wipe_status: IInStorageWipeStatus;
  source_order: { id: string; order_number: string } | null;
  storage_intake_date: string;
  days_in_storage: number;
  lifecycle: IInStorageEquipmentDetailLifecycle[];
}

export interface IInStorageEquipmentDetailCheckComponent {
  component?: string;
  label?: string;
  rating?: string;
  condition?: string;
}

export type IInStorageEquipmentDetailCheckPhoto =
  string | { id?: string; url?: string };

export interface IInStorageEquipmentDetailCheckAccessory {
  name: string;
  present?: boolean;
}

export interface IInStorageEquipmentDetailCheckSummary {
  powers_on?: boolean;
  serial_verified?: boolean;
}

export interface IInStorageEquipmentDetailCheck {
  mode: string;
  status: string;
  overall_grade: string | null;
  grade_label: string | null;
  subtitle: string | null;
  note: string | null;
  checked_at: string | null;
  checked_days_ago: number | null;
  summary: IInStorageEquipmentDetailCheckSummary | null;
  condition_by_component: IInStorageEquipmentDetailCheckComponent[];
  accessories_included: IInStorageEquipmentDetailCheckAccessory[];
  photos: IInStorageEquipmentDetailCheckPhoto[];
}

export interface IInStorageEquipmentDetail extends IInStorageInventoryItem {
  tracking: IInStorageEquipmentDetailTracking;
  details: {
    product_type: string;
    serial_number: string;
    specifications: Record<string, string>;
  };
  device_check: IInStorageEquipmentDetailCheck;
}
