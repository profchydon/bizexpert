import { resolveCountryCode } from "@/container/Dashboard/Storage/Remote/utils/resolveCountryFlag";
import { IOrder, ISubOrder } from "@/types/orders";

export interface DeliveryCountry {
  name: string;
  code: string;
}

type SubWithDelivery = ISubOrder & {
  delivery_info?: {
    country?: string | null;
    country_code?: string | null;
  };
};

function subOrders(order: IOrder): SubWithDelivery[] {
  const raw = order.sub_orders;
  if (Array.isArray(raw)) return raw as SubWithDelivery[];
  const nested = (raw as { data?: SubWithDelivery[] } | undefined)?.data;
  return Array.isArray(nested) ? nested : [];
}

export function storageToEmployeeDeliveryCountries(
  order: IOrder,
): DeliveryCountry[] {
  if (order.type !== "storage_to_employee") return [];
  const seen = new Map<string, DeliveryCountry>();
  for (const sub of subOrders(order)) {
    const name = sub.delivery_info?.country?.trim();
    if (!name) continue;
    const code =
      resolveCountryCode(sub.delivery_info?.country_code, name) ?? "";
    const key = `${name}-${code}`;
    if (!seen.has(key)) seen.set(key, { name, code });
  }
  return Array.from(seen.values());
}
