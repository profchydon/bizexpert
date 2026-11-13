import { IAsset } from "@/types/assets";
import { IEquipment } from "@/types/equipments";
import { IOrder, ISubOrder } from "@/types/orders";

export interface OrderContentLine {
  id: string;
  name: string;
  type: string;
  serialNumber?: string;
  image?: string;
  quantity: number;
  unitPrice: number | null;
  amount: number | null;
  currencySymbol: string;
}

export function getSubOrders(order?: IOrder): ISubOrder[] {
  const raw = order?.sub_orders;
  if (Array.isArray(raw)) return raw;
  return (raw as { data?: ISubOrder[] } | undefined)?.data ?? [];
}

function parsePrice(value?: string | number): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function assetLine(asset: IAsset, fallbackSymbol: string): OrderContentLine {
  const unitPrice = parsePrice(asset.asset_pricing?.amount);
  return {
    id: asset.id || asset.asset_id || asset.name,
    name: asset.name || asset.model || "Device",
    type: asset.type || asset.category || "Equipment",
    image: asset.images?.[0],
    quantity: 1,
    unitPrice,
    amount: unitPrice,
    currencySymbol: asset.asset_pricing?.currency?.symbol || fallbackSymbol,
  };
}

function equipmentLine(
  equipment: IEquipment,
  quantity: number,
  fallbackSymbol: string,
): OrderContentLine {
  const name =
    equipment.title ||
    `${equipment.make || ""} ${equipment.model || ""}`.trim() ||
    "Device";
  const unitPrice = parsePrice(equipment.purchase_price);
  const serialNumber = equipment.serial_number?.trim() || undefined;
  return {
    id: equipment.id || equipment.serial_number || name,
    name,
    type: equipment.type || "Equipment",
    serialNumber,
    image: equipment.image_url || undefined,
    quantity,
    unitPrice,
    amount: unitPrice === null ? null : unitPrice * quantity,
    currencySymbol: equipment.currency?.symbol || fallbackSymbol,
  };
}

function mergeLine(map: Map<string, OrderContentLine>, line: OrderContentLine) {
  const key = `${line.name}|${line.unitPrice ?? "na"}|${line.currencySymbol}`;
  const existing = map.get(key);
  if (!existing) {
    map.set(key, { ...line });
    return;
  }
  existing.quantity += line.quantity;
  if (existing.unitPrice !== null) {
    existing.amount = existing.unitPrice * existing.quantity;
  }
}

const STORAGE_ACTION_TYPE: Record<string, string> = {
  device_check: "Device check",
  dispose: "Disposal",
  disposal: "Disposal",
  deploy: "Deployment",
  deployment: "Deployment",
};

function storageActionLine(
  sub: ISubOrder,
  fallbackSymbol: string,
): OrderContentLine | null {
  if (!sub.action && !sub.equipment_id) return null;
  const unitPrice = parsePrice(sub.amount);
  const type = STORAGE_ACTION_TYPE[sub.action ?? ""] || "Equipment";
  return {
    id: sub.id || sub.equipment_id || type,
    name: "Device",
    type,
    quantity: sub.quantity ?? 1,
    unitPrice,
    amount: unitPrice,
    currencySymbol: fallbackSymbol,
  };
}

function subOrderLine(
  sub: ISubOrder,
  fallbackSymbol: string,
): OrderContentLine[] {
  const assets = Array.isArray(sub.assets) ? sub.assets : [];
  if (assets.length > 0) {
    return assets.map((asset) => assetLine(asset, fallbackSymbol));
  }
  if (sub.equipment) {
    return [equipmentLine(sub.equipment, sub.quantity ?? 1, fallbackSymbol)];
  }
  const storageLine = storageActionLine(sub, fallbackSymbol);
  return storageLine ? [storageLine] : [];
}

export function buildOrderContentLines(order?: IOrder): OrderContentLine[] {
  const fallbackSymbol = order?.currency || "";
  const map = new Map<string, OrderContentLine>();

  for (const sub of getSubOrders(order)) {
    for (const line of subOrderLine(sub, fallbackSymbol)) {
      mergeLine(map, line);
    }
  }

  return Array.from(map.values());
}
