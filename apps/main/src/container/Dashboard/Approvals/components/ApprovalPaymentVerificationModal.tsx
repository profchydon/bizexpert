"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ApprovalPaymentVerificationModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onVerify: () => void;
};

export function ApprovalPaymentVerificationModal({
  isOpen,
  isLoading,
  onVerify,
}: ApprovalPaymentVerificationModalProps) {
  return (
    <Dialog open={isOpen} data-testid="approvalpaymentverificationmodal-dialog">
      <DialogContent
        showCloseButton={false}
        className="w-[80%] max-w-[400px] rounded-xl"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-3 pt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Verify payment
          </h2>
          <p className="text-sm text-gray-600">
            We need to verify this payment before completing the approval.
          </p>
        </div>
        <div className="mt-6">
          <Button
            className="w-full"
            onClick={onVerify}
            disabled={isLoading}
            data-testid="approvalpaymentverificationmodal-button"
          >
            {isLoading ? "Verifying..." : "Verify payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
