import { IOrderParty, ISubOrder, VerificationContext } from "@/types/orders";

const VERIFICATION_PENDING_STATUS = "verification_pending";
const DETAILS_VERIFIED_STATUS = "details_verified";

export type VerifyModalState =
  | {
      type: "single";
      subOrderId: string;
    }
  | {
      type: "bulk";
      bulkMode: "selected" | "all_pending";
      subOrderIds: string[];
    }
  | null;

export interface VerificationTarget {
  subOrderId: string;
  context: VerificationContext;
  name: string;
  address: string;
  hasExplicitContext: boolean;
  isPending: boolean;
}

export const targetKey = (subOrderId: string, context: VerificationContext) =>
  `${subOrderId}:${context}`;

export const isVerificationContext = (
  value: unknown,
): value is VerificationContext => value === "pickup" || value === "delivery";

const normalizeStatus = (status?: unknown) =>
  typeof status === "string" ? status.toLowerCase() : "";

const isContextPending = (status?: unknown) =>
  normalizeStatus(status) === VERIFICATION_PENDING_STATUS;

const isContextVerified = (status?: unknown) =>
  normalizeStatus(status) === DETAILS_VERIFIED_STATUS;

export const hasExplicitContextInfo = (subOrder?: ISubOrder) =>
  !!subOrder &&
  (Array.isArray(subOrder.pending_contexts) ||
    subOrder.pickup_verification_status != null ||
    subOrder.delivery_verification_status != null);

export const getSubOrderPendingContexts = (
  subOrder?: ISubOrder,
): VerificationContext[] => {
  if (!subOrder) return [];

  const explicit = subOrder.pending_contexts;
  if (Array.isArray(explicit)) {
    return explicit.filter(isVerificationContext);
  }

  const derived: VerificationContext[] = [];
  if (isContextPending(subOrder.pickup_verification_status)) {
    derived.push("pickup");
  }
  if (isContextPending(subOrder.delivery_verification_status)) {
    derived.push("delivery");
  }
  return derived;
};

const fullName = (party?: IOrderParty) => {
  if (!party) return "";
  const composed = `${party.first_name ?? ""} ${party.last_name ?? ""}`.trim();
  return composed || party.name || "";
};

const legacyName = (subOrder: ISubOrder) => {
  const employeeName =
    `${subOrder.employee_first_name ?? ""} ${subOrder.employee_last_name ?? ""}`.trim();
  return employeeName || subOrder.equipment?.assignee?.name || "N/A";
};

const getContextStatus = (subOrder: ISubOrder, context: VerificationContext) =>
  context === "pickup"
    ? subOrder.pickup_verification_status
    : subOrder.delivery_verification_status;

export const getApplicableContexts = (
  subOrder: ISubOrder,
): VerificationContext[] => {
  const type = (subOrder.type || "").toLowerCase();
  if (type === "reassign") return ["pickup", "delivery"];
  if (type === "storage" || type === "resale") return ["pickup"];

  const derived = new Set<VerificationContext>();
  (["pickup", "delivery"] as VerificationContext[]).forEach((context) => {
    if (getContextStatus(subOrder, context) != null) derived.add(context);
  });
  getSubOrderPendingContexts(subOrder).forEach((context) =>
    derived.add(context),
  );
  return derived.size ? [...derived] : ["delivery"];
};

const isContextualSubOrder = (subOrder: ISubOrder) => {
  const type = (subOrder.type || "").toLowerCase();
  return (
    hasExplicitContextInfo(subOrder) ||
    type === "reassign" ||
    type === "storage" ||
    type === "resale"
  );
};

const getPartyForContext = (
  subOrder: ISubOrder,
  context: VerificationContext,
): { name: string; address: string } => {
  const details = subOrder.order_details;

  if (context === "pickup") {
    if (details?.from) {
      return {
        name: fullName(details.from),
        address: details.from.address || "",
      };
    }
    const assignee = subOrder.equipment?.assignee;
    if (assignee) {
      return { name: assignee.name || "", address: assignee.address || "" };
    }
  }

  if (context === "delivery" && details?.to) {
    return { name: fullName(details.to), address: details.to.address || "" };
  }

  return { name: legacyName(subOrder), address: subOrder.address || "" };
};

export const getVerificationTargets = (
  subOrder?: ISubOrder,
): VerificationTarget[] => {
  if (!subOrder) return [];

  if (isContextualSubOrder(subOrder)) {
    return getApplicableContexts(subOrder).map((context) => ({
      subOrderId: subOrder.id,
      context,
      ...getPartyForContext(subOrder, context),
      hasExplicitContext: true,
      isPending: !isContextVerified(getContextStatus(subOrder, context)),
    }));
  }

  return [
    {
      subOrderId: subOrder.id,
      context: "delivery",
      name: legacyName(subOrder),
      address: subOrder.address || "",
      hasExplicitContext: false,
      isPending: true,
    },
  ];
};
