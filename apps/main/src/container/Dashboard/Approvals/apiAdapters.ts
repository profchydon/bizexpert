import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestItem,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";

import type {
  ApprovalEmployee,
  ApprovalItem,
  ApprovalRecord,
  ApprovalStatus,
  ItemSource,
  ItemTier,
} from "./types";

export function orderRequestListToRecords(
  payload?: CatalogOrderRequestListPayload | CatalogOrderRequestApi[],
  catalogId?: string,
) {
  return extractRequests(payload).map((request) =>
    orderRequestToRecord(request, catalogId),
  );
}

export function orderRequestToRecord(
  request: CatalogOrderRequestApi,
  catalogId = getRequestCatalogId(request),
): ApprovalRecord {
  const employee = orderRequestToEmployee(request);
  const fulfillmentByItemKey = fulfillmentDetailsByItemKey(request);
  const items = approvalItemsFromRequest(request, fulfillmentByItemKey);
  return {
    id: request.id,
    catalogId,
    catalogRuleId: request.catalog_rule_id ?? undefined,
    employee,
    employeeId: employee.id,
    kitId:
      request.kit?.id ||
      firstFulfillmentDetail(fulfillmentByItemKey, "kitId") ||
      undefined,
    kitName:
      nameFrom(request.kit) ||
      firstFulfillmentDetail(fulfillmentByItemKey, "kitName") ||
      undefined,
    matchedRuleName:
      nameFrom(request.matched_rule) ||
      nameFrom(request.rule) ||
      nameFrom(request.catalog_policy) ||
      nameFrom(request.policy) ||
      nameFrom(request.catalog) ||
      undefined,
    allowItemSwap:
      request.allow_item_swap ?? request.rule?.allow_item_swap ?? false,
    items,
    budgetAmount: numberValue(request.budget_evaluation?.budget),
    budgetTotalAmount: numberValue(
      request.budget_evaluation?.total ?? request.total_amount,
    ),
    budgetExceeded: budgetExceeded(request),
    currencyCode: currencyCode(request.currency),
    currencySymbol: currencySymbol(request.currency),
    fulfillmentSources: fulfillmentSources(request),
    status: normalizeStatus(request.status),
    totalAmount: orderRequestTotalAmount(request, items),
    createdAt: request.created_at ?? request.updated_at ?? undefined,
    updatedAt: request.updated_at ?? undefined,
    actionedBy: actionedBy(request),
    orderId: request.order_id ?? undefined,
    orderNote: request.order_note ?? undefined,
    rejectionReason: request.rejection_reason ?? undefined,
    orderRef: request.order?.order_number ?? undefined,
  };
}

export function orderRequestToEmployee(
  request: CatalogOrderRequestApi,
): ApprovalEmployee {
  const employee = request.employee;
  const name = employeeName(employee) || undefined;
  return {
    id: employee?.id ?? request.employee_id ?? "",
    name,
    initials: name ? initialsFromName(name) : undefined,
    role: employee?.job_title ?? employee?.role ?? undefined,
    country: valueName(employee?.country) || undefined,
    level: valueName(employee?.level) || undefined,
  };
}

export function buildEmployeesMap(
  records: ApprovalRecord[],
): Map<string, ApprovalEmployee> {
  const entries = records.flatMap((record): [string, ApprovalEmployee][] =>
    record.employee?.id ? [[record.employee.id, record.employee]] : [],
  );
  return new Map(entries);
}

function extractRequests(
  payload?: CatalogOrderRequestListPayload | CatalogOrderRequestApi[],
) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.requests)) return payload.requests;
  if (Array.isArray(payload.order_requests)) return payload.order_requests;
  if (Array.isArray(payload.pending_approvals))
    return payload.pending_approvals;
  return [];
}

function extractItems(
  items?: CatalogOrderRequestApi["items"],
): CatalogOrderRequestItem[] {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  return items.data ?? [];
}

function approvalItemsFromRequest(
  request: CatalogOrderRequestApi,
  fulfillmentByItemKey: Map<string, FulfillmentItemDetail>,
) {
  const requestItemsByKey = requestItemsByLookupKey(request);
  const fulfillmentItems = fulfillmentEntries(request).flatMap(
    ([source, entry]) =>
      fulfillmentEntryToApprovalItem(entry, source, requestItemsByKey),
  );
  if (fulfillmentItems.length) return fulfillmentItems;
  return extractItems(request.items).map((item) =>
    orderRequestItemToApprovalItem(item, fulfillmentByItemKey),
  );
}

