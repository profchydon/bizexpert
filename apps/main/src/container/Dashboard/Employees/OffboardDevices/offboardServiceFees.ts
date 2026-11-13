import type { ServiceFeeResponse } from "@/api/baseQueries/feesApi/getServiceFees";
import type { DeviceLine, Disposition, WipeType } from "@/types/offboard";

export interface ServiceFeeTable {
  Storage: number;
  StorageByType: Record<string, number>;
  Reassignment: number;
  Dispose: number;
  Factory_Reset: number;
}

const toFee = (value: unknown): number => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const normalizeStorage = (
  storage: unknown,
): Pick<ServiceFeeTable, "Storage" | "StorageByType"> => {
  if (storage && typeof storage === "object" && !Array.isArray(storage)) {
    const StorageByType = Object.fromEntries(
      Object.entries(storage).map(([key, value]) => [key, toFee(value)]),
    );
    return { Storage: 0, StorageByType };
  }

  return { Storage: toFee(storage), StorageByType: {} };
};

export const storageFeeForType = (
  table: ServiceFeeTable,
  assetType?: string | null,
): number => {
  const type = assetType?.trim();
  if (type) {
    const exact = table.StorageByType[type];
    if (Number.isFinite(exact)) return exact;

    const match = Object.entries(table.StorageByType).find(
      ([key]) => key.toLowerCase() === type.toLowerCase(),
    );
    if (match) return match[1];
  }

  return table.Storage;
};

export const buildServiceFeeTable = (
  fees: Partial<ServiceFeeResponse> | undefined | null,
): ServiceFeeTable | null => {
  if (!fees) return null;

  const storage = normalizeStorage(fees.Storage);

  return {
    Storage: storage.Storage,
    StorageByType: storage.StorageByType,
    Reassignment: toFee(fees.Reassignment),
    Dispose: toFee(fees.Dispose),
    Factory_Reset: toFee(fees.Factory_Reset),
  };
};

const baseFeeForDisposition = (
  disposition: Disposition,
  table: ServiceFeeTable,
  assetType?: string | null,
): number => {
  if (disposition === "STORE") return storageFeeForType(table, assetType);
  if (disposition === "REASSIGN") return table.Reassignment;
  return table.Dispose;
};

export const feeForDevice = (
  disposition: Disposition,
  wipeType: WipeType,
  table: ServiceFeeTable | null | undefined,
  assetType?: string | null,
): number => {
  if (!table) return 0;
  const base = baseFeeForDisposition(disposition, table, assetType);
  const wipeFee = wipeType === "Full Factory Reset" ? table.Factory_Reset : 0;
  const total = base + wipeFee;
  return Number.isFinite(total) ? total : 0;
};

export const sumServiceFees = (
  lines: DeviceLine[],
  table: ServiceFeeTable | null | undefined,
): number =>
  lines.reduce(
    (total, line) =>
      total +
      feeForDevice(line.disposition, line.wipeType, table, line.assetType),
    0,
  );
