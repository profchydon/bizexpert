import type { ApprovalRecord } from "./types";

export const approvalDialogModalLayer = false;
export type ApprovalRfqNoticeVariant =
  | "admin_response_pending"
  | "quote_accepted"
  | "quote_declined"
  | "quote_ready";
export type ApprovalCompletionAction = "approve" | "convert_to_rfq" | "reject";

export function firstPendingRfqId(record: ApprovalRecord) {
  return record.pendingRfqs?.[0]?.id ?? null;
}

export function hasPendingApprovalRfq(record: ApprovalRecord) {
  return Boolean(firstPendingRfqId(record));
}

function normalizedRfqStatus(status?: string | null) {
  return status?.toLowerCase();
}

export function shouldFetchApprovalRfqDetail(status?: string | null) {
  const normalizedStatus = normalizedRfqStatus(status);
  return (
    normalizedStatus === "accepted" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "declined" ||
    normalizedStatus === "rejected" ||
    normalizedStatus === "waiting_for_action"
  );
}

export function approvalRfqNoticeVariant({
  detailStatus,
  summaryStatus,
}: {
  detailStatus?: string | null;
  summaryStatus?: string | null;
}): ApprovalRfqNoticeVariant | null {
  if (normalizedRfqStatus(detailStatus) === "accepted") {
    return "quote_accepted";
  }

  if (normalizedRfqStatus(summaryStatus) === "accepted") {
    return "quote_accepted";
  }

  if (
    normalizedRfqStatus(detailStatus) === "declined" ||
    normalizedRfqStatus(detailStatus) === "rejected"
  ) {
    return "quote_declined";
  }

  if (
    normalizedRfqStatus(summaryStatus) === "declined" ||
    normalizedRfqStatus(summaryStatus) === "rejected"
  ) {
    return "quote_declined";
  }

  if (normalizedRfqStatus(detailStatus) === "waiting_for_action") {
    return "quote_ready";
  }

  if (normalizedRfqStatus(summaryStatus) === "waiting_for_action") {
    return "quote_ready";
  }

  if (normalizedRfqStatus(summaryStatus) === "pending") {
    return "admin_response_pending";
  }

  return null;
}

export type ApprovalRfqFooterWarning = {
  blocksApproval: boolean;
  description: string;
  title: string;
};

export function approvalHasOnlyRfqItems(record: ApprovalRecord) {
  return record.items.length > 0 && record.items.every(isRfqItem);
}

export function approvalRfqFooterWarning({
  record,
  variant,
}: {
  record: ApprovalRecord;
  variant: ApprovalRfqNoticeVariant | null;
}): ApprovalRfqFooterWarning | null {
  if (variant !== "quote_declined") return null;

  if (approvalHasOnlyRfqItems(record)) {
    return {
      blocksApproval: true,
      title: "This request can’t be approved",
      description:
        "Every item in this request depends on an RFQ quote that was rejected, so there’s nothing available to approve. Review the RFQ details or reject the request.",
    };
  }

  return {
    blocksApproval: false,
    title: "Some RFQ items can’t be fulfilled",
    description:
      "The rejected RFQ quote means those items won’t move forward. You can still approve the items that don’t depend on the RFQ.",
  };
}

export function shouldBlockApprovalForRfq({
  detailStatus,
  isDetailLoading,
  summaryStatus,
}: {
  detailStatus?: string | null;
  isDetailLoading: boolean;
  summaryStatus?: string | null;
}) {
  const summary = normalizedRfqStatus(summaryStatus);
  const detail = normalizedRfqStatus(detailStatus);

  if (detail === "approved") return false;

  return (
    summary === "pending" ||
    summary === "waiting_for_action" ||
    detail === "pending" ||
    (summary === "approved" &&
      (isDetailLoading || detail === "waiting_for_action"))
  );
}

export function shouldDisableApprovalPrimaryAction({
  budgetWarningAcknowledged,
  hasBlockingRfq,
  hasUnapprovableRfqItems = false,
  primaryActionLabel,
  requiresBudgetAcknowledgement,
  saving,
}: {
  budgetWarningAcknowledged: boolean;
  hasBlockingRfq: boolean;
  hasUnapprovableRfqItems?: boolean;
  primaryActionLabel: string;
  requiresBudgetAcknowledgement: boolean;
  saving: boolean;
}) {
  return (
    saving ||
    (requiresBudgetAcknowledgement && !budgetWarningAcknowledged) ||
    (primaryActionLabel === "Approve" && hasUnapprovableRfqItems) ||
    (primaryActionLabel === "Approve" && hasBlockingRfq)
  );
}

function isRfqItem(item: ApprovalRecord["items"][number]) {
  return item.source === "RFQ";
}

export function shouldShowApprovalModalBodyLoader({
  detailsLoading,
  rfqDetailLoading,
}: {
  detailsLoading: boolean;
  rfqDetailLoading: boolean;
}) {
  return detailsLoading || rfqDetailLoading;
}

export function hasOpenDrawer(
  isRfqDrawerOpen: boolean,
  isSwapDrawerOpen: boolean,
) {
  return isRfqDrawerOpen || isSwapDrawerOpen;
}

export function shouldCloseFromApprovalOverlay(hasDrawerOpen: boolean) {
  return !hasDrawerOpen;
}

export function shouldCloseModalAfterApprovalAction(
  action: ApprovalCompletionAction,
) {
  return action === "reject";
}
