"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Sale, SalesListResponse } from "@/types/bizexpert";
import { readSalesApiError } from "../Sales/salesApiError";
import { salesQueryKeys } from "../Sales/salesQueryKeys";
import { saleOutstanding } from "../Sales/saleTotals";
import { PaymentFormFields } from "./PaymentFormFields";
import {
  createPaymentDefaults,
  createPaymentSchema,
  toCreatePaymentPayload,
  unpaidSalesForPayment,
  type CreatePaymentValues,
} from "./paymentSchema";
import { PAYMENT_FORM_SLIDEOUT_RESIZE } from "./paymentsPageClasses";
import { paymentsQueryKeys } from "./paymentsQueryKeys";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function PaymentFormSlideout({ isOpen, onClose }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const form = useForm<CreatePaymentValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: createPaymentDefaults,
  });
  const saleId = form.watch("saleId");

  const { data: sales = [] } = useQuery({
    queryKey: [...salesQueryKeys.list(businessId ?? ""), "unpaid"],
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/sales`, {
        params: { status: "completed", limit: 100 },
      });
      return unpaidSalesForPayment((res.data as SalesListResponse).data);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(createPaymentDefaults);
  }, [form, isOpen]);

  useEffect(() => {
    const selected = sales.find((row: Sale) => row.id === saleId);
    if (!selected) return;
    form.setValue("amount", saleOutstanding(selected), {
      shouldValidate: true,
    });
  }, [form, saleId, sales]);

  const close = () => {
    form.reset(createPaymentDefaults);
    onClose();
  };

  const onSubmit = async (values: CreatePaymentValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/sales/${values.saleId}/payments`,
        toCreatePaymentPayload(values),
      );
      toast.success("Payment recorded");
      await qc.invalidateQueries({
        queryKey: paymentsQueryKeys.list(businessId),
      });
      await qc.invalidateQueries({ queryKey: ["sales"] });
      await qc.invalidateQueries({ queryKey: ["sale"] });
      close();
    } catch (err) {
      toast.error(readSalesApiError(err, "Failed to record payment"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Create payment"
      resizeOptions={PAYMENT_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Create payment</h2>
        <p className="mt-1 text-sm text-tertiary">
          Record cash, transfer, or POS against an unpaid sale.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <PaymentFormFields form={form} sales={sales} />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Record payment
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
