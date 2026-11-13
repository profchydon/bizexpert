export type OffboardDisposition = "STORE" | "REASSIGN" | "RESALE" | "DISPOSE";

export interface OffboardDeviceService {
  dispositionLabel: string;
  deviceCheckIncluded: boolean;
}

const DISPOSITION_BY_TYPE: Record<string, OffboardDisposition> = {
  storage: "STORE",
  buy_to_storage: "STORE",
  reassign: "REASSIGN",
  resale: "RESALE",
  archive: "DISPOSE",
  dispose: "DISPOSE",
};

const DISPOSITION_LABEL: Record<OffboardDisposition, string> = {
  STORE: "Store",
  REASSIGN: "Reassign",
  RESALE: "Resale",
  DISPOSE: "Dispose",
};

const DEVICE_CHECK_BY_DISPOSITION: Record<OffboardDisposition, boolean> = {
  STORE: true,
  REASSIGN: true,
  RESALE: true,
  DISPOSE: false,
};

export function resolveDisposition(type?: string): OffboardDisposition {
  return DISPOSITION_BY_TYPE[(type || "").toLowerCase()] || "STORE";
}

export function getOffboardDeviceService(type?: string): OffboardDeviceService {
  const disposition = resolveDisposition(type);
  return {
    dispositionLabel: DISPOSITION_LABEL[disposition],
    deviceCheckIncluded: DEVICE_CHECK_BY_DISPOSITION[disposition],
  };
}
