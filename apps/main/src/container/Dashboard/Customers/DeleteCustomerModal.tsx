"use client";

import { Trash2, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Customer } from "@/types/bizexpert";
import {
  customerDeleteDescription,
  customerDeleteTitle,
} from "./deleteCustomerCopy";
import {
  customersDeleteModalBodyClass,
  customersDeleteModalCancelClass,
  customersDeleteModalCloseButtonClass,
  customersDeleteModalConfirmClass,
  customersDeleteModalContentClass,
  customersDeleteModalFooterClass,
  customersDeleteModalTitleClass,
} from "./customersPageClasses";

type Props = {
  isOpen: boolean;
  customer: Customer;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteCustomerModal({
  isOpen,
  customer,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  const title = customerDeleteTitle();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isDeleting) onClose();
      }}
    >
      <DialogContent
        className={customersDeleteModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={customersDeleteModalCloseButtonClass}
          disabled={isDeleting}
        >
          <X className="size-5 shrink-0" />
        </button>
        <FeaturedIcon
          icon={Trash2}
          size="md"
          color="error"
          theme="light"
          className="rounded-full"
        />
        <h3 className={customersDeleteModalTitleClass}>{title}</h3>
        <DialogDescription className={customersDeleteModalBodyClass}>
          {customerDeleteDescription(customer.name)}
        </DialogDescription>
        <div className={customersDeleteModalFooterClass}>
          <Button
            variant="outline"
            size="md"
            className={customersDeleteModalCancelClass}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className={customersDeleteModalConfirmClass}
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Delete customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
