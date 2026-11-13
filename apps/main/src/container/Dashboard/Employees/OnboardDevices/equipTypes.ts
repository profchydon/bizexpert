import type { IAsset } from "@/types/assets";

export type DeviceSource = "STORAGE" | "MARKETPLACE" | "RFQ";
export type StorageCondition = "Excellent" | "Good" | "Fair" | "Poor";
export type DeviceConfig = "MI" | "ABM" | "none";
export type DeviceOrigin = "FROM_POLICY" | "MANUAL";

export interface EquipDeviceItem {
  lineId: string;
  productId: string;
  name: string;
  category?: string;
  specs?: string;
  thumbnail?: string;
  source: DeviceSource;
  condition?: StorageCondition;
  warehouse?: string;
  origin: DeviceOrigin;
  unitPrice: number | null;
  currency: string;
  quantity: number;
  config: DeviceConfig;
  fulfilmentDate?: string;
  asset?: IAsset;
}

export interface EquipEmployeeBasic {
  id: string;
  name: string;
  role?: string;
  country?: string;
}

export interface EquipReviewEmployee extends EquipEmployeeBasic {
  devices: EquipDeviceItem[];
}
