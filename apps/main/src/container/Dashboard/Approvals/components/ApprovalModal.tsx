"use client";

import { useEffect, useState } from "react";

import { useGetRfqQuery } from "@/api/baseQueries/companiesApi/rfqsApi/getRfq";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import type {
  ApprovalActionOptions,
  ApprovalEmployee,
  ApprovalItem,
  ApprovalRecord,
} from "../types";
import {
  approvalDialogModalLayer,
  approvalRfqNoticeVariant,
  firstPendingRfqId,
  hasOpenDrawer,
  shouldCloseFromApprovalOverlay,
  shouldBlockApprovalForRfq,
  shouldFetchApprovalRfqDetail,
  shouldShowApprovalModalBodyLoader,
} from "../approvalModalInteraction";
import type { ApprovalSwapDraft } from "../swapUtils";
import { approvalPrimaryActionLabel } from "../utils";
import { ApprovalRfqDetailsDrawer } from "./ApprovalRfqDetailsDrawer";
import { ApprovalModalBody } from "./ApprovalModalBody";
import { ApprovalModalHeader } from "./ApprovalModalHeader";
import { ItemSwapDrawer } from "./ItemSwapDrawer";
import { showApiError } from "@/utils/showApiError";

export function ApprovalModal({
  companyId,
  disableLinks = false,
  employee,
  onApprove,
  onClose,
  onReject,
  onSwap,
  open,
  record,
  saving = false,
  detailsLoading = false,
}: {
  companyId?: string;
  detailsLoading?: boolean;
  disableLinks?: boolean;
  employee?: ApprovalEmployee;
  onApprove: (options?: ApprovalActionOptions) => void;
  onClose: () => void;
  onReject: () => void;
  onSwap: (id: string, draft: ApprovalSwapDraft) => Promise<void> | void;
  open: boolean;
  record: ApprovalRecord | null;
  saving?: boolean;
}) {
  const [swapItem, setSwapItem] = useState<ApprovalItem | null>(null);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [budgetWarningAcknowledged, setBudgetWarningAcknowledged] =
    useState(false);
  const approvalRfq = record?.pendingRfqs?.[0] ?? null;
  const shouldFetchRfqDetail = shouldFetchApprovalRfqDetail(
    approvalRfq?.status,
  );
  const approvalRfqDetailQuery = useGetRfqQuery(
    { companyId, rfqId: approvalRfq?.id },
    { skip: !open || !companyId || !approvalRfq?.id || !shouldFetchRfqDetail },
  );

  useEffect(() => {
    setBudgetWarningAcknowledged(false);
    if (!open) {
      setSwapItem(null);
      setSelectedRfqId(null);
    }
  }, [open, record?.id]);

  if (!record) return null;
  const historical = record.status !== "AWAITING_APPROVAL";
  const primaryActionLabel = approvalPrimaryActionLabel(record);
  const requiresBudgetAcknowledgement =
    !historical &&
    record.budgetExceeded === true &&
    primaryActionLabel === "Approve";
  const suspendOutsideDismiss = hasOpenDrawer(!!selectedRfqId, !!swapItem);
  const detailRfqStatus = approvalRfqDetailQuery.data?.data.status;
  const rfqDetailLoading =
    shouldFetchRfqDetail &&
    (approvalRfqDetailQuery.isLoading || approvalRfqDetailQuery.isFetching);
  const rfqNoticeVariant = approvalRfqNoticeVariant({
    detailStatus: detailRfqStatus,
    summaryStatus: approvalRfq?.status,
  });
  const hasBlockingRfq = shouldBlockApprovalForRfq({
    detailStatus: detailRfqStatus,
    isDetailLoading: rfqDetailLoading,
    summaryStatus: approvalRfq?.status,
  });

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close approval overlay"
          className="fixed inset-0 z-[1003] bg-[#101828]/60 backdrop-blur-[4px]"
          onClick={() => {
            if (shouldCloseFromApprovalOverlay(suspendOutsideDismiss)) {
              onClose();
            }
          }}
        />
      ) : null}
      <Dialog
        modal={approvalDialogModalLayer}
        open={open}
        onOpenChange={(next) => (!next ? onClose() : null)}
        data-testid="approvalmodal-dialog"
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-[#101828]/60 backdrop-blur-[4px]"
          className="max-h-[calc(100vh-2rem)] w-full max-w-[960px] gap-0 overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-xl"
          onInteractOutside={(event) => {
            if (suspendOutsideDismiss) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (suspendOutsideDismiss) event.preventDefault();
          }}
        >
          <div className="relative flex max-h-[calc(100vh-2rem)] min-h-0 w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-200">
            <ApprovalModalHeader
              disableLinks={disableLinks}
              employee={employee}
              onClose={onClose}
              record={record}
            />
            <ApprovalModalBody
              budgetWarningAcknowledged={budgetWarningAcknowledged}
              disableLinks={disableLinks}
              hasBlockingRfq={hasBlockingRfq}
              historical={historical}
              isLoading={shouldShowApprovalModalBodyLoader({
                detailsLoading,
                rfqDetailLoading,
              })}
              onApprove={onApprove}
              onBudgetWarningAcknowledgedChange={setBudgetWarningAcknowledged}
              onClose={onClose}
              onReject={onReject}
              onSwap={setSwapItem}
              onViewRfq={() => setSelectedRfqId(firstPendingRfqId(record))}
              primaryActionLabel={primaryActionLabel}
              record={record}
              requiresBudgetAcknowledgement={requiresBudgetAcknowledgement}
              rfqNoticeVariant={rfqNoticeVariant}
              saving={saving}
            />
          </div>
        </DialogContent>
        <ItemSwapDrawer
          employeeId={record.employeeId}
          item={swapItem}
          onClose={() => setSwapItem(null)}
          onConfirm={(draft) => {
            void Promise.resolve(onSwap(record.id, draft))
              .then(() => setSwapItem(null))
              .catch(showApiError);
          }}
          open={Boolean(swapItem)}
          saving={saving}
        />
      </Dialog>
      <ApprovalRfqDetailsDrawer
        companyId={companyId}
        onAcceptSuccess={() => {
          void approvalRfqDetailQuery.refetch();
        }}
        onClose={() => setSelectedRfqId(null)}
        open={Boolean(selectedRfqId)}
        rfqId={selectedRfqId}
      />
    </>
  );
}
