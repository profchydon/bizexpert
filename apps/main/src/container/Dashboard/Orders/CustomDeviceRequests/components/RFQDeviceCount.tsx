import type { RFQDevice } from "../types";
import { truncateDeviceName } from "../utils";

interface RFQDeviceCountProps {
  devices: RFQDevice[];
}

export default function RFQDeviceCount({
  devices,
}: Readonly<RFQDeviceCountProps>) {
  const totalQuantity = devices.reduce(
    (sum, device) => sum + device.quantity,
    0,
  );
  const tooltipText = devices
    .map((device) => `${truncateDeviceName(device.name)} (×${device.quantity})`)
    .join("\n");

  return (
    <span className="cursor-default text-sm text-gray-900" title={tooltipText}>
      {totalQuantity}
    </span>
  );
}
