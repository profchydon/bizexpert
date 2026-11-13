import { IOrder } from "@/types/orders";
import { getSubOrders } from "./orderContentLines";

export interface StorageSummary {
  warehouse: string | null;
  duration: string | null;
}

function normalizeDuration(value?: string | number | null): string | null {
  if (value === undefined || value === null) return null;
  const raw = `${value}`.trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) {
    const months = Number(raw);
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  return raw;
}

export function getStorageSummary(order?: IOrder): StorageSummary {
  let warehouse: string | null = null;
  let duration: string | null = null;

  for (const sub of getSubOrders(order)) {
    const location = sub.storage_location;
    if (!warehouse && location?.trim()) warehouse = location.trim();
    if (!duration) duration = normalizeDuration(sub.storage_duration);
    if (warehouse && duration) break;
  }

  return { warehouse, duration };
}
