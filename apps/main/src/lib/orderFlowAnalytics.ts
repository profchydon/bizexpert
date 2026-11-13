import { track } from "@/lib/analytics";

export type EquipSurface = "equip_employee" | "onboard_devices";
export type ItemSource = "storage" | "marketplace" | "rfq";
export type OrderFlow =
  | "equip_employee"
  | "approval"
  | "buy_to_storage"
  | "onboarding"
  | "storage-actions";
export type StorageActionKind = "deploy" | "dispose" | "check";

const STORAGE_KIND_MAP: Record<string, StorageActionKind> = {
  deployment: "deploy",
  disposal: "dispose",
  device_check: "check",
  storage_deploy_to_employee: "deploy",
  storage_disposal: "dispose",
  storage_device_check: "check",
};

export function mapStorageActionKind(
  kind: string | undefined,
): StorageActionKind | undefined {
  if (!kind) return undefined;
  return STORAGE_KIND_MAP[kind];
}

export function uniqueStorageActionKind(
  kinds: Array<string | undefined>,
): StorageActionKind | undefined {
  const mapped = kinds
    .map((kind) => mapStorageActionKind(kind))
    .filter((kind): kind is StorageActionKind => Boolean(kind));
  const unique = new Set(mapped);
  if (unique.size !== 1) return undefined;
  return [...unique][0];
}

export function trackEquipFlowStarted(
  surface: EquipSurface,
  employeeCount: number,
): void {
  track("Equip Flow Started", {
    surface,
    employee_count: employeeCount,
  });
}

export function trackItemSourceSelected(
  source: ItemSource,
  surface: EquipSurface,
): void {
  track("Item Source Selected", { source, surface });
}

export function trackStorageActionQueued(actionKind?: StorageActionKind): void {
  track(
    "Storage Action Queued",
    actionKind ? { action_kind: actionKind } : undefined,
  );
}

export function trackOrderSummaryViewed(properties: {
  order_flow: OrderFlow;
  item_count: number;
  total_value: number;
  currency: string;
}): void {
  track("Order Summary Viewed", properties);
}

export function trackOrderSubmitted(properties: {
  order_flow: OrderFlow;
  order_id: string;
  item_count: number;
  total_value: number;
  payment_method: "Card" | "Credit";
  action_kind?: StorageActionKind;
}): void {
  track("Order Submitted", {
    order_flow: properties.order_flow,
    order_id: properties.order_id,
    item_count: properties.item_count,
    total_value: properties.total_value,
    payment_method: properties.payment_method,
    ...(properties.action_kind ? { action_kind: properties.action_kind } : {}),
  });
}

export function trackOrderCancelled(properties: {
  order_flow: OrderFlow;
  step_abandoned: string;
}): void {
  track("Order Cancelled", properties);
}

export function resolveOrderSummaryFlow({
  isApprovalFlow,
  isEquipEmployeeFlow,
  isStorageActionsFlow,
  isStorageOnlyFlow,
}: {
  isApprovalFlow: boolean;
  isEquipEmployeeFlow: boolean;
  isStorageActionsFlow?: boolean;
  isStorageOnlyFlow: boolean;
}): OrderFlow {
  if (isApprovalFlow) return "approval";
  if (isEquipEmployeeFlow) return "equip_employee";
  if (isStorageActionsFlow) return "storage-actions";
  if (isStorageOnlyFlow) return "buy_to_storage";
  return "onboarding";
}

export function extractOrderIdFromResponse(
  response: unknown,
  fallback = "",
): string {
  const data = (response as { data?: Record<string, unknown> })?.data;
  if (!data) return fallback;

  const orderId = data.order_id;
  if (typeof orderId === "string" && orderId.length > 0) return orderId;

  const id = data.id;
  if (typeof id === "string" && id.length > 0) return id;

  const link = data.link;
  if (typeof link === "string") {
    try {
      const parsed = new URL(link, "https://rayda.co");
      const fromQuery =
        parsed.searchParams.get("order_id") ??
        parsed.searchParams.get("orderId");
      if (fromQuery) return fromQuery;
    } catch {
      return fallback;
    }
  }

  const paymentLink = (data.payment as { link?: unknown } | undefined)?.link;
  if (typeof paymentLink === "string") {
    try {
      const parsed = new URL(paymentLink, "https://rayda.co");
      const fromQuery =
        parsed.searchParams.get("order_id") ??
        parsed.searchParams.get("orderId");
      if (fromQuery) return fromQuery;
    } catch {
      return fallback;
    }
  }

  return fallback;
}
