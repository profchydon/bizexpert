import type { StoredDevice } from "../types/storage";

export function isDeviceAlreadyErased(
  device: Pick<StoredDevice, "wipeStatus">,
): boolean {
  return device.wipeStatus === "wiped";
}
