import { IOrder, ISubOrder } from "@/types/orders";
import { getSubOrders } from "./orderContentLines";
import { getOffboardDeviceService } from "./offboardDeviceService";

export interface OffboardContentLine {
  id: string;
  name: string;
  type: string;
  serial: string;
  image?: string;
  status: string;
  dispositionLabel: string;
  wipe: string | null;
  deviceCheckIncluded: boolean;
}

function deviceName(sub: ISubOrder): string {
  const equipment = sub.equipment;
  if (equipment) {
    return (
      equipment.title ||
      `${equipment.make || ""} ${equipment.model || ""}`.trim() ||
      "Device"
    );
  }
  const asset = sub.assets?.[0];
  return asset?.name || asset?.model || "Device";
}

function deviceType(sub: ISubOrder): string {
  const asset = sub.assets?.[0];
  return sub.equipment?.type || asset?.type || asset?.category || "Equipment";
}

function deviceImage(sub: ISubOrder): string | undefined {
  return sub.equipment?.image_url || sub.assets?.[0]?.images?.[0] || undefined;
}

const WIPE_LABELS: Record<string, string | null> = {
  factory_reset: "Full Factory Reset",
  none: null,
  not_required: null,
};

function labelForWipe(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const key = trimmed.toLowerCase().replace(/\s+/g, "_");
  if (Object.prototype.hasOwnProperty.call(WIPE_LABELS, key)) {
    return WIPE_LABELS[key];
  }
  return trimmed;
}

function readWipe(sub: ISubOrder): string | null {
  const record = sub as ISubOrder & {
    wipe_type?: string | null;
    operations?: { wipe_type?: string | null };
  };
  if (typeof record.wipe_type === "string")
    return labelForWipe(record.wipe_type);
  return labelForWipe(record.operations?.wipe_type);
}

export function buildOffboardContentLines(
  order?: IOrder,
): OffboardContentLine[] {
  return getSubOrders(order).map((sub, index) => {
    const service = getOffboardDeviceService(sub.type);
    return {
      id: sub.id || `${index}`,
      name: deviceName(sub),
      type: deviceType(sub),
      serial: sub.equipment?.serial_number || "",
      image: deviceImage(sub),
      status: sub.status || "",
      dispositionLabel: service.dispositionLabel,
      wipe: readWipe(sub),
      deviceCheckIncluded: service.deviceCheckIncluded,
    };
  });
}
