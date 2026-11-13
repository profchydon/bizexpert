"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Sale } from "@/types/bizexpert";
import {
  shareWhatsappSchema,
  type ShareWhatsappValues,
} from "./saleActionSchemas";
import { readSalesApiError } from "./salesApiError";
import { SALE_FORM_SLIDEOUT_RESIZE } from "./salesPageClasses";

type Props = {
  isOpen: boolean;
  sale: Sale;
  onClose: () => void;
};

export function ShareWhatsappSlideout({ isOpen, sale, onClose }: Props) {
  const { businessId } = useBizExpertBusiness();
  const form = useForm<ShareWhatsappValues>({
    resolver: zodResolver(shareWhatsappSchema),
    defaultValues: { phone: "" },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({ phone: "" });
  }, [form, isOpen]);

  const close = () => {
    form.reset({ phone: "" });
    onClose();
  };

  const onSubmit = async (values: ShareWhatsappValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/sales/${sale.id}/share-whatsapp`,
        { phone: values.phone.trim() },
      );
      toast.success("Invoice sent on WhatsApp");
      close();
    } catch (err) {
      toast.error(readSalesApiError(err, "WhatsApp send failed"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Share on WhatsApp"
      resizeOptions={SALE_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          Share on WhatsApp
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Send a summary of {sale.saleNumber} to a customer phone.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <Input
            label="Phone"
            placeholder="2348011112222"
            value={form.watch("phone")}
            onChange={(value) =>
              form.setValue("phone", value, { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.phone)}
            hint={form.formState.errors.phone?.message}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Send
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
