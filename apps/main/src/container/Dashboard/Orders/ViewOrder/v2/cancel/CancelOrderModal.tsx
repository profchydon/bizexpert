"use client";

import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { ELEVATED_MODAL_OVERLAY_CLASS } from "@/utils/drawerOverlayStacking";
import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import type {
  CancellationReasonId,
  CancellationScope,
} from "@/utils/order-cancellation";
import { IOrder } from "@/types/orders";
import { CancelCommitStep } from "./CancelCommitStep";
import { CancelConfirmStep } from "./CancelConfirmStep";
import { CancelDoneStep } from "./CancelDoneStep";
import { CancelReasonSection } from "./CancelReasonSection";
import { commitLabel, modalTitle } from "./buildCancelConsequence";
import type { CancelEmpRow } from "./cancelData";
import type { CancelIntent } from "./cancelTypes";
import { useCancelOrderModal } from "./useCancelOrderModal";

interface Props {
  order: IOrder;
  companyId?: string;
  intent: CancelIntent;
  employees: CancelEmpRow[];
  isPreAccept: boolean;
  onClose: () => void;
  onSubmit: (input: {
    scope: CancellationScope;
    reasonId: CancellationReasonId;
    details: string;
    employeeIds?: string[];
    suborderIds?: string[];
  }) => Promise<{
    ok: boolean;
    instant?: boolean;
    refund_preview?: CancellationPreviewResponse["refund_preview"];
  }>;
  isSubmitting?: boolean;
}

export function CancelOrderModal({
  order,
  companyId,
  intent,
  employees,
  isPreAccept: isPreAcceptProp,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const modal = useCancelOrderModal({
    order,
    companyId,
    intent,
    employees,
    isPreAccept: isPreAcceptProp,
    onSubmit,
  });
  const orderId = order.order_number || order.id;

  return (
    <ModalOverlay
      isOpen
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={ELEVATED_MODAL_OVERLAY_CLASS}
    >
      <Modal className="max-w-lg">
        <Dialog data-testid="cancelordermodal-dialog">
          {modal.step === "form" ? (
            <CancelConfirmStep
              title={modalTitle({
                intent,
                item: modal.item,
                cancellationScope: modal.scope,
                scope: modal.cancelScope,
                orderId,
              })}
              isPreAccept={modal.isPreAccept}
              preview={modal.preview}
              canSubmit={modal.canContinue}
              scope={modal.cancelScope}
              prefix={modal.prefix}
              isOffboarding={modal.isOffboarding}
              hasBox={employees.some((employee) => employee.boxStatus)}
              lineSelection={modal.lineSelection}
              reason={
                <CancelReasonSection
                  reasonId={modal.reasonId}
                  onReasonChange={modal.setReasonId}
                  details={modal.details}
                  onDetailsChange={modal.setDetails}
                />
              }
              backLabel={
                modal.scope.kind === "items" && modal.scope.itemIds.length === 1
                  ? "Keep device"
                  : "Keep order"
              }
              onBack={onClose}
              onSubmit={() => modal.setStep("commit")}
              onClose={onClose}
            />
          ) : modal.step === "commit" ? (
            <CancelCommitStep
              consequence={modal.consequence}
              preview={modal.preview}
              isPreAccept={modal.isPreAccept}
              orderId={orderId}
              confirmLabel={commitLabel(modal.scope, modal.isPreAccept)}
              requiresTypeToConfirm={modal.requiresTypeToConfirm}
              onBack={() => modal.setStep("form")}
              onConfirm={modal.submit}
              onClose={onClose}
              isSubmitting={isSubmitting}
            />
          ) : (
            <CancelDoneStep
              isPreAccept={modal.isPreAccept}
              scope={modal.scope}
              preview={modal.preview}
              onClose={onClose}
            />
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
