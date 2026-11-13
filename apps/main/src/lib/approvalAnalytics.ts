import type {
  ApprovalStatus,
  ItemTier,
} from "@/container/Dashboard/Approvals/types";
import { track } from "@/lib/analytics";

export type ApprovalReviewDecision = "approved" | "rejected";
export type RfqQuoteDecision = "accepted" | "declined";

const TIER_PRIORITY: ItemTier[] = ["REQUIRED", "IMPORTANT", "OPTIONAL"];

export function extractPrimaryApprovalTier(
  items: { tier?: ItemTier }[],
): ItemTier | undefined {
  return TIER_PRIORITY.find((tier) => items.some((item) => item.tier === tier));
}

export function computeTimeToDecisionSeconds(
  createdAt?: string,
): number | undefined {
  if (!createdAt) return undefined;
  const queuedMs = Date.parse(createdAt);
  if (!Number.isFinite(queuedMs)) return undefined;
  return Math.max(0, Math.round((Date.now() - queuedMs) / 1000));
}

export function trackApprovalQueued(properties: {
  approval_id: string;
  status: ApprovalStatus;
  tier?: ItemTier;
}): void {
  track("Approval Queued", properties);
}

export function trackApprovalReviewed(properties: {
  approval_id: string;
  decision: ApprovalReviewDecision;
  time_to_decision_s?: number;
}): void {
  track("Approval Reviewed", {
    approval_id: properties.approval_id,
    decision: properties.decision,
    ...(properties.time_to_decision_s != null
      ? { time_to_decision_s: properties.time_to_decision_s }
      : {}),
  });
}

export function trackRfqQuoteActioned(properties: {
  approval_id: string;
  decision: RfqQuoteDecision;
}): void {
  track("RFQ Quote Actioned", properties);
}
