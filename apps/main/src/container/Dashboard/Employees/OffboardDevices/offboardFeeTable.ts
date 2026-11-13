import type { DeviceLine, Disposition, WipeType } from "@/types/offboard";
import {
  parseStorageFees,
  storageFeeForAssetType,
  toFeeAmount,
  type StorageFeeByAssetType,
} from "./storageFeeByAssetType";

export interface ServiceFeeTable {
  Storage: number;
  storageByType: StorageFeeByAssetType;
  Reassignment: number;
  Dispose: number;
  Factory_Reset: number;
  Device_Check: number;
}

type NumericFeeKey = {
  [K in keyof ServiceFeeTable]: ServiceFeeTable[K] extends number ? K : never;
}[keyof ServiceFeeTable];

const DISPOSITION_FEE_KEY: Record<
  Exclude<Disposition, "STORE">,
  NumericFeeKey
> = {
  REASSIGN: "Reassignment",
  DISPOSE: "Dispose",
};

export const buildServiceFeeTable = (fees: any): ServiceFeeTable | null => {
  if (!fees) return null;

  const parsedStorage = parseStorageFees(fees.Storage ?? fees.storage);

  return {
    Storage: parsedStorage.defaultStorage,
    storageByType: parsedStorage.storageByType,
    Reassignment: toFeeAmount(fees.Reassignment ?? fees.reassignment),
    Dispose: toFeeAmount(fees.Dispose ?? fees.dispose),
    Factory_Reset: toFeeAmount(fees.Factory_Reset ?? fees.factory_reset),
    Device_Check: toFeeAmount(fees.Device_Check ?? fees.device_check),
  };
};

export const feeForDevice = (
  disposition: Disposition,
  wipeType: WipeType,
  table: ServiceFeeTable | null | undefined,
  assetType?: string,
): number => {
  if (!table) return 0;
  const base =
    disposition === "STORE"
      ? storageFeeForAssetType(table.storageByType, table.Storage, assetType)
      : (table[DISPOSITION_FEE_KEY[disposition]] ?? 0);
  const wipeFee = wipeType === "Full Factory Reset" ? table.Factory_Reset : 0;
  return base + wipeFee;
};

export const feeForLine = (
  line: Pick<DeviceLine, "disposition" | "wipeType" | "assetType">,
  table: ServiceFeeTable | null | undefined,
): number =>
  feeForDevice(line.disposition, line.wipeType, table, line.assetType);

export const sumServiceFees = (
  lines: DeviceLine[],
  table: ServiceFeeTable | null | undefined,
): number => lines.reduce((total, line) => total + feeForLine(line, table), 0);
