import config from "@/config/config";
import type { IInStorageInventoryExportParams } from "@/types/equipmentsInStorageInventory";

export function buildStorageInventoryExportUrl(
  companyId: string,
  params?: IInStorageInventoryExportParams,
) {
  const base = `${config.API_URL}/companies/${companyId}/equipments/in-storage/export`;
  if (!params) return base;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    if (typeof value === "boolean") {
      query.set(key, value ? "1" : "0");
      continue;
    }
    query.set(key, String(value));
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

export function buildStorageInventorySelectedExportUrl(companyId: string) {
  return `${config.API_URL}/companies/${companyId}/equipments/in-storage/export/selected`;
}

export function getStorageInventoryExportFilename(
  contentDisposition: string | null | undefined,
) {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? "Rayda_Storage_Inventory.csv";
}

export function downloadStorageInventoryBlob(
  blob: Blob,
  contentDisposition?: string | null,
) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getStorageInventoryExportFilename(contentDisposition ?? null);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
