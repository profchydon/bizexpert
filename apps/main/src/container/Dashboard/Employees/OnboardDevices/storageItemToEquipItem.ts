import type { IEquipmentsInStorageByCountry } from "@/types/equipments";
import { getStorageDefaultConfig } from "./equipDeviceConfig";
import { buildStorageDeviceSpecs } from "./buildStorageDeviceSpecs";
import type { EquipDeviceItem } from "./equipTypes";

export const storageItemToEquipItem = (
  item: IEquipmentsInStorageByCountry,
  currency = "USD",
): EquipDeviceItem => ({
  lineId: item.id,
  productId: item.id,
  name: item.title,
  specs: buildStorageDeviceSpecs(item.specs),
  thumbnail: item.image_url ?? undefined,
  source: "STORAGE",
  warehouse: item.country,
  origin: "MANUAL",
  unitPrice: 0,
  currency,
  quantity: 1,
  config: getStorageDefaultConfig(item.title),
});
