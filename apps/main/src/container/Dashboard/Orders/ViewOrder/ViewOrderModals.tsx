import React from "react";
import SignatureUpdateConfirmationDialog from "@/components/Orders/SignatureUpdateConfirmationDialog";
import SignatureRequiredDialog from "@/components/Offboarding/OrderSummary/SignatureRequiredDialog";
import VerifyAddressModal from "@/components/Orders/VerifyAddressModal";
import { ViewOrderController } from "./useViewOrderController";

const ViewOrderModals: React.FC<{ controller: ViewOrderController }> = ({
  controller,
}) => {
  const { enable, remove, verify } = controller;

  return (
    <>
      <SignatureUpdateConfirmationDialog
        open={enable.showConfirmDialog}
        onOpenChange={enable.setShowConfirmDialog}
        onCancel={() => enable.setShowConfirmDialog(false)}
        onConfirm={enable.handleConfirmUpdate}
        failedSubOrders={enable.confirmDialogData.failedSubOrders}
        successSubOrders={enable.confirmDialogData.successSubOrders}
        updatedCount={enable.confirmDialogData.updatedCount}
        totalCount={enable.confirmDialogData.totalCount}
        isLoading={enable.isAdding || enable.isAddingEmployeeSignature}
      />

      <SignatureRequiredDialog
        open={remove.showRemoveDialog}
        onOpenChange={remove.setShowRemoveDialog}
        onCancel={() => remove.setShowRemoveDialog(false)}
        onConfirm={remove.handleConfirmRemove}
        isLoading={remove.isRemoveLoading}
      />

      <VerifyAddressModal
        open={Boolean(verify.verifyModal)}
        mode={verify.verifyModal?.type === "bulk" ? "bulk" : "single"}
        subOrders={verify.verifyModalSubOrders}
        isLoading={verify.isVerifyingAddress}
        onOpenChange={verify.handleVerifyModalOpenChange}
        onClose={verify.closeVerifyModal}
        onConfirm={verify.handleConfirmVerifyAddress}
      />
    </>
  );
};

export default ViewOrderModals;
