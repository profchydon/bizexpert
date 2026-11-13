"use client";

import { ApprovalsCountStrip } from "./components/CountStrip";
import { ApprovalsHeader } from "./components/Header";
import { ApprovalModal } from "./components/ApprovalModal";
import { RejectApprovalModal } from "./components/RejectModal";
import { ApprovalsTableCard } from "./components/TableCard";
import { useApprovalOrderSummaryNavigation } from "./useApprovalOrderSummaryNavigation";
import { useApprovalPaymentVerification } from "./useApprovalPaymentVerification";
import { useApprovalsState } from "./useApprovalsState";
import { approvalPrimaryActionLabel } from "./utils";
import { ApprovalPaymentVerificationModal } from "./components/ApprovalPaymentVerificationModal";
import PaymentSuccessInstanceModal from "../EquipEmployee/Devices/PaymentSuccessInstance";
import PaymentErrorInstanceModal from "../EquipEmployee/Devices/PaymentErrorInstance";

export function ApprovalsPage() {
  const state = useApprovalsState();
  const openApprovalOrderSummary = useApprovalOrderSummaryNavigation();
  const verification = useApprovalPaymentVerification();
  const paymentModalOpen =
    verification.isPromptOpen ||
    verification.isVerifying ||
    verification.isSuccessOpen ||
    verification.isErrorOpen;
  const closeSuccessfulPayment = () => {
    verification.closeResult();
    void state.refetchSelectedOrderRequest();
  };
  const selectedEmployee = state.selected
    ? (state.selected.employee ??
      state.employees.get(state.selected.employeeId))
    : undefined;
  const rejectingEmployee = state.rejecting
    ? (state.rejecting.employee ??
      state.employees.get(state.rejecting.employeeId))
    : undefined;

  return (
    <>
      <main className="flex w-full flex-col gap-6 py-8">
        <ApprovalsHeader />
        <ApprovalsCountStrip counts={state.counts} />
        <ApprovalsTableCard state={state} />
      </main>
      <ApprovalModal
        companyId={state.companyId}
        detailsLoading={state.selectedLoading}
        open={Boolean(state.selected) && !paymentModalOpen}
        record={state.selected}
        employee={selectedEmployee}
        saving={state.isSaving}
        onClose={() => state.setSelectedId(null)}
        onApprove={(options) => {
          if (!state.selected) return;
          if (approvalPrimaryActionLabel(state.selected) === "Approve") {
            void openApprovalOrderSummary({
              options,
              record: state.selected,
              request: state.selectedOrderRequest,
            });
            return;
          }
          void state.approve(state.selected.id, state.selected, options);
        }}
        onReject={() => {
          if (!state.selected) return;
          state.setRejectingId(state.selected.id);
        }}
        onSwap={state.swap}
      />
      <RejectApprovalModal
        open={Boolean(state.rejecting)}
        employeeName={rejectingEmployee?.name}
        saving={state.isSaving}
        onClose={() => state.setRejectingId(null)}
        onConfirm={(reason) => {
          if (!state.rejecting) return;
          void state.reject(state.rejecting.id, reason, state.rejecting);
        }}
      />
      <ApprovalPaymentVerificationModal
        isOpen={verification.isPromptOpen}
        isLoading={verification.isVerifying}
        onVerify={verification.startVerification}
      />
      <PaymentSuccessInstanceModal
        isOpen={verification.isSuccessOpen}
        onClose={closeSuccessfulPayment}
        onProceed={closeSuccessfulPayment}
      />
      <PaymentErrorInstanceModal
        isOpen={verification.isErrorOpen}
        onClose={verification.closeResult}
      />
    </>
  );
}