function orderRequestItemToApprovalItem(
  item: CatalogOrderRequestItem,
  fulfillmentByItemKey: Map<string, FulfillmentItemDetail> = new Map(),
): ApprovalItem {
  const fulfillment =
    fulfillmentByItemKey.get(item.kit_item_id ?? "") ??
    fulfillmentByItemKey.get(item.asset_pricing_id ?? "");
  const product = item.product ?? item.asset;
  return {
    id:
      item.id ?? item.kit_item_id ?? item.asset_pricing_id ?? product?.id ?? "",
    amount: item.amount == null ? undefined : Number(item.amount),
    assetPricingId: item.asset_pricing_id ?? undefined,
    assetSpecificationId: item.asset_specification_id ?? undefined,
    assetType: fulfillment?.assetType,
    categoryId: fulfillment?.categoryId,
    description: fulfillment?.description,
    kitId: fulfillment?.kitId,
    kitItemId: item.kit_item_id ?? undefined,
    name: item.name ?? product?.name ?? fulfillment?.name ?? undefined,
    category:
      valueName(item.category) ||
      valueName(product?.category) ||
      fulfillment?.category ||
      undefined,
    tier: normalizeTier(item.tier) ?? fulfillment?.tier,
    quantity: item.quantity == null ? undefined : Number(item.quantity),
    rfqBudgetPerUnit:
      item.budget_per_unit == null
        ? fulfillment?.rfqBudgetPerUnit
        : Number(item.budget_per_unit),
    source: normalizeSource(item.source) ?? fulfillment?.source,
    leadTimeDays:
      item.lead_time_days == null ? undefined : Number(item.lead_time_days),
    imageUrl:
      item.image_url ??
      item.images?.[0] ??
      product?.image_url ??
      product?.images?.[0] ??
      fulfillment?.imageUrl,
  };
}

function fulfillmentEntryToApprovalItem(
  entry: unknown,
  source: ItemSource,
  requestItemsByKey: Map<string, CatalogOrderRequestItem>,
): ApprovalItem[] {
  if (!isRecord(entry)) return [];
  const kitItemId = stringValue(entry.kit_item_id);
  const assetPricingId = stringValue(entry.asset_pricing_id);
  const id =
    kitItemId ?? assetPricingId ?? stringValue(entry.asset_specification_id);
  if (!id) return [];
  const requestItem =
    requestItemsByKey.get(kitItemId ?? "") ??
    requestItemsByKey.get(assetPricingId ?? "");
  const detail = fulfillmentDetailFromEntry(entry, source);
  return [
    {
      id,
      amount:
        fulfillmentLineAmount(source, entry, requestItem) ??
        numberValue(entry.amount ?? entry.unit_amount) ??
        numberValue(requestItem?.amount),
      assetPricingId:
        assetPricingId ?? requestItem?.asset_pricing_id ?? undefined,
      assetSpecificationId:
        stringValue(entry.asset_specification_id) ??
        requestItem?.asset_specification_id ??
        undefined,
      assetType: detail.assetType,
      category: detail.category,
      categoryId: detail.categoryId,
      description: detail.description,
      imageUrl: detail.imageUrl,
      kitId: detail.kitId,
      kitItemId,
      name: detail.name,
      quantity:
        numberValue(entry.quantity) ?? numberValue(requestItem?.quantity),
      rfqBudgetPerUnit:
        numberValue(entry.budget_per_unit) ??
        numberValue(requestItem?.budget_per_unit),
      source,
      tier: detail.tier,
    },
  ];
}

function fulfillmentLineAmount(
  source: ItemSource,
  entry: Record<string, unknown>,
  requestItem?: CatalogOrderRequestItem,
) {
  if (source === "STORAGE") {
    const estimatedUnitAmount = numberValue(entry.estimated_unit_amount);
    if (estimatedUnitAmount == null) return undefined;
    const quantity =
      numberValue(entry.quantity) ?? numberValue(requestItem?.quantity) ?? 1;
    return estimatedUnitAmount * quantity;
  }

  if (source !== "UNAVAILABLE" && source !== "RFQ") return undefined;
  const budget =
    numberValue(entry.budget_per_unit) ??
    numberValue(requestItem?.budget_per_unit);
  if (budget == null) return undefined;
  const quantity =
    numberValue(entry.quantity) ?? numberValue(requestItem?.quantity) ?? 1;
  return budget * quantity;
}

