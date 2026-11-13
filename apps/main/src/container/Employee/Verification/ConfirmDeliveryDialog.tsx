import React from "react";
import { CheckCircle2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeliveryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isConfirming: boolean;
  termsAccepted: boolean;
  phoneNumber: string;
  fullAddress: string;
  displayCountry: string;
  deliveryNotes: string;
  apartmentSuite: string;
  signatureRequired: boolean;
}

// Pattern: Presenter - purely renders confirmation intent without business logic.
const ConfirmDeliveryDialog: React.FC<ConfirmDeliveryDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isConfirming,
  termsAccepted,
  phoneNumber,
  fullAddress,
  displayCountry,
  deliveryNotes,
  apartmentSuite,
  signatureRequired,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (isConfirming) return;
    onOpenChange(open);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      data-testid="confirmdeliverydialog-dialog"
    >
      <DialogContent
        className="max-w-[400px] gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <div className="relative px-6 pt-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>

          {!isConfirming && (
            <DialogClose asChild>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          )}

          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Confirm delivery information
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-5 text-gray-600">
              <p className="mb-3.5">
                This is to confirm all these details are correct before we
                proceed:
              </p>

              <p className="mb-3.5">
                Phone:{" "}
                <span className="font-medium text-gray-800">
                  {phoneNumber || "N/A"}
                </span>
              </p>

              <p className="mb-3.5">
                Address:{" "}
                <span className="font-medium text-gray-800">
                  {fullAddress || "N/A"}
                  {displayCountry ? `, ${displayCountry}` : ""}
                </span>
              </p>

              {!!deliveryNotes && (
                <p className="mb-3.5">
                  Delivery Notes:{" "}
                  <span className="font-medium text-gray-800">
                    &ldquo;{deliveryNotes}&rdquo;
                  </span>
                </p>
              )}

              {!!apartmentSuite && (
                <p className="mb-3.5">
                  Nearest Landmark:{" "}
                  <span className="font-medium text-gray-800">
                    {apartmentSuite}
                  </span>
                </p>
              )}

              <p className="mb-3.5">
                {signatureRequired
                  ? "✍️ Signature Required."
                  : "No signature required."}
              </p>

              <p>A confirmation email has been sent to you.</p>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-8 h-px w-full bg-gray-200" />

        <DialogFooter className="grid grid-cols-2 gap-3 space-x-0 px-6 py-6 sm:grid-cols-2 sm:justify-stretch sm:space-x-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
            data-testid="confirmdeliverydialog-button"
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            onClick={onConfirm}
            disabled={isConfirming || !termsAccepted}
            data-testid="confirmdeliverydialog-button-2"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeliveryDialog;
