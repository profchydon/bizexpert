import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";
import type { IEmployeeCatalogPolicy } from "@/types/employees";

export type EmployeeCatalogPolicyOrderRow = CatalogOrderRequestApi & {
  catalogPolicyName: string;
};
export type CatalogPolicyOrderItemDetail = {
  id: string;
  model?: string;
  name: string;
  quantity: number;
};

export function catalogPolicyOrdersToRows({
  catalogPolicy,
  payload,
}: {
  catalogPolicy?: Pick<IEmployeeCatalogPolicy, "id" | "name">;
  payload?: CatalogOrderRequestListPayload | CatalogOrderRequestApi[];
}): EmployeeCatalogPolicyOrderRow[] {
  const requests = extractOrderRequests(payload);

  return requests.map((request) => ({
    ...request,
    catalogPolicyName:
      request.catalog_policy?.name ??
      request.policy?.name ??
      catalogPolicy?.name ??
      "Catalog policy",
  }));
}

export function getCatalogPolicyOrderItemCount(
  request: CatalogOrderRequestApi,
) {
  const fulfillmentItems = getCatalogPolicyOrderItemDetails(request);
  if (fulfillmentItems.length) return fulfillmentItems.length;
  const items = request.items;
  if (!items) return 0;
  if (Array.isArray(items)) return items.length;
  return items.data?.length ?? 0;
}

export function getCatalogPolicyOrderQuantity(request: CatalogOrderRequestApi) {
  const fulfillmentItems = getCatalogPolicyOrderItemDetails(request);
  if (fulfillmentItems.length) {
    return fulfillmentItems.reduce((total, item) => total + item.quantity, 0);
  }
  const items = request.items;
  const list = Array.isArray(items) ? items : (items?.data ?? []);
  return list.reduce((total, item) => total + Number(item.quantity ?? 1), 0);
}

export function getCatalogPolicyOrderItemDetails(
  request: CatalogOrderRequestApi,
): CatalogPolicyOrderItemDetail[] {
  const fulfillmentItems = fulfillmentEntries(request).flatMap((entry) => {
    const asset = assetFromFulfillment(entry);
    const name = stringValue(asset?.name);
    const id =
      stringValue(entry.kit_item_id) ?? stringValue(entry.asset_pricing_id);
    if (!name || !id) return [];
    return [
      {
        id,
        model: modelName(asset?.model),
        name,
        quantity: numberValue(entry.quantity) ?? 1,
      },
    ];
  });
  if (fulfillmentItems.length) return fulfillmentItems;

  const items = request.items;
  const list = Array.isArray(items) ? items : (items?.data ?? []);
  return list.flatMap((item) => {
    const product = item.product ?? item.asset;
    const productRecord = recordValue(product);
    const name = stringValue(item.name ?? product?.name);
    const id = stringValue(
      item.id ?? item.kit_item_id ?? item.asset_pricing_id,
    );
    if (!name || !id) return [];
    return [
      {
        id,
        model: modelName(productRecord?.model),
        name,
        quantity: Number(item.quantity ?? 1),
      },
    ];
  });
}

export function getCatalogPolicyOrderTotal(request: CatalogOrderRequestApi) {
  return Number(request.total_amount ?? 0);
}

export function getCatalogPolicyOrderTotalLabel(
  request: CatalogOrderRequestApi,
) {
  const currency = getCatalogPolicyOrderCurrencyCode(request);
  const total = getCatalogPolicyOrderTotal(request).toLocaleString();
  return currency ? `${currency} ${total}` : total;
}

export function isRejectedCatalogPolicyOrder(request: CatalogOrderRequestApi) {
  return request.status?.toLowerCase() === "rejected";
}

export function getCatalogPolicyOrderRejectionReason(
  request: CatalogOrderRequestApi,
) {
  return request.rejection_reason || "-";
}

function getCatalogPolicyOrderCurrencyCode(request: CatalogOrderRequestApi) {
  if (typeof request.currency === "string") return request.currency;
  return request.currency?.code ?? "";
}

function extractOrderRequests(
  payload?: CatalogOrderRequestListPayload | CatalogOrderRequestApi[],
) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.data ?? [];
}

function fulfillmentEntries(request: CatalogOrderRequestApi) {
  return [
    ...(request.fulfillment?.storage ?? []),
    ...(request.fulfillment?.marketplace ?? []),
    ...(request.fulfillment?.rfq ?? []),
  ].filter(isRecord);
}

function assetFromFulfillment(entry: Record<string, unknown>) {
  const spec = recordValue(entry.asset_specification);
  const kitItem = recordValue(entry.kit_item);
  const kitItemSpec = recordValue(kitItem?.asset_specification);
  return recordValue(spec?.asset) ?? recordValue(kitItemSpec?.asset);
}

function modelName(value: unknown) {
  if (typeof value === "string") return value;
  if (isRecord(value)) return stringValue(value.name);
  return undefined;
}

function numberValue(value: unknown) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object";
}

function recordValue(value: unknown) {
  return isRecord(value) ? value : undefined;
}