function orderRequestTotalAmount(
  request: CatalogOrderRequestApi,
  items: ApprovalItem[],
) {
  const budgetTotal = numberValue(request.budget_evaluation?.total);
  if (budgetTotal != null) return budgetTotal;

  const hasItemAmounts = items.some((item) => item.amount != null);
  const calculatedTotal = items.reduce(
    (total, item) => total + (item.amount ?? 0),
    0,
  );
  if (hasItemAmounts) return calculatedTotal;

  return numberValue(request.total_amount);
}

function budgetExceeded(request: CatalogOrderRequestApi) {
  const evaluation = request.budget_evaluation;
  if (typeof evaluation?.is_exceeded === "boolean") {
    return evaluation.is_exceeded;
  }
  const budget = numberValue(evaluation?.budget);
  const total = numberValue(evaluation?.total ?? request.total_amount);
  return budget != null && total != null ? total > budget : undefined;
}

function requestItemsByLookupKey(request: CatalogOrderRequestApi) {
  const items = extractItems(request.items);
  const byKey = new Map<string, CatalogOrderRequestItem>();
  items.forEach((item) => {
    [item.kit_item_id, item.asset_pricing_id]
      .filter((key): key is string => Boolean(key))
      .forEach((key) => byKey.set(key, item));
  });
  return byKey;
}

type FulfillmentItemDetail = {
  assetType?: string;
  category?: string;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
  kitId?: string;
  kitName?: string;
  name?: string;
  rfqBudgetPerUnit?: number;
  source?: ItemSource;
  tier?: ItemTier;
};

function fulfillmentDetailsByItemKey(request: CatalogOrderRequestApi) {
  const details = new Map<string, FulfillmentItemDetail>();

  fulfillmentEntries(request).forEach(([source, entry]) => {
    if (!isRecord(entry)) return;
    const detail = fulfillmentDetailFromEntry(entry, source);
    [stringValue(entry.kit_item_id), stringValue(entry.asset_pricing_id)]
      .filter((key): key is string => Boolean(key))
      .forEach((key) => details.set(key, detail));
  });

  return details;
}

function fulfillmentEntries(request: CatalogOrderRequestApi) {
  const entries: [ItemSource, unknown[] | null | undefined][] = [
    ["STORAGE", request.fulfillment?.storage],
    ["MARKETPLACE", request.fulfillment?.marketplace],
    ["UNAVAILABLE", request.fulfillment?.unavailable],
    ["RFQ", request.fulfillment?.rfq],
  ];
  return entries.flatMap(([source, values]) =>
    (values ?? []).map((entry) => [source, entry] as const),
  );
}

function fulfillmentDetailFromEntry(
  entry: Record<string, unknown>,
  source: ItemSource,
): FulfillmentItemDetail {
  const spec = recordValue(entry.asset_specification);
  const kitItem = recordValue(entry.kit_item);
  const kitItemSpec = recordValue(kitItem?.asset_specification);
  const asset = recordValue(spec?.asset) ?? recordValue(kitItemSpec?.asset);
  const category = recordValue(asset?.category);
  const type =
    recordValue(asset?.type) ??
    recordValue(spec?.asset_type) ??
    recordValue(kitItemSpec?.asset_type);

  return {
    assetType: stringValue(type?.id) ?? stringValue(type?.name),
    category: stringValue(category?.name),
    categoryId: stringValue(category?.id),
    description: stringValue(asset?.description),
    imageUrl:
      imageFromRecord(spec) ??
      imageFromRecord(kitItemSpec) ??
      imageFromRecord(asset),
    kitId:
      stringValue(recordValue(entry.kit)?.id) ?? stringValue(kitItem?.kit_id),
    kitName: stringValue(recordValue(entry.kit)?.name),
    name: stringValue(asset?.name) ?? stringValue(entry.name),
    rfqBudgetPerUnit: numberValue(entry.budget_per_unit),
    source,
    tier: kitItem?.required === true ? "REQUIRED" : undefined,
  };
}

