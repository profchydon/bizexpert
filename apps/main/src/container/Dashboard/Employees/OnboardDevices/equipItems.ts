import type { DeviceConfig, EquipDeviceItem } from "./equipTypes";

export const addItem = (
  items: EquipDeviceItem[],
  item: EquipDeviceItem,
): EquipDeviceItem[] =>
  items.some((existing) => existing.lineId === item.lineId)
    ? items
    : [...items, item];

export const removeItem = (
  items: EquipDeviceItem[],
  lineId: string,
): EquipDeviceItem[] => items.filter((item) => item.lineId !== lineId);

export const setQuantity = (
  items: EquipDeviceItem[],
  lineId: string,
  quantity: number,
): EquipDeviceItem[] =>
  items.map((item) =>
    item.lineId === lineId
      ? { ...item, quantity: normalizeQuantity(quantity) }
      : item,
  );

export const normalizeQuantity = (quantity: number): number =>
  Math.max(1, Math.round(quantity));

export const parseQuantityInput = (raw: string, fallback: number): number => {
  const parsed = Number.parseInt(raw.trim(), 10);
  if (Number.isNaN(parsed)) return normalizeQuantity(fallback);
  return normalizeQuantity(parsed);
};

export const setConfig = (
  items: EquipDeviceItem[],
  lineId: string,
  config: DeviceConfig,
): EquipDeviceItem[] =>
  items.map((item) => (item.lineId === lineId ? { ...item, config } : item));

export const setFulfilmentDate = (
  items: EquipDeviceItem[],
  lineId: string,
  fulfilmentDate: string,
): EquipDeviceItem[] =>
  items.map((item) =>
    item.lineId === lineId ? { ...item, fulfilmentDate } : item,
  );

export const calculateRunningTotal = (
  items: EquipDeviceItem[],
): { total: number; hasPending: boolean } => {
  let total = 0;
  let hasPending = false;
  for (const item of items) {
    if (item.unitPrice == null) hasPending = true;
    else total += item.unitPrice * item.quantity;
  }
  return { total, hasPending };
};

export const resolveDisplayCurrency = (
  items: EquipDeviceItem[],
  fallback = "USD",
): string =>
  items.find((item) => item.unitPrice != null && item.unitPrice > 0)
    ?.currency ?? fallback;

export const formatCurrency = (amount: number, currency = "USD"): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const lineTotal = (item: EquipDeviceItem): number | null =>
  item.unitPrice == null ? null : item.unitPrice * item.quantity;
