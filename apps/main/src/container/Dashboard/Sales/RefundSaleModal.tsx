"use client";

import { RotateCcw, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Sale } from "@/types/bizexpert";
import { refundSaleSchema, type RefundSaleValues } from "./saleActionSchemas";
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
  onConfirm: (values: RefundSaleValues) => void;
};

export function RefundSaleModal({
  isOpen,
  sale,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const form = useForm<RefundSaleValues>({
    resolver: zodResolver(refundSaleSchema),
    defaultValues: { reason: "", returnGoods: false },
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
        <DialogTitle className="sr-only">Refund sale</DialogTitle>
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
          icon={RotateCcw}
          size="md"
          color="error"
          theme="light"
          className="rounded-full"
        />
        <h3 className={salesDeleteModalTitleClass}>
          Refund {sale.saleNumber}?
        </h3>
        <DialogDescription className={salesDeleteModalBodyClass}>
          Mark this sale as refunded. Return goods to put stock back.
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
          <Checkbox
            label="Return goods to stock"
            isSelected={Boolean(form.watch("returnGoods"))}
            onChange={(checked) => form.setValue("returnGoods", checked)}
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
              Refund sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
