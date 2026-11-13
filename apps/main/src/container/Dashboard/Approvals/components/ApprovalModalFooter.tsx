"use client";

import { AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import type { ApprovalActionOptions, ApprovalRecord } from "../types";
import type {
  ApprovalRfqFooterWarning,
  ApprovalRfqNoticeVariant,
} from "../approvalModalInteraction";
import {
  approvalRfqFooterWarning,
  shouldDisableApprovalPrimaryAction,
} from "../approvalModalInteraction";
import { approvalFooterNoteText } from "../utils";
import { ActionButton } from "./ApprovalModalParts";

export function ApprovalModalFooter({
  budgetWarningAcknowledged,
  hasBlockingRfq,
  historical,
  onApprove,
  onBudgetWarningAcknowledgedChange,
  onClose,
  onReject,
  primaryActionLabel,
  record,
  requiresBudgetAcknowledgement,
  rfqNoticeVariant,
  saving,
}: {
  budgetWarningAcknowledged: boolean;
  hasBlockingRfq: boolean;
  historical: boolean;
  onApprove: (options?: ApprovalActionOptions) => void;
  onBudgetWarningAcknowledgedChange: (checked: boolean) => void;
  onClose: () => void;
  onReject: () => void;
  primaryActionLabel: string;
  record: ApprovalRecord;
  requiresBudgetAcknowledgement: boolean;
  rfqNoticeVariant: ApprovalRfqNoticeVariant | null;
  saving: boolean;
}) {
  const footerWarning = approvalRfqFooterWarning({
    record,
    variant: rfqNoticeVariant,
  });
  const approveDisabled = shouldDisableApprovalPrimaryAction({
    budgetWarningAcknowledged,
    hasBlockingRfq,
    hasUnapprovableRfqItems: footerWarning?.blocksApproval,
    primaryActionLabel,
    requiresBudgetAcknowledgement,
    saving,
  });

  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 md:px-8">
      {footerWarning && !historical ? (
        <ApprovalFooterWarning warning={footerWarning} />
      ) : null}
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <ApprovalFooterNote historical={historical} record={record} />
        <ApprovalFooterActions
          approveDisabled={approveDisabled}
          historical={historical}
          onApprove={() =>
            onApprove({
              acknowledgeBudgetWarning:
                requiresBudgetAcknowledgement && budgetWarningAcknowledged,
            })
          }
          onClose={onClose}
          onReject={onReject}
          primaryActionLabel={primaryActionLabel}
          saving={saving}
        />
      </div>
      {requiresBudgetAcknowledgement ? (
        <label className="flex items-start justify-between gap-3 rounded-lg border border-warning-200 bg-warning-50 p-3">
          <span className="min-w-0">
            <span className="block text-sm font-medium text-warning-800">
              Acknowledge budget warning
            </span>
            <span className="mt-1 block text-xs leading-5 text-warning-700">
              The order total exceeds the assigned budget. Confirm that you want
              to proceed with approval.
            </span>
          </span>
          <Switch
            checked={budgetWarningAcknowledged}
            onCheckedChange={onBudgetWarningAcknowledgedChange}
          />
        </label>
      ) : null}
    </div>
  );
}

function ApprovalFooterNote({
  historical,
  record,
}: {
  historical: boolean;
  record: ApprovalRecord;
}) {
  const note = approvalFooterNoteText({ historical, record });

  return (
    <div className="max-w-[640px] text-xs leading-5 text-gray-500">
      {historical && record.actionedBy && !record.orderNote ? (
        <span>
          Last action by{" "}
          <span className="font-medium text-gray-700">
            {record.actionedBy.admin}
          </span>
        </span>
      ) : (
        <span>{note}</span>
      )}
    </div>
  );
}

function ApprovalFooterActions({
  approveDisabled,
  historical,
  onApprove,
  onClose,
  onReject,
  primaryActionLabel,
  saving,
}: {
  approveDisabled: boolean;
  historical: boolean;
  onApprove: () => void;
  onClose: () => void;
  onReject: () => void;
  primaryActionLabel: string;
  saving: boolean;
}) {
  return (
    <div className="flex shrink-0 justify-end">
      {historical ? (
        <ActionButton disabled={saving} onClick={onClose} variant="secondary">
          Close
        </ActionButton>
      ) : (
        <div className="flex flex-nowrap justify-end gap-2">
          <ActionButton
            disabled={saving}
            onClick={onReject}
            variant="secondary"
          >
            Reject
          </ActionButton>
          <ActionButton
            disabled={approveDisabled}
            onClick={onApprove}
            variant="primary"
          >
            {primaryActionLabel}
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function ApprovalFooterWarning({
  warning,
}: {
  warning: ApprovalRfqFooterWarning;
}) {
  return (
    <div className="flex w-full items-start gap-2.5 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-left shadow-sm">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-error-600" />
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-5 text-error-800">
          {warning.title}
        </p>
        <p className="text-xs leading-5 text-error-700">
          {warning.description}
        </p>
      </div>
    </div>
  );
}
