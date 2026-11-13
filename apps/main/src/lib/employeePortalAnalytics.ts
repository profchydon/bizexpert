import { track } from "@/lib/analytics";

export function trackEmployeeCatalogViewed(): void {
  track("Employee Catalog Viewed");
}

export function trackEmployeeOrderSubmitted(properties: {
  order_id: string;
  item_count: number;
  total_value: number;
}): void {
  track("Employee Order Submitted", properties);
}

export function trackTrackPageViewed(properties: { order_id: string }): void {
  track("Track Page Viewed", properties);
}

export function trackDeliveryVerified(): void {
  track("Delivery Verified");
}

export function trackEmployeeAssetViewed(): void {
  track("Employee Asset Viewed");
}
