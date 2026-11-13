"use client";

import PageState from "@/components/PageState";

import type {
  ApprovalActionOptions,
  ApprovalRecord,
  ApprovalItem,
} from "../types";
import type { ApprovalRfqNoticeVariant } from "../approvalModalInteraction";
import { ApprovedApprovalContent } from "./ApprovedApprovalContent";
import { ApprovalModalFooter } from "./ApprovalModalFooter";
import { ApprovalModalItems } from "./ApprovalModalItems";
import { ApprovalPendingRfqNotice } from "./ApprovalPendingRfqNotice";
import { RejectedApprovalContent } from "./RejectedApprovalContent";

type ApprovalModalBodyProps = {
  budgetWarningAcknowledged: boolean;
  disableLinks?: boolean;
  hasBlockingRfq: boolean;
  historical: boolean;
  isLoading: boolean;
  onApprove: (options?: ApprovalActionOptions) => void;
  onBudgetWarningAcknowledgedChange: (checked: boolean) => void;
  onClose: () => void;
  onReject: () => void;
  onSwap: (item: ApprovalItem | null) => void;
  onViewRfq: () => void;
  primaryActionLabel: string;
  record: ApprovalRecord;
  requiresBudgetAcknowledgement: boolean;
  rfqNoticeVariant: ApprovalRfqNoticeVariant | null;
  saving: boolean;
};

export function ApprovalModalBody({
  budgetWarningAcknowledged,
  disableLinks = false,
  hasBlockingRfq,
  historical,
  isLoading,
  onApprove,
  onBudgetWarningAcknowledgedChange,
  onClose,
  onReject,
  onSwap,
  onViewRfq,
  primaryActionLabel,
  record,
  requiresBudgetAcknowledgement,
  rfqNoticeVariant,
  saving,
}: ApprovalModalBodyProps) {
  const approved = record.status === "APPROVED";
  const rejected = record.status === "FAILED";

  return (
    <PageState isLoading={isLoading} isError={false}>
      {approved ? (
        <ApprovedApprovalContent disableLinks={disableLinks} record={record} />
      ) : rejected ? (
        <RejectedApprovalContent record={record} />
      ) : (
        <>
          {rfqNoticeVariant ? (
            <ApprovalPendingRfqNotice
              onViewDetails={onViewRfq}
              variant={rfqNoticeVariant}
            />
          ) : null}
          <ApprovalModalItems
            historical={historical}
            onSwap={onSwap}
            record={record}
          />
        </>
      )}
      <ApprovalModalFooter
        budgetWarningAcknowledged={budgetWarningAcknowledged}
        hasBlockingRfq={hasBlockingRfq}
        historical={historical}
        onApprove={onApprove}
        onBudgetWarningAcknowledgedChange={onBudgetWarningAcknowledgedChange}
        onClose={onClose}
        onReject={onReject}
        primaryActionLabel={primaryActionLabel}
        record={record}
        requiresBudgetAcknowledgement={requiresBudgetAcknowledgement}
        rfqNoticeVariant={rfqNoticeVariant}
        saving={saving}
      />
    </PageState>
  );
}
