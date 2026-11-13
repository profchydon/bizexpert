import type { CheckoutItem } from "../hooks/useStorageCheckout";
import type { NewRequestInput } from "../hooks/useStorageInventory";
import type { StorageStatus } from "../types/storage";

interface SubmitCtx {
  setDeviceStatus: (id: string, status: StorageStatus) => void;
  createRequest: (input: NewRequestInput) => void;
}

/** Submit every queued checkout item — flips device status + logs the request. */
export function submitCheckout(items: CheckoutItem[], ctx: SubmitCtx): string {
  for (const it of items) {
    const base = {
      deviceId: it.deviceId,
      deviceName: it.deviceName,
      serialNumber: it.serialNumber,
      assetType: it.assetType,
      image: it.image,
      country: it.country,
    } as const;
    if (it.kind === "deployment") {
      ctx.setDeviceStatus(it.deviceId, "reserved");
      const checkNote = it.checkNote ? ` · ${it.checkNote}` : "";
      const wipeNote = it.wipeRequested ? " · Factory reset before ship" : "";
      ctx.createRequest({
        kind: "deployment",
        status: "in_progress",
        ...base,
        recipientName: it.recipientName,
        recipientCountry: it.recipientCountry,
        note: `Shipping to ${it.recipientName ?? "employee"}${it.recipientCountry ? ` · ${it.recipientCountry}` : ""}${checkNote}${wipeNote}`,
      });
    } else if (it.kind === "device_check") {
      ctx.createRequest({
        kind: "device_check",
        status: "in_progress",
        ...base,
        note: it.checkNote || "Re-grade check",
      });
    } else if (it.kind === "disposal") {
      ctx.setDeviceStatus(it.deviceId, "pending_disposal");
      const note =
        it.disposalMethod === "destroy"
          ? "Certificate of destruction"
          : `Certified erasure → Impact Program${it.erasureWaived ? " · erasure waived" : ""}`;
      ctx.createRequest({
        kind: "disposal",
        status: "in_progress",
        ...base,
        note,
      });
    }
  }
  const n = items.length;
  return `Submitted ${n} request${n === 1 ? "" : "s"}`;
}
