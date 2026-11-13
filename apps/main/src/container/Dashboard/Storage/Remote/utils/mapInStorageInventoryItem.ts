import type { IInStorageInventoryItem } from "@/types/equipmentsInStorageInventory";
import type { StoredDevice } from "../types/storage";
import {
  mapAssetTypeToDeviceType,
  mapSource,
  mapStorageStatus,
  mapWipeStatus,
} from "./inStorageInventoryMaps";
import { mapInventoryAvailableActions } from "./mapInventoryAvailableActions";
import { resolveInventoryGrade } from "./resolveInventoryGrade";

export function mapInStorageInventoryItem(
  item: IInStorageInventoryItem,
  currency?: string,
): StoredDevice {
  const resolvedGrade = resolveInventoryGrade(item.grade);
  return {
    id: item.id,
    deviceName: item.title,
    model: item.title,
    deviceType: mapAssetTypeToDeviceType(item.asset_type),
    assetType: item.asset_type,
    serialNumber: item.serial_number ?? "—",
    image: item.image_url ?? undefined,
    country: item.country.name,
    countryId: item.country.id,
    countryCode: item.country.code,
    entityId: item.entity.id,
    entityName: item.entity.name,
    warehouse: item.country.name,
    entrySource: mapSource(item.source),
    sourceLabel: item.source_label,
    storageStatusLabel: item.storage_status_label,
    wipeStatus: mapWipeStatus(item.wipe_status),
    wipeLabel:
      typeof item.wipe_status === "object" && item.wipe_status
        ? item.wipe_status.label?.trim() || undefined
        : undefined,
    entryDate: item.entry_date,
    daysInStorage: item.days_in_storage,
    status: mapStorageStatus(item.storage_status, item.storage_status_label),
    ...resolvedGrade,
    needsActionFlag: item.needs_action,
    currency: currency?.trim() || "USD",
    specs: item.specs,
    availableActions: mapInventoryAvailableActions(
      item.available_actions,
      item.actions,
    ),
  };
}
