"use client";

import { Undo2, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StockTransfer } from "@/types/bizexpert";
import {
  locationsDeleteModalBodyClass,
  locationsDeleteModalCancelClass,
  locationsDeleteModalCloseButtonClass,
  locationsDeleteModalConfirmClass,
  locationsDeleteModalContentClass,
  locationsDeleteModalFooterClass,
  locationsDeleteModalTitleClass,
} from "../Locations/locationsPageClasses";

type Props = {
  isOpen: boolean;
  transfer: StockTransfer;
  isCancelling: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelTransferModal({
  isOpen,
  transfer,
  isCancelling,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isCancelling) onClose();
      }}
    >
      <DialogContent
        className={locationsDeleteModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Cancel transfer</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={locationsDeleteModalCloseButtonClass}
          disabled={isCancelling}
        >
          <X className="size-5 shrink-0" />
        </button>
        <FeaturedIcon
          icon={Undo2}
          size="md"
          color="error"
          theme="light"
          className="rounded-full"
        />
        <h3 className={locationsDeleteModalTitleClass}>Cancel transfer</h3>
        <DialogDescription className={locationsDeleteModalBodyClass}>
          This restores stock for {transfer.transferNumber} at the source
          location.
        </DialogDescription>
        <div className={locationsDeleteModalFooterClass}>
          <Button
            variant="outline"
            size="md"
            className={locationsDeleteModalCancelClass}
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep transfer
          </Button>
          <Button
            variant="destructive"
            size="md"
            className={locationsDeleteModalConfirmClass}
            isLoading={isCancelling}
            onClick={onConfirm}
          >
            Cancel transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
