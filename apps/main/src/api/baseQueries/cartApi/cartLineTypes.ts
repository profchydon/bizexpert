const STORAGE_CART_ACTION_TYPES = [
  "storage_device_check",
  "storage_disposal",
  "storage_deploy_to_employee",
] as const;

export type StorageCartActionType = (typeof STORAGE_CART_ACTION_TYPES)[number];

export type CartLineType = "marketplace" | StorageCartActionType;

export type MarketplaceCartWriteItem = {
  type?: "marketplace";
  asset_pricing_id: string;
  quantity: number;
};

export type StorageDeviceCheckWriteItem = {
  type: "storage_device_check";
  equipment_id: string;
  company_id: string;
  reason: string;
  needed_by?: string;
};

export type StorageDisposalWriteItem = {
  type: "storage_disposal";
  equipment_id: string;
  company_id: string;
  reason?: string;
  disposal_method?: string;
};

export type StorageDeployWriteItem = {
  type: "storage_deploy_to_employee";
  equipment_id: string;
  company_id: string;
  employee_id: string;
  signature_requested?: boolean;
  device_setup?: string;
};

export type CartWriteItem =
  | MarketplaceCartWriteItem
  | StorageDeviceCheckWriteItem
  | StorageDisposalWriteItem
  | StorageDeployWriteItem;

export type StorageCartLineEquipment = {
  id?: string;
  title?: string;
  serial_number?: string;
  type?: string;
  country?: string;
};

export type StorageCartLineEmployee = {
  id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  country?: string;
};

export type StorageCartLine = {
  type: StorageCartActionType;
  id?: string;
  equipment_id?: string;
  company_id?: string;
  employee_id?: string;
  employee?: StorageCartLineEmployee;
  label?: string;
  reason?: string;
  needed_by?: string;
  equipment?: StorageCartLineEquipment;
  disposal_method?: string;
  signature_requested?: boolean;
  device_setup?: string;
  unit_amount?: number;
  quantity?: number;
  amount?: number;
  currency?: string;
};

export type UnknownCartLine = Record<string, unknown> & {
  type?: string;
};

const STORAGE_CART_ACTION_TYPE_SET: ReadonlySet<string> = new Set(
  STORAGE_CART_ACTION_TYPES,
);

function isStorageCartActionType(type?: string): type is StorageCartActionType {
  return type !== undefined && STORAGE_CART_ACTION_TYPE_SET.has(type);
}

export function cartLineType(
  item: { type?: string } | null | undefined,
): CartLineType {
  const type = item?.type;
  if (isStorageCartActionType(type)) return type;
  return "marketplace";
}

export function isStorageCartLine(
  item: { type?: string } | null | undefined,
): item is StorageCartLine {
  return cartLineType(item) !== "marketplace";
}
