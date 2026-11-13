import type { IInStorageOrder } from "@/types/storageOrdersApi";
import { removeUserscore } from "@/utils/underScoreTransformer";
import type {
  EntrySource,
  OrderDirection,
  OrderKind,
  RequestStatus,
  StorageOrder,
} from "../types/storage";

const STATUS_MAP: Record<string, RequestStatus> = {
  awaiting_response: "action_required",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
  requested: "requested",
};

const FLOW_KIND: Record<
  string,
  { kind: OrderKind; entrySource?: EntrySource }
> = {
  offboarding_to_storage: { kind: "intake", entrySource: "offboarding" },
  buy_to_storage: { kind: "intake", entrySource: "buy_to_storage" },
  storage_to_employee: { kind: "deployment" },
};

export function mapApiOrderStatus(status: string): RequestStatus {
  return STATUS_MAP[status] ?? "requested";
}

export function mapApiOrderDirection(
  direction: string | null | undefined,
): OrderDirection | undefined {
  if (direction === "out_of_storage") return "outbound";
  if (direction === "into_storage") return "inbound";
  if (direction === "in_storage") return "service";
  return undefined;
}

export function isActiveApiOrderStatus(status: string) {
  return mapApiOrderStatus(status) !== "completed";
}

const STATUS_LABEL: Record<string, string> = {
  awaiting_response: "Awaiting response",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  verification_pending: "Verification pending",
  pending: "Pending",
};

export function mapApiOrderStatusLabel(status: string) {
  return STATUS_LABEL[status] ?? status;
}

function primaryDeviceLabel(order: IInStorageOrder) {
  return order.equipment[0]?.title || "—";
}

function recipientFromSubOrders(order: IInStorageOrder) {
  const employee = order.sub_orders.find((sub) => sub.employee)?.employee;
  if (!employee) return undefined;
  return {
    name: `${employee.first_name} ${employee.last_name}`.trim(),
    country: order.country.name,
  };
}

export function mapInStorageOrder(order: IInStorageOrder): StorageOrder {
  const flow = order.flow ? FLOW_KIND[order.flow] : undefined;
  const recipient = recipientFromSubOrders(order);
  const primary = order.equipment[0];
  const direction = mapApiOrderDirection(order.direction);

  return {
    id: order.id,
    orderNumber: order.order_number,
    kind: flow?.kind ?? "intake",
    entrySource: flow?.entrySource,
    direction: direction ?? "inbound",
    status: mapApiOrderStatus(order.status),
    statusLabel: mapApiOrderStatusLabel(order.status),
    deviceId: primary?.id,
    deviceName: primaryDeviceLabel(order),
    serialNumber: primary?.serial_number ?? undefined,
    assetType: primary?.type,
    country: order.country.name,
    countryCode: order.country.code,
    createdAt: order.order_date,
    flowLabel: order.flow_label?.trim() || removeUserscore(order.type),
    directionLabel: order.direction_label?.trim() || undefined,
    quantity: order.quantity,
    orderedBy: order.ordered_by,
    recipientName: recipient?.name,
    recipientCountry: recipient?.country,
  };
}
