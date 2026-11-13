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
import type { Product } from "@/types/bizexpert";
import {
  productDeactivateDescription,
  productDeactivateTitle,
} from "./deleteProductCopy";
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
  product: Product;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteProductModal({
  isOpen,
  product,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  const title = productDeactivateTitle();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isDeleting) onClose();
      }}
    >
      <DialogContent
        className={locationsDeleteModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={locationsDeleteModalCloseButtonClass}
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
        <h3 className={locationsDeleteModalTitleClass}>{title}</h3>
        <DialogDescription className={locationsDeleteModalBodyClass}>
          {productDeactivateDescription(product.name)}
        </DialogDescription>
        <div className={locationsDeleteModalFooterClass}>
          <Button
            variant="outline"
            size="md"
            className={locationsDeleteModalCancelClass}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className={locationsDeleteModalConfirmClass}
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Deactivate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
