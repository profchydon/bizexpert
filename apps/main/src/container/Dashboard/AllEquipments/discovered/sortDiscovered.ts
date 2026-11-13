import type { SortDescriptor } from "react-aria-components";
import type { DiscoveredDevice } from "./types";

export function sortDiscovered(
  devices: DiscoveredDevice[],
  sort: SortDescriptor,
): DiscoveredDevice[] {
  if (!sort.column) return devices;
  const dir = sort.direction === "ascending" ? 1 : -1;
  const key = (device: DiscoveredDevice): string => {
    switch (sort.column) {
      case "device":
        return device.hostname;
      case "serial":
        return device.serial;
      case "os":
        return device.os;
      case "seenOn":
        return device.employeeName;
      default:
        return String(devices.indexOf(device)).padStart(4, "0");
    }
  };
  return [...devices].sort((a, b) => dir * key(a).localeCompare(key(b)));
}
