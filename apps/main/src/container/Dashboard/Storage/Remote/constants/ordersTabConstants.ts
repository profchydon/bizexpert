export const ORDERS_COLUMNS = [
  { id: "id", name: "Order" },
  { id: "device", name: "Device" },
  { id: "kind", name: "Type" },
  { id: "movement", name: "Movement" },
  { id: "location", name: "Location" },
  { id: "date", name: "Date" },
  { id: "status", name: "Status" },
  { id: "action", name: "" },
];

export const ORDERS_API_MAX_PAGE_SIZE = 15;

export const ORDERS_DEFAULT_PAGE_SIZE = ORDERS_API_MAX_PAGE_SIZE;

export const ORDERS_PAGE_SIZE_OPTIONS = [ORDERS_API_MAX_PAGE_SIZE] as const;

export function clampOrdersPageSize(pageSize: number) {
  return Math.min(Math.max(pageSize, 1), ORDERS_API_MAX_PAGE_SIZE);
}
