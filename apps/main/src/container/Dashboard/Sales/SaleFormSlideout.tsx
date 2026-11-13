"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Customer, Product } from "@/types/bizexpert";
import { customersQueryKeys } from "../Customers/customersQueryKeys";
import { productsQueryKeys } from "../Products/productsQueryKeys";
import { applyProductToSaleItems } from "./applyProductToSaleItems";
import { SaleFormFields } from "./SaleFormFields";
import { readSalesApiError } from "./salesApiError";
import { SALE_FORM_SLIDEOUT_RESIZE } from "./salesPageClasses";
import {
  saleFormDefaults,
  saleFormSchema,
  toCreateSalePayload,
  type SaleFormValues,
} from "./saleSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SaleFormSlideout({ isOpen, onClose }: Props) {
  const { businessId, locationId, locations } = useBizExpertBusiness();
  const qc = useQueryClient();
  const [barcode, setBarcode] = useState("");
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: saleFormDefaults,
  });

  const { data: products = [] } = useQuery({
    queryKey: productsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/products`, {
        params: { limit: 100 },
      });
      return res.data.data as Product[];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: customersQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/customers`);
      return res.data as Customer[];
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({
      ...saleFormDefaults,
      locationId: locationId ?? locations[0]?.id ?? "",
    });
    setBarcode("");
  }, [form, isOpen, locationId, locations]);

  const close = () => {
    form.reset(saleFormDefaults);
    setBarcode("");
    onClose();
  };

  const onBarcodeLookup = async () => {
    const code = barcode.trim();
    if (!businessId || !code) return;
    try {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/products/by-barcode/${encodeURIComponent(code)}`,
      );
      const product = res.data as Product;
      form.setValue(
        "items",
        applyProductToSaleItems(form.getValues("items"), product),
        { shouldValidate: true },
      );
      setBarcode("");
    } catch (err) {
      toast.error(readSalesApiError(err, "Product not found for that barcode"));
    }
  };

  const onSubmit = async (values: SaleFormValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/sales`,
        toCreateSalePayload(values),
      );
      toast.success("Sale recorded");
      await qc.invalidateQueries({ queryKey: ["sales"] });
      close();
    } catch (err) {
      toast.error(readSalesApiError(err, "Failed to record sale"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Record sale"
      resizeOptions={SALE_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Record sale</h2>
        <p className="mt-1 text-sm text-tertiary">
          Add items, choose a customer, and take payment.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <SaleFormFields
            form={form}
            locations={locations}
            customers={customers}
            products={products.filter((row) => row.isActive)}
            barcode={barcode}
            onBarcodeChange={setBarcode}
            onBarcodeLookup={onBarcodeLookup}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Record sale
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
