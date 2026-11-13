import type { StoredDevice } from "../../types/storage";
import { ASSET_TO_DEVICE_TYPE } from "../data/assetTypes";
import type {
  ImportReceipt,
  ImportRow,
  IntakeOutcome,
  ReceiptLine,
} from "../types";

function rowName(row: ImportRow): string {
  return (
    row.deviceName.trim() ||
    (typeof row.specs.model_name === "string" && row.specs.model_name.trim()) ||
    "Imported device"
  );
}

export function rowToDevice(
  row: ImportRow,
  country: string,
  warehouse: string,
): StoredDevice {
  const now = new Date().toISOString();
  const assetType = row.assetType ?? "other";
  const name = rowName(row);
  const model =
    (typeof row.specs.model_name === "string" && row.specs.model_name.trim()) ||
    name;
  return {
    id: `STD-OF-${row.id}-${Date.now().toString(36).slice(-4)}`,
    deviceName: name,
    model,
    deviceType: ASSET_TO_DEVICE_TYPE[assetType] ?? "Accessory",
    assetType,
    serialNumber: row.serial,
    country,
    warehouse,
    entrySource: "open_fleet",
    entryDate: now,
    status: "available",
    grade: "B",
    lastCheckDate: now,
    currency: "USD",
    specs: row.specs,
    extendedSpecs: row.extendedSpecs
      .filter((e) => e.key || e.value)
      .map((e) => ({ key: e.key, value: e.value })),
  };
}

/** Simulate the vendor intake: mark each expected row received, then apply the chosen variance. */
export function buildReceipt(
  rows: ImportRow[],
  outcome: IntakeOutcome,
): ImportReceipt {
  const lines: ReceiptLine[] = rows.map((r) => ({
    id: r.id,
    deviceName: rowName(r),
    serial: r.serial,
    deviceType: ASSET_TO_DEVICE_TYPE[r.assetType ?? "other"] ?? "Accessory",
    status: "received",
    grade: "B",
  }));

  if (
    (outcome === "shortfall" || outcome === "wrong_item") &&
    lines.length > 0
  ) {
    const last = lines[lines.length - 1];
    last.status = outcome === "shortfall" ? "missing" : "quarantined";
    last.grade = undefined;
  }
  if (outcome === "surplus") {
    lines.push({
      id: "surplus-1",
      deviceName: "Unlisted device",
      serial: "EXTRA-UNKNOWN",
      deviceType: "Accessory",
      status: "surplus",
      grade: "B",
    });
  }

  const received = lines.filter(
    (l) => l.status === "received" || l.status === "surplus",
  ).length;
  return { expected: rows.length, received, variance: outcome, lines };
}

/** The original rows that were received as expected (excludes missing/quarantined). */
export function receivedRows(
  rows: ImportRow[],
  receipt: ImportReceipt,
): ImportRow[] {
  const ids = new Set(
    receipt.lines.filter((l) => l.status === "received").map((l) => l.id),
  );
  return rows.filter((r) => ids.has(r.id));
}
