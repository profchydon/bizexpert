import type { ServiceFeeResponse } from "@/api/baseQueries/feesApi/getServiceFees";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

export interface StorageServiceFeeTable {
  Reassignment: number;
  Storage: number;
  Dispose: number;
  Factory_Reset: number;
  Device_Check: number;
}

function toFee(value: unknown): number {
  if (value && typeof value === "object") return 0;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function normalizeServiceFeeResponse(
  fees: Record<string, unknown> | undefined | null,
): StorageServiceFeeTable | null {
  if (!fees || typeof fees !== "object") return null;

  return {
    Reassignment: toFee(fees.Reassignment ?? fees.reassignment),
    Storage: toFee(fees.Storage ?? fees.storage),
    Dispose: toFee(fees.Dispose ?? fees.dispose),
    Factory_Reset: toFee(fees.Factory_Reset ?? fees.factory_reset),
    Device_Check: toFee(fees.Device_Check ?? fees.device_check),
  };
}

export function buildStorageServiceFeeTable(
  fees: Partial<ServiceFeeResponse> | undefined | null,
): StorageServiceFeeTable | null {
  return normalizeServiceFeeResponse(
    fees as Record<string, unknown> | null | undefined,
  );
}

export function lineFeeForAction(
  item: CheckoutItem,
  table: StorageServiceFeeTable | null | undefined,
): number {
  if (!table) return 0;

  if (item.kind === "deployment") {
    let fee = table.Reassignment;
    if (item.checkNote?.toLowerCase().includes("fresh")) {
      fee += table.Device_Check;
    }
    if (item.wipeRequested) {
      fee += table.Factory_Reset;
    }
    return fee;
  }

  if (item.kind === "device_check") return table.Device_Check;
  if (item.kind === "disposal") return table.Dispose;
  return 0;
}

export function subtotalForActions(
  items: CheckoutItem[],
  table: StorageServiceFeeTable | null | undefined,
): number {
  return items.reduce((sum, item) => sum + lineFeeForAction(item, table), 0);
}
