import { ISubOrder, VerificationContext } from "@/types/orders";
import { IAsset } from "@/types/assets";
import { VerifyOrderSubOrderPayload } from "@/api/baseQueries/companiesApi/ordersApi/verifyOrderAddress";
import {
  getApplicableContexts,
  getSubOrderPendingContexts,
  hasExplicitContextInfo,
} from "./verificationContexts";

const DETAILS_VERIFIED_STATUS = "details_verified";

const NON_VERIFIABLE_FULFILLMENT_STATUSES = new Set([
  "order_cancelled",
  "cancelled",
  "awaiting_cancellation",
  "cancellation_denied",
  "order_in_transit",
  "in_transit",
  "order_delivered",
  "picked_up",
  "delivered",
  "completed",
]);

const getAssetVerificationStatus = (asset?: IAsset) =>
  String(
    (asset as any)?.verification_status ?? asset?.status ?? "",
  ).toLowerCase();

export const isAssetDetailsVerified = (asset?: IAsset) =>
  getAssetVerificationStatus(asset) === DETAILS_VERIFIED_STATUS;

const isFulfillmentLocked = (status?: unknown) =>
  NON_VERIFIABLE_FULFILLMENT_STATUSES.has(String(status ?? "").toLowerCase());

const getSubOrderVerificationStatus = (subOrder?: ISubOrder) =>
  String(
    (subOrder as any)?.verification_status ?? subOrder?.status ?? "",
  ).toLowerCase();

const getOffboardingSubOrderId = (subOrder?: ISubOrder) =>
  subOrder?.id || undefined;

const getSubOrderVerifiableIds = (subOrder: ISubOrder): string[] => {
  if (isFulfillmentLocked(subOrder.status)) {
    return [];
  }

  const assets = subOrder.assets || [];

  if (assets.length > 0) {
    return assets
      .filter(
        (asset) =>
          !isAssetDetailsVerified(asset) && !isFulfillmentLocked(asset.status),
      )
      .map((asset) => asset?.asset_order_id)
      .filter(Boolean) as string[];
  }

  if (hasExplicitContextInfo(subOrder)) {
    return getSubOrderPendingContexts(subOrder).length > 0 && subOrder.id
      ? [subOrder.id]
      : [];
  }

  const offboardingSubOrderId = getOffboardingSubOrderId(subOrder);
  if (
    offboardingSubOrderId &&
    getSubOrderVerificationStatus(subOrder) !== DETAILS_VERIFIED_STATUS
  ) {
    return [offboardingSubOrderId];
  }

  return [];
};

export const getVerifiableAssetOrderIds = (subOrders: ISubOrder[]) => [
  ...new Set(subOrders.flatMap(getSubOrderVerifiableIds)),
];

export const hasVerifiableAssetOrder = (subOrder?: ISubOrder) =>
  !!subOrder && getVerifiableAssetOrderIds([subOrder]).length > 0;

const getSubOrderVerifiableContexts = (
  subOrder: ISubOrder,
  selectedContexts?: VerificationContext[],
): VerificationContext[] => {
  if (selectedContexts?.length) return selectedContexts;

  const pending = getSubOrderPendingContexts(subOrder);
  return pending.length ? pending : getApplicableContexts(subOrder);
};

export const buildVerifyOrderSuborders = (
  subOrders: ISubOrder[],
  selectedContexts?: VerificationContext[],
): VerifyOrderSubOrderPayload[] => {
  const result: VerifyOrderSubOrderPayload[] = [];
  const seen = new Set<string>();

  for (const subOrder of subOrders) {
    const ids = getSubOrderVerifiableIds(subOrder);
    if (!ids.length) continue;

    const verification_contexts = getSubOrderVerifiableContexts(
      subOrder,
      selectedContexts,
    );

    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      result.push({ id, verification_contexts });
    }
  }

  return result;
};
