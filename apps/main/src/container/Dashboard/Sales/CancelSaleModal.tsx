"use client";

import { Ban, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Sale } from "@/types/bizexpert";
import { cancelSaleSchema, type CancelSaleValues } from "./saleActionSchemas";
import {
  salesDeleteModalBodyClass,
  salesDeleteModalCancelClass,
  salesDeleteModalCloseButtonClass,
  salesDeleteModalConfirmClass,
  salesDeleteModalContentClass,
  salesDeleteModalFooterClass,
  salesDeleteModalTitleClass,
} from "./salesPageClasses";

type Props = {
  isOpen: boolean;
  sale: Sale;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (values: CancelSaleValues) => void;
};

export function CancelSaleModal({
  isOpen,
  sale,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const form = useForm<CancelSaleValues>({
    resolver: zodResolver(cancelSaleSchema),
    defaultValues: { reason: "" },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent
        className={salesDeleteModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Cancel sale</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={salesDeleteModalCloseButtonClass}
          disabled={isSubmitting}
        >
          <X className="size-5 shrink-0" />
        </button>
        <FeaturedIcon
          icon={Ban}
          size="md"
          color="error"
          theme="light"
          className="rounded-full"
        />
        <h3 className={salesDeleteModalTitleClass}>
          Cancel {sale.saleNumber}?
        </h3>
        <DialogDescription className={salesDeleteModalBodyClass}>
          Inventory for this sale will be restored. This cannot be undone.
        </DialogDescription>
        <form
          className="mt-4 w-full space-y-4 text-left"
          onSubmit={form.handleSubmit(onConfirm)}
        >
          <Input
            label="Reason"
            value={form.watch("reason")}
            onChange={(value) =>
              form.setValue("reason", value, { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.reason)}
            hint={form.formState.errors.reason?.message}
          />
          <div className={salesDeleteModalFooterClass}>
            <Button
              type="button"
              variant="outline"
              size="md"
              className={salesDeleteModalCancelClass}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Keep sale
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="md"
              className={salesDeleteModalConfirmClass}
              isLoading={isSubmitting}
            >
              Cancel sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
