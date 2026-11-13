import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";
import type { ApprovalItem, ApprovalRecord } from "./types";
import { objectValue, textValue } from "./approvalAssignmentValues";

export function approvalOrderSummaryItems({
  record,
  request,
}: {
  record: ApprovalRecord;
  request?: CatalogOrderRequestApi | null;
}) {
  const declinedRfqKeys = declinedRfqItemKeys(request);
  return record.items.filter(
    (item) => !isDeclinedRfqItem(item, declinedRfqKeys),
  );
}

function isDeclinedRfqItem(item: ApprovalItem, declinedRfqKeys: Set<string>) {
  return (
    item.source === "RFQ" &&
    itemKeys(item).some((key) => declinedRfqKeys.has(key))
  );
}

function declinedRfqItemKeys(request?: CatalogOrderRequestApi | null) {
  const keys = new Set<string>();
  requestRfqEntries(request).forEach((entry) =>
    addDeclinedRfqKeys(keys, entry),
  );
  return keys;
}

function requestRfqEntries(request?: CatalogOrderRequestApi | null) {
  const items = request?.items
    ? Array.isArray(request.items)
      ? request.items
      : (request.items.data ?? [])
    : [];
  return [...items, ...(request?.fulfillment?.rfq ?? [])];
}

function addDeclinedRfqKeys(keys: Set<string>, entry: unknown) {
  const item = objectValue(entry);
  const resolution = objectValue(item?.rfq_resolution);
  const status = textValue(resolution?.status).toLowerCase();
  const declined = status === "declined" || status === "rejected";
  if (!declined && resolution?.declined !== true) return;

  [
    textValue(item?.id),
    textValue(item?.kit_item_id),
    textValue(item?.asset_pricing_id),
    textValue(item?.asset_specification_id),
  ].forEach((key) => {
    if (key) keys.add(key);
  });
}

function itemKeys(item: ApprovalItem) {
  return [
    item.id,
    item.kitItemId,
    item.assetPricingId,
    item.assetSpecificationId,
  ].filter((key): key is string => Boolean(key));
}
