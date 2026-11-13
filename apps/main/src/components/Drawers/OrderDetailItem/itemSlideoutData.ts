import dayjs from "dayjs";
import { IAsset } from "@/types/assets";
import { IOrder, ISubOrder } from "@/types/orders";
import formatAmount from "@/utils/formatAmount";
import { joinLabelParts } from "@/components/Drawers/IndividualEmployee/slideoutData";
import {
  DEVICE_CONFIG_LABEL,
  normalizeDeviceConfig,
} from "@/container/Dashboard/Orders/ViewOrder/v2/orderDeviceConfig";
import { getExpectedDateField } from "@/container/Dashboard/Orders/ViewOrder/v2/orderSidebarFields";
import { getSubOrderTracking } from "@/components/Drawers/getSubOrderTracking";
import { displayStatusForCompletedOfficeOrder } from "@/container/Dashboard/Orders/ViewOrder/v2/officeCompletedStatus";

export interface ItemHistoryStep {
  id: string;
  label: string;
  time: string;
  current: boolean;
}

export interface ItemSlideoutData {
  index: number;
  title: string;
  image?: string;
  status?: string;
  signatureRequested: boolean;
  price: string;
  tracking?: string;
  externalTrackingLink?: string;
  courierName?: string;
  expectedLabel?: string;
  expectedValue?: string;
  configLabel?: string;
  isOffboarding: boolean;
  history: ItemHistoryStep[];
  historyCaption: string;
}

function labelFromStatus(status: string): string {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function buildHistory(asset?: IAsset): ItemHistoryStep[] {
  const events = Array.isArray(asset?.events) ? [...asset!.events] : [];
  events.sort(
    (a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf(),
  );
  return events.map((event, index) => ({
    id: event.id,
    label: labelFromStatus(event.status),
    time: dayjs(event.created_at).format("DD/MM/YYYY, h:mma"),
    current: index === 0,
  }));
}

function priceOf(asset?: IAsset): string {
  const pricing = asset?.asset_pricing;
  if (!pricing?.amount) return "—";
  const symbol = pricing.currency?.symbol || "";
  return `${symbol}${formatAmount(pricing.amount)}`;
}

export function buildItemSlideoutData(
  asset: IAsset | undefined,
  order: IOrder | undefined,
  subOrder: ISubOrder | undefined,
): ItemSlideoutData {
  const isOffboarding = order?.type === "offboarding";
  const assetsList = Array.isArray(subOrder?.assets) ? subOrder!.assets : [];
  const foundIndex = assetsList.findIndex((entry) => entry.id === asset?.id);
  const expected = getExpectedDateField(order);
  const tracking = getSubOrderTracking(
    subOrder,
    asset as
      | {
          tracking_no?: string;
          external_tracking_link?: string | null;
          courier_name?: string | null;
        }
      | undefined,
  );
  const config = normalizeDeviceConfig(
    (asset as { device_setup?: string } | undefined)?.device_setup,
  );

  return {
    index: Math.max(foundIndex, 0),
    title:
      joinLabelParts(asset?.name, asset?.make, asset?.model) ||
      asset?.name ||
      "Item",
    image: asset?.images?.[0],
    status:
      displayStatusForCompletedOfficeOrder(asset?.status, order, subOrder) ??
      asset?.status,
    signatureRequested: Boolean(
      (asset as { signature_requested?: boolean } | undefined)
        ?.signature_requested,
    ),
    price: priceOf(asset),
    tracking: tracking.trackingNo || undefined,
    externalTrackingLink: tracking.externalTrackingLink || undefined,
    courierName: tracking.courierName || undefined,
    expectedLabel: expected?.label,
    expectedValue: expected?.value,
    configLabel:
      !isOffboarding && config ? DEVICE_CONFIG_LABEL[config] : undefined,
    isOffboarding,
    history: buildHistory(asset),
    historyCaption: isOffboarding
      ? "Track the device from retrieval through inspection and secure data wipe."
      : "Track the progress of your order from confirmation to delivery.",
  };
}
