import { ISubOrder } from "@/types/orders";

interface TrackingSource {
  tracking_no?: string | null;
  external_tracking_link?: string | null;
  courier_name?: string | null;
}

function firstText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const text = value?.trim();
    if (text) return text;
  }
  return "";
}

export function getSubOrderTracking(
  subOrder?: ISubOrder,
  asset?: TrackingSource,
) {
  return {
    trackingNo: firstText(asset?.tracking_no, subOrder?.tracking_no),
    externalTrackingLink: firstText(
      subOrder?.external_tracking_link,
      asset?.external_tracking_link,
    ),
    courierName: firstText(subOrder?.courier_name, asset?.courier_name),
  };
}
