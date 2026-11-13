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
import type { Category } from "@/types/bizexpert";
import {
  canConfirmCategoryDelete,
  categoryDeleteDescription,
  categoryDeleteTitle,
} from "./deleteCategoryCopy";
import {
  categoriesDeleteModalBodyClass,
  categoriesDeleteModalCancelClass,
  categoriesDeleteModalCloseButtonClass,
  categoriesDeleteModalConfirmClass,
  categoriesDeleteModalContentClass,
  categoriesDeleteModalFooterClass,
  categoriesDeleteModalTitleClass,
} from "./categoriesPageClasses";

type Props = {
  isOpen: boolean;
  category: Category;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteCategoryModal({
  isOpen,
  category,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  const title = categoryDeleteTitle();
  const canDelete = canConfirmCategoryDelete(category.productCount);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isDeleting) onClose();
      }}
    >
      <DialogContent
        className={categoriesDeleteModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={categoriesDeleteModalCloseButtonClass}
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
        <h3 className={categoriesDeleteModalTitleClass}>{title}</h3>
        <DialogDescription className={categoriesDeleteModalBodyClass}>
          {categoryDeleteDescription(category.name, category.productCount)}
        </DialogDescription>
        <div className={categoriesDeleteModalFooterClass}>
          <Button
            variant="outline"
            size="md"
            className={categoriesDeleteModalCancelClass}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className={categoriesDeleteModalConfirmClass}
            isLoading={isDeleting}
            disabled={!canDelete}
            onClick={onConfirm}
          >
            Delete category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
