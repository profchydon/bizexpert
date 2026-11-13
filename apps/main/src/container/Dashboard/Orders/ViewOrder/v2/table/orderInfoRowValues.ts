import dayjs from "dayjs";
import { IOrder, ISubOrder } from "@/types/orders";
import formatAmount from "@/utils/formatAmount";
import { subOrderCustomerAmount } from "../subOrderCustomerPricing";
import {
  isOfficeSubOrder,
  subOrderEmployeeName,
  subOrderRecipientSubtitle,
} from "../subOrderIdentity";
import type { CancellationInfo } from "@/utils/order-cancellation";
import type { CancellationView } from "../cancel/mapCancellationInfo";
import { resolveSubOrderDisplayStatus } from "./subOrderCancellationStatus";

export type SortKey = "name" | "address" | "amount" | "status" | "signature";
export type SortDir = "asc" | "desc";

export interface OrderInfoRowValues {
  id: string;
  initials: string;
  name: string;
  role: string;
  isOffice: boolean;
  address: string;
  amount: string;
  amountValue: number;
  status: string;
  actionType?: string;
  signatureRequested: boolean;
  signatureStatus?: string | null;
  window: string | null;
}

function assigneeName(row: ISubOrder): string {
  return subOrderEmployeeName(row);
}

function resolveAddress(row: ISubOrder): string {
  if (row.address?.trim()) return row.address.trim();
  if (row.office_address?.trim()) return row.office_address.trim();
  const details = row.order_details;
  const fromAddress = details?.from?.address?.trim();
  if (fromAddress) return fromAddress;
  const toAddress = details?.to?.address?.trim();
  if (toAddress) return toAddress;
  return row.equipment?.assignee?.address?.trim() || "";
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function getRowSignatureRequested(
  row: ISubOrder,
  orderType?: string,
): boolean {
  if (orderType === "onboarding") {
    return Boolean(
      (row.assets?.[0] as { signature_requested?: boolean } | undefined)
        ?.signature_requested,
    );
  }
  return Boolean(row.signature_requested);
}

export function formatWindow(row: ISubOrder): string | null {
  const start = row.collection_date_start;
  const end = row.collection_date_end;
  if (start && end) {
    return `${dayjs(start).format("MMM D")} – ${dayjs(end).format("MMM D, YYYY")}`;
  }
  if (row.collection_date) {
    return dayjs(row.collection_date).format("MMM D, YYYY");
  }
  if (start) return dayjs(start).format("MMM D, YYYY");
  return null;
}

function amountNumber(row: ISubOrder): number {
  return subOrderCustomerAmount(row);
}

export function buildRowValues(
  row: ISubOrder,
  orderType: string | undefined,
  currency: string,
  order?: IOrder,
  cancellationContext?: {
    cancellationView?: CancellationView;
    cancellationInfo?: CancellationInfo | null;
    pendingSubOrderIds?: Set<string>;
  },
): OrderInfoRowValues {
  const name = assigneeName(row);
  const value = amountNumber(row);
  return {
    id: row.id,
    initials: initialsFor(name),
    name,
    role: subOrderRecipientSubtitle(row),
    isOffice: isOfficeSubOrder(row),
    address: resolveAddress(row),
    amount: value ? `${currency}${formatAmount(value)}` : "—",
    amountValue: value,
    status: resolveSubOrderDisplayStatus(row, order, cancellationContext),
    actionType: row.type,
    signatureRequested: getRowSignatureRequested(row, orderType),
    signatureStatus: row.signature_status,
    window: formatWindow(row),
  };
}

function compareBy(
  a: OrderInfoRowValues,
  b: OrderInfoRowValues,
  key: SortKey,
): number {
  if (key === "amount") return a.amountValue - b.amountValue;
  if (key === "signature") {
    return Number(a.signatureRequested) - Number(b.signatureRequested);
  }
  return a[key].localeCompare(b[key], undefined, { sensitivity: "base" });
}

export function sortRowValues(
  rows: OrderInfoRowValues[],
  key: SortKey,
  dir: SortDir,
): OrderInfoRowValues[] {
  const sorted = [...rows].sort((a, b) => compareBy(a, b, key));
  return dir === "asc" ? sorted : sorted.reverse();
}