function firstFulfillmentDetail(
  details: Map<string, FulfillmentItemDetail>,
  key: keyof FulfillmentItemDetail,
) {
  for (const detail of details.values()) {
    const value = detail[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function currencyCode(currency: CatalogOrderRequestApi["currency"]) {
  if (typeof currency === "string") return currency;
  return currency?.code ?? undefined;
}

function currencySymbol(currency: CatalogOrderRequestApi["currency"]) {
  if (typeof currency === "string") return undefined;
  return currency?.symbol ?? undefined;
}

function fulfillmentSources(request: CatalogOrderRequestApi): ItemSource[] {
  const summary = request.fulfillment?.summary;
  if (!summary) return [];

  const sourceCounts: [ItemSource, unknown][] = [
    ["STORAGE", summary.storage_count],
    ["MARKETPLACE", summary.marketplace_count],
    ["UNAVAILABLE", summary.unavailable_count],
    ["RFQ", summary.rfq_count],
  ];

  return sourceCounts.flatMap(([source, count]) =>
    Number(count ?? 0) > 0 ? [source] : [],
  );
}

function normalizeStatus(status?: string | null): ApprovalStatus | undefined {
  const value = (status ?? "").toLowerCase();
  if (["awaiting_rfq", "pending_rfq", "rfq"].includes(value)) {
    return "AWAITING_RFQ";
  }
  if (["awaiting_approval", "pending_approval", "pending"].includes(value)) {
    return "AWAITING_APPROVAL";
  }
  if (["approved", "placed", "completed"].includes(value)) return "APPROVED";
  if (["rejected", "failed", "declined"].includes(value)) return "FAILED";
  if (value === "cancelled" || value === "canceled") return "CANCELLED";
  return undefined;
}

function normalizeTier(tier?: string | null): ItemTier | undefined {
  const value = (tier ?? "").toUpperCase();
  if (value.includes("IMPORTANT")) return "IMPORTANT";
  if (value.includes("OPTIONAL")) return "OPTIONAL";
  if (value.includes("REQUIRED")) return "REQUIRED";
  return undefined;
}

function normalizeSource(source?: string | null) {
  const value = (source ?? "").toUpperCase();
  if (value.includes("RFQ")) return "RFQ";
  if (value.includes("UNAVAILABLE")) return "UNAVAILABLE";
  if (value.includes("MARKET")) return "MARKETPLACE";
  if (value.includes("STORAGE")) return "STORAGE";
  return undefined;
}

function actionedBy(request: CatalogOrderRequestApi) {
  const status = normalizeStatus(request.status);
  const approvedBy =
    typeof request.approved_by === "object" ? request.approved_by : null;
  const actor =
    status === "APPROVED"
      ? (request.approver ?? approvedBy ?? request.actioned_by)
      : (request.actioned_by ??
        request.rejected_by ??
        request.approver ??
        approvedBy);
  const name = employeeName(actor);
  const actionedAt =
    status === "APPROVED"
      ? (request.approved_at ?? request.updated_at ?? request.created_at)
      : (request.updated_at ?? request.created_at);
  return name ? { admin: name, at: actionedAt ?? undefined } : undefined;
}

function employeeName(
  employee?: {
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  } | null,
) {
  return (
    employee?.name ||
    [employee?.first_name, employee?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    employee?.email ||
    ""
  );
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function valueName(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "name" in value) {
    return String(value.name ?? "");
  }
  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function recordValue(value: unknown) {
  return isRecord(value) ? value : undefined;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function numberValue(value: unknown) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function imageFromRecord(value?: Record<string, unknown>) {
  const images = value?.images;
  if (Array.isArray(images)) return stringValue(images[0]);
  return stringValue(value?.image_url ?? value?.image);
}

function nameFrom(value?: { name?: string | null } | null) {
  return value?.name ?? "";
}

function getRequestCatalogId(request: CatalogOrderRequestApi) {
  return (
    request.catalog_policy_id ??
    request.policy_id ??
    request.catalog_id ??
    request.catalog_policy?.id ??
    request.policy?.id ??
    request.catalog?.id ??
    ""
  );
}
