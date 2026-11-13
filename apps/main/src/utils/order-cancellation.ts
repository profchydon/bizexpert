export type CancellationReasonId =
  "mistake" | "not-needed" | "timeline" | "specs" | "budget" | "other";

export const CANCELLATION_REASONS: {
  id: CancellationReasonId;
  label: string;
}[] = [
  { id: "mistake", label: "Ordered by mistake" },
  { id: "not-needed", label: "No longer need the item(s)" },
  { id: "timeline", label: "Delivery timeline too long" },
  { id: "specs", label: "Need to change specifications" },
  { id: "budget", label: "Budget constraints" },
  { id: "other", label: "Other" },
];

export function reasonLabel(id: CancellationReasonId): string {
  return (
    CANCELLATION_REASONS.find((reason) => reason.id === id)?.label ?? "Other"
  );
}

export function reasonIdFromLabel(label: string): CancellationReasonId {
  const normalized = label.trim().toLowerCase();
  const match = CANCELLATION_REASONS.find(
    (reason) => reason.label.toLowerCase() === normalized,
  );
  return match?.id ?? "other";
}

export type CancellationScope =
  | { kind: "full" }
  | { kind: "sub-orders"; employeeIds: string[] }
  | { kind: "items"; itemIds: string[] };

export type CancellationResolution =
  "pending" | "approved" | "declined" | "withdrawn";

export interface CancellationInfo {
  scope: CancellationScope;
  reasonId: CancellationReasonId;
  details?: string;
  requestedBy: string;
  requestedAt: string;
  resolution: CancellationResolution;
  declineReason?: string;
  selfServe?: boolean;
  unpaid?: boolean;
}

export function scopeLabel(
  scope: CancellationScope,
  totals: { subOrders: number; items: number },
): string {
  if (scope.kind === "full") return "Entire order";
  if (scope.kind === "sub-orders") {
    return `${scope.employeeIds.length} of ${totals.subOrders} sub-orders`;
  }
  return `${scope.itemIds.length} of ${totals.items} items`;
}

export function scopeSubject(scope: CancellationScope): string {
  if (scope.kind === "full") return "this order";
  if (scope.kind === "sub-orders") {
    return `${scope.employeeIds.length} sub-order${scope.employeeIds.length === 1 ? "" : "s"}`;
  }
  return `${scope.itemIds.length} device${scope.itemIds.length === 1 ? "" : "s"}`;
}

export function reasonLabelForApi(reasonId: CancellationReasonId): string {
  return reasonLabel(reasonId);
}
