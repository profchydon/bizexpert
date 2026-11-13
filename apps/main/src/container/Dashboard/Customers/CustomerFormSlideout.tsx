"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Customer } from "@/types/bizexpert";
import { CustomerFormFields } from "./CustomerFormFields";
import { readCustomersApiError } from "./customersApiError";
import { CUSTOMER_FORM_SLIDEOUT_RESIZE } from "./customersPageClasses";
import { customersQueryKeys } from "./customersQueryKeys";
import {
  customerFormDefaults,
  customerFormSchema,
  toCustomerPayload,
  valuesFromCustomer,
  type CustomerFormValues,
} from "./customerSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
};

export function CustomerFormSlideout({ isOpen, onClose, customer }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const isEdit = Boolean(customer);
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? valuesFromCustomer(customer)
      : customerFormDefaults,
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(customer ? valuesFromCustomer(customer) : customerFormDefaults);
  }, [form, isOpen, customer]);

  const close = () => {
    form.reset(customerFormDefaults);
    onClose();
  };

  const onSubmit = async (values: CustomerFormValues) => {
    if (!businessId) return;
    try {
      if (customer) {
        await bizexpertApi.put(
          `/businesses/${businessId}/customers/${customer.id}`,
          toCustomerPayload(values),
        );
        toast.success("Customer updated");
      } else {
        await bizexpertApi.post(
          `/businesses/${businessId}/customers`,
          toCustomerPayload(values),
        );
        toast.success("Customer added");
      }
      await qc.invalidateQueries({ queryKey: ["customers"] });
      await qc.invalidateQueries({ queryKey: ["customer"] });
      close();
    } catch (err) {
      toast.error(
        readCustomersApiError(
          err,
          customer ? "Failed to update customer" : "Failed to add customer",
        ),
      );
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel={isEdit ? "Edit customer" : "Add customer"}
      resizeOptions={CUSTOMER_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          {isEdit ? "Edit customer" : "Add customer"}
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          {isEdit
            ? "Update contact details and this customer’s credit limit."
            : "Save a customer for sales, credit, and store wallet."}
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <CustomerFormFields form={form} />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            {isEdit ? "Save changes" : "Add customer"}
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
