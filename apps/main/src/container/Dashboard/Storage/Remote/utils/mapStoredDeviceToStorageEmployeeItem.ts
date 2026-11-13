import type { IEquipmentsInStorageByCountry } from "@/types/equipments";
import type { StoredDevice } from "../types/storage";

export function mapStoredDeviceToStorageEmployeeItem(
  device: StoredDevice,
): IEquipmentsInStorageByCountry {
  return {
    id: device.id,
    title: device.deviceName,
    description: device.model,
    storage_duration:
      device.daysInStorage != null ? `${device.daysInStorage} days` : "—",
    moved_to_storage: device.entryDate,
    image_url: device.image ?? null,
    serial_number: device.serialNumber === "—" ? null : device.serialNumber,
    status: device.storageStatusLabel ?? device.status,
    country: device.country,
    source: device.sourceLabel ?? device.entrySource,
    actionType: "Transfer",
    specs: device.specs as IEquipmentsInStorageByCountry["specs"],
  };
}
