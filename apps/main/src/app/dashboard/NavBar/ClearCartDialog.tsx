"use client";

import { useState } from "react";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ELEVATED_MODAL_OVERLAY_CLASS } from "@/utils/drawerOverlayStacking";

interface ClearCartDialogProps {
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ClearCartDialog: React.FC<ClearCartDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onCancel();
      }}
      className={ELEVATED_MODAL_OVERLAY_CLASS}
      isDismissable={!isLoading}
    >
      <Modal className="max-w-[400px]">
        <Dialog aria-label="Clear cart?" data-testid="clearcartdialog-dialog">
          <div className="flex w-full flex-col rounded-xl bg-primary p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-primary">Clear cart?</h3>
            <p className="mt-2 text-sm text-tertiary">
              All items will be removed from your cart. This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                color="secondary"
                size="md"
                onClick={onCancel}
                isDisabled={isLoading}
                data-testid="clearcartdialog-button"
              >
                Cancel
              </Button>
              <Button
                color="primary-destructive"
                size="md"
                onClick={handleConfirm}
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="clearcartdialog-button-2"
              >
                Clear cart
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default ClearCartDialog;
