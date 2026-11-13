"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Button } from "@/components/ui/button";
import { formatNgn } from "@/lib/bizexpert/format";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Sale } from "@/types/bizexpert";
import { addPaymentSchema, type AddPaymentValues } from "./saleActionSchemas";
import { readSalesApiError } from "./salesApiError";
import { SALE_FORM_SLIDEOUT_RESIZE } from "./salesPageClasses";
import { PAYMENT_METHODS } from "./saleSchema";
import { saleOutstanding } from "./saleTotals";

type Props = {
  isOpen: boolean;
  sale: Sale;
  onClose: () => void;
};

export function AddPaymentSlideout({ isOpen, sale, onClose }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const outstanding = saleOutstanding(sale);
  const form = useForm<AddPaymentValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: { amount: outstanding, method: "cash", reference: "" },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({ amount: outstanding, method: "cash", reference: "" });
  }, [form, isOpen, outstanding]);

  const close = () => {
    form.reset({ amount: outstanding, method: "cash", reference: "" });
    onClose();
  };

  const onSubmit = async (values: AddPaymentValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/sales/${sale.id}/payments`,
        {
          amount: values.amount,
          method: values.method,
          reference: values.reference?.trim() || undefined,
        },
      );
      toast.success("Payment added");
      await qc.invalidateQueries({ queryKey: ["sales"] });
      await qc.invalidateQueries({ queryKey: ["sale"] });
      await qc.invalidateQueries({ queryKey: ["payments"] });
      close();
    } catch (err) {
      toast.error(readSalesApiError(err, "Failed to add payment"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Add payment"
      resizeOptions={SALE_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Add payment</h2>
        <p className="mt-1 text-sm text-tertiary">
          Outstanding on {sale.saleNumber}: {formatNgn(outstanding)}
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <Input
            label="Amount (NGN)"
            type="number"
            value={String(form.watch("amount") ?? "")}
            onChange={(value) =>
              form.setValue("amount", Number(value), { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.amount)}
            hint={form.formState.errors.amount?.message}
          />
          <NativeSelect
            label="Method"
            value={form.watch("method")}
            onChange={(event) =>
              form.setValue(
                "method",
                event.target.value as AddPaymentValues["method"],
              )
            }
            options={PAYMENT_METHODS.filter((row) => row.value).map((row) => ({
              value: row.value,
              label: row.label,
            }))}
          />
          <Input
            label="Reference"
            placeholder="Optional"
            value={form.watch("reference") ?? ""}
            onChange={(value) => form.setValue("reference", value)}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Add payment
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
