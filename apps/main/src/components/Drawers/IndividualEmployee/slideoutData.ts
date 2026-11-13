import { IOrder, ISubOrder } from "@/types/orders";
import formatAmount from "@/utils/formatAmount";
import { getSubOrderTracking } from "@/components/Drawers/getSubOrderTracking";
import { displayStatusForCompletedOfficeOrder } from "@/container/Dashboard/Orders/ViewOrder/v2/officeCompletedStatus";
import { formatCollectionWindow } from "./formatCollectionWindow";
import { resolveSlideoutItems, SlideoutItem } from "./slideoutItems";

export type { SlideoutItem } from "./slideoutItems";
export { joinLabelParts } from "./slideoutLabel";
export { relatedOffboardingSubOrders } from "./relatedOffboardingSubOrders";

export interface SlideoutParty {
  name: string;
  email: string;
  address: string;
}

export interface SlideoutData {
  name: string;
  email: string;
  status?: string;
  isOffice: boolean;
  contactLine: string;
  amount: string;
  address: string;
  actionType?: string;
  signatureRequested: boolean;
  isOffboarding: boolean;
  isReassignment: boolean;
  isStorageAction: boolean;
  window: string | null;
  items: SlideoutItem[];
  signatureEmployeeId?: string;
  progressLabel: string;
  recipient?: SlideoutParty;
  windowHelp: string;
  windowLocked: boolean;
  windowLockedNote: string;
  trackingNo: string;
  externalTrackingLink: string;
  courierName: string;
}

const WINDOW_LOCKED_STATUSES = new Set([
  "in_progress",
  "completed",
  "order_delivered",
  "delivered",
  "collection_completed",
  "picked_up",
  "sold",
  "in_storage",
]);

function resolveRecipient(details: any): SlideoutParty | undefined {
  const to = details?.to;
  if (!to) return undefined;
  const name = `${to.first_name || ""} ${to.last_name || ""}`.trim();
  if (!name && !to.email && !to.address) return undefined;
  return {
    name: name || "N/A",
    email: to.email || "-",
    address: to.address?.trim() || "-",
  };
}

function isOfficeRecipient(subOrder: ISubOrder | undefined): boolean {
  return subOrder?.recipient_type === "office" || Boolean(subOrder?.office_id);
}

function resolveName(subOrder: ISubOrder | undefined, details: any): string {
  if (isOfficeRecipient(subOrder)) {
    return subOrder?.office_name?.trim() || "Office";
  }
  const employee =
    `${subOrder?.employee_first_name || ""} ${subOrder?.employee_last_name || ""}`.trim();
  if (employee) return employee;
  const from =
    `${details?.from?.first_name || ""} ${details?.from?.last_name || ""}`.trim();
  if (from) return from;
  return subOrder?.equipment?.assignee?.name || "N/A";
}

function resolveAddress(subOrder: ISubOrder | undefined, details: any): string {
  return (
    subOrder?.address?.trim() ||
    subOrder?.office_address?.trim() ||
    details?.from?.address?.trim() ||
    details?.to?.address?.trim() ||
    subOrder?.equipment?.assignee?.address?.trim() ||
    "-"
  );
}

function parseServiceAmount(value?: string | number | null): number {
  if (value === undefined || value === null || value === "") return 0;
  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function subOrderServiceAmount(subOrder: ISubOrder): number {
  const fromTotal = parseServiceAmount(
    (subOrder as { total_amount?: string | number }).total_amount,
  );
  if (fromTotal > 0) return fromTotal;

  const fromAmount = parseServiceAmount(subOrder.amount);
  if (fromAmount > 0) return fromAmount;

  return parseServiceAmount(subOrder.equipment?.purchase_price);
}

export function buildSlideoutData(
  subOrder: ISubOrder | undefined,
  actionType: string | undefined,
  currency: string,
  relatedSubOrders?: ISubOrder[],
  order?: IOrder,
): SlideoutData {
  const isOffboarding = actionType === "offboarding";
  const type = subOrder?.type;
  const details = subOrder?.order_details as any;
  const itemSources =
    isOffboarding && relatedSubOrders?.length
      ? relatedSubOrders
      : subOrder
        ? [subOrder]
        : [];

  const serviceAmount = itemSources.reduce(
    (sum, row) => sum + subOrderServiceAmount(row),
    0,
  );

  const tracking = getSubOrderTracking(subOrder);
  const isDeliveryToEmployee = actionType === "storage_to_employee";
  const signatureRequested =
    isOffboarding || isDeliveryToEmployee
      ? Boolean(subOrder?.signature_requested)
      : Boolean(
          (subOrder?.assets?.[0] as { signature_requested?: boolean })
            ?.signature_requested,
        );

  let signatureEmployeeId = subOrder?.employee_id;
  if (type === "reassign") signatureEmployeeId = details?.to?.id || "";
  else if (type === "storage")
    signatureEmployeeId = subOrder?.equipment?.assignee?.id || "";

  const isOffice = isOfficeRecipient(subOrder);
  const contactName = subOrder?.contact_name?.trim();

  return {
    name: resolveName(subOrder, details),
    status:
      displayStatusForCompletedOfficeOrder(subOrder?.status, order, subOrder) ||
      subOrder?.status,
    isOffice,
    contactLine: isOffice && contactName ? `Contact: ${contactName}` : "",
    email:
      (isOffice ? subOrder?.contact_email : undefined) ||
      (subOrder as { recipient?: { email?: string } } | undefined)?.recipient
        ?.email ||
      details?.from?.email ||
      subOrder?.equipment?.assignee?.email ||
      "-",
    amount: serviceAmount ? `${currency}${formatAmount(serviceAmount)}` : "-",
    address: resolveAddress(subOrder, details),
    actionType: type,
    signatureRequested,
    isOffboarding,
    isReassignment: type === "reassign",
    isStorageAction: type === "storage",
    window: formatCollectionWindow(subOrder),
    items: resolveSlideoutItems(itemSources),
    signatureEmployeeId,
    progressLabel: isOffboarding
      ? "Retrieval progress"
      : "Verification progress",
    recipient: type === "reassign" ? resolveRecipient(details) : undefined,
    windowHelp: isOffboarding
      ? "Rayda collects the devices within this window. The employee verifies their address against it."
      : "Rayda delivers the devices within this window. The employee verifies their address against it.",
    windowLocked: WINDOW_LOCKED_STATUSES.has(
      (subOrder?.status || "").toLowerCase(),
    ),
    windowLockedNote: isOffboarding
      ? "Locked. A vendor accepted this pickup window, so it can no longer be changed."
      : "Locked. A vendor accepted this delivery window, so it can no longer be changed.",
    trackingNo: tracking.trackingNo,
    externalTrackingLink: tracking.externalTrackingLink,
    courierName: tracking.courierName,
  };
}
