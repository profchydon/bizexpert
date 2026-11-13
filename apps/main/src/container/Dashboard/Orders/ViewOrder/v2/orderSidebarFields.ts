import dayjs from "dayjs";
import { IOrder } from "@/types/orders";
import { getSubOrders } from "./orderContentLines";

const EXPECTED_DAYS = 7;

export function getItemsCount(order?: IOrder): number {
  if (!order) return 0;
  const quantity = Number(order.quantity);
  if (Number.isFinite(quantity) && quantity > 0) return quantity;
  return getSubOrders(order).length;
}

export function getItemsCountText(order?: IOrder): string {
  const count = getItemsCount(order);
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export function isStorageOrderType(type?: string): boolean {
  return (
    type === "buy_to_storage" || type === "storage" || type === "storage_order"
  );
}

function isStorageType(type?: string): boolean {
  return isStorageOrderType(type);
}

export function getExpectedDateLabel(
  order?: IOrder,
  completed = false,
): string {
  const type = order?.type;
  if (type === "offboarding") {
    return completed ? "Completed on" : "Expected completion";
  }
  if (isStorageType(type)) {
    return completed ? "Stored on" : "Expected at warehouse";
  }
  return completed ? "Delivered on" : "Expected delivery";
}

export interface SidebarDateField {
  label: string;
  value: string;
  deltaDays?: number | null;
  previousValue?: string | null;
}

function formatSidebarDate(value?: string | null): string | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMM DD, YYYY") : null;
}

export function getExpectedDateField(order?: IOrder): SidebarDateField | null {
  const completed = order?.status === "completed";
  const meta = order?.delivery_date_meta;
  const completedOn = completed
    ? formatSidebarDate(meta?.completed_on) ||
      formatSidebarDate(order?.order_date)
    : null;

  if (completedOn) {
    return {
      label: getExpectedDateLabel(order, true),
      value: completedOn,
    };
  }

  if (meta?.expected_delivery_on) {
    return {
      label: getExpectedDateLabel(order, completed),
      value: dayjs(meta.expected_delivery_on).format("MMM DD, YYYY"),
      deltaDays: meta.expected_delivery_delta_days ?? null,
      previousValue: meta.expected_delivery_previous_on
        ? dayjs(meta.expected_delivery_previous_on).format("MMM DD, YYYY")
        : null,
    };
  }

  if (!order?.order_date) return null;
  const base = dayjs(order.order_date);
  if (!base.isValid()) return null;
  return {
    label: getExpectedDateLabel(order, completed),
    value: base.add(EXPECTED_DAYS, "day").format("MMM DD, YYYY"),
  };
}
