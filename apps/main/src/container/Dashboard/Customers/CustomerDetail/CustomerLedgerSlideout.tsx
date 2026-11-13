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
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Customer, CustomerLedgerType } from "@/types/bizexpert";
import { readCustomersApiError } from "../customersApiError";
import { CUSTOMER_FORM_SLIDEOUT_RESIZE } from "../customersPageClasses";
import {
  customerLedgerSchema,
  LEDGER_TYPE_OPTIONS,
  ledgerDefaults,
  toLedgerPayload,
  type CustomerLedgerValues,
} from "../customerLedgerSchema";

type Props = {
  isOpen: boolean;
  customer: Customer;
  defaultType: CustomerLedgerType;
  onClose: () => void;
};

export function CustomerLedgerSlideout({
  isOpen,
  customer,
  defaultType,
  onClose,
}: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const form = useForm<CustomerLedgerValues>({
    resolver: zodResolver(customerLedgerSchema),
    defaultValues: ledgerDefaults(defaultType),
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(ledgerDefaults(defaultType));
  }, [form, isOpen, defaultType]);

  const close = () => {
    form.reset(ledgerDefaults(defaultType));
    onClose();
  };

  const onSubmit = async (values: CustomerLedgerValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/customers/${customer.id}/ledger`,
        toLedgerPayload(values),
      );
      toast.success("Account updated");
      await qc.invalidateQueries({ queryKey: ["customers"] });
      await qc.invalidateQueries({ queryKey: ["customer"] });
      close();
    } catch (err) {
      toast.error(readCustomersApiError(err, "Failed to update account"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Update customer account"
      resizeOptions={CUSTOMER_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Update account</h2>
        <p className="mt-1 text-sm text-tertiary">
          Record wallet, debt, repayment, or a write-off for {customer.name}.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content className="space-y-4">
          <NativeSelect
            label="Entry type"
            value={form.watch("type")}
            onChange={(event) =>
              form.setValue(
                "type",
                event.target.value as CustomerLedgerValues["type"],
              )
            }
            options={LEDGER_TYPE_OPTIONS.map((row) => ({
              value: row.value,
              label: row.label,
            }))}
          />
          <Input
            label="Amount (NGN)"
            type="number"
            value={String(form.watch("amount") || "")}
            onChange={(value) =>
              form.setValue("amount", Number(value), { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.amount)}
            hint={form.formState.errors.amount?.message}
          />
          <Input
            label="Note"
            placeholder="Optional"
            value={form.watch("note") ?? ""}
            onChange={(value) => form.setValue("note", value)}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Save entry
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
