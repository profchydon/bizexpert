import { SOURCE_LABEL, STATUS_LABEL } from "../data/storageMeta";
import type { StoredDevice } from "../types/storage";
import { daysInStorage, formatDate } from "./deriveDevice";

const HEADERS = [
  "Device",
  "Model",
  "Type",
  "Serial",
  "Country",
  "Warehouse",
  "Source",
  "Entry date",
  "Days in storage",
  "Grade",
  "Last check",
  "Status",
];

function cell(value: string | number | undefined): string {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function buildInventoryCsv(devices: StoredDevice[]): string {
  const rows = devices.map((d) =>
    [
      d.deviceName,
      d.model,
      d.deviceType,
      d.serialNumber,
      d.country,
      d.warehouse,
      SOURCE_LABEL[d.entrySource],
      formatDate(d.entryDate),
      daysInStorage(d),
      d.grade ?? "",
      formatDate(d.lastCheckDate),
      STATUS_LABEL[d.status],
    ]
      .map(cell)
      .join(","),
  );
  return [HEADERS.join(","), ...rows].join("\n");
}

export function downloadInventoryCsv(devices: StoredDevice[]): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([buildInventoryCsv(devices)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `storage-inventory-${formatDate(new Date(MOCK_DATE).toISOString()).replace(/\s/g, "-")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const MOCK_DATE = "2026-06-01T00:00:00Z";
