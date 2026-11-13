import { mapRfqDevicesToDeviceEntries } from "@/container/Dashboard/EquipEmployee/Marketplace/CustomDeviceRequestModal/mapRfqDevicesToDeviceEntries";
import { storeRfqCreateRequestSession } from "@/container/Dashboard/EquipEmployee/Marketplace/CustomDeviceRequestModal/rfqCreateRequestPrefillStorage";
import type { CustomDeviceRequest } from "./types";

export function storeRfqCreateRequestPrefillFromRequest(
  request: CustomDeviceRequest,
  returnHref: string,
) {
  storeRfqCreateRequestSession({
    devices: mapRfqDevicesToDeviceEntries(request.devices),
    returnHref,
  });
}
