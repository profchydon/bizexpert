import type { IInStorageEquipmentDetail } from "@/types/equipmentsInStorageInventory";
import type { StorageEquipmentDetailView } from "../types/equipmentDetail";
import { mapDetailSpecifications } from "./mapDetailSpecifications";
import { mapDeviceCheckDetail } from "./mapDeviceCheckDetail";
import { mapInStorageInventoryItem } from "./mapInStorageInventoryItem";
import {
  mapSource,
  mapStorageStatus,
  mapWipeStatus,
} from "./inStorageInventoryMaps";

export function mapInStorageEquipmentDetail(
  detail: IInStorageEquipmentDetail,
  currency?: string,
): StorageEquipmentDetailView {
  const device = mapInStorageInventoryItem(detail, currency);
  const { tracking } = detail;

  device.status = mapStorageStatus(tracking.status, tracking.status_label);
  device.storageStatusLabel = tracking.status_label;
  device.country = tracking.location.name;
  device.countryId = tracking.location.id;
  device.countryCode = tracking.location.code;
  device.warehouse = tracking.location.name;
  device.entrySource = mapSource(tracking.source);
  device.sourceLabel = tracking.source_label;
  device.wipeStatus = mapWipeStatus(tracking.wipe_status);
  device.sourceOrderId = tracking.source_order?.id;
  device.sourceOrderNumber = tracking.source_order?.order_number;
  device.entryDate = tracking.storage_intake_date;
  device.daysInStorage = tracking.days_in_storage;

  const lifecycle = tracking.lifecycle.map((event, index) => ({
    id: `${device.id}-${event.event}-${index}`,
    label: event.label,
    detail: event.description,
    at: event.occurred_at,
  }));

  const specifications = mapDetailSpecifications(detail.details.specifications);

  return {
    device: {
      ...device,
      deviceType: device.deviceType,
      serialNumber: detail.details.serial_number ?? device.serialNumber,
      assetType: detail.details.product_type,
    },
    lifecycle,
    specifications,
    deviceCheck: mapDeviceCheckDetail(detail.device_check, device),
  };
}
