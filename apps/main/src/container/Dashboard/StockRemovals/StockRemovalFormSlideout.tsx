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
import type { Product } from "@/types/bizexpert";
import { readInventoryApiError } from "../Inventory/inventoryApiError";
import { productsQueryKeys } from "../Products/productsQueryKeys";
import { StockRemovalFormFields } from "./StockRemovalFormFields";
import { STOCK_REMOVAL_FORM_SLIDEOUT_RESIZE } from "./stockRemovalsPageClasses";
import {
  stockRemovalFormDefaults,
  stockRemovalFormSchema,
  toStockRemovalPayload,
  type StockRemovalFormValues,
} from "./stockRemovalSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function StockRemovalFormSlideout({ isOpen, onClose }: Props) {
  const { businessId, locationId, locations } = useBizExpertBusiness();
  const qc = useQueryClient();
  const form = useForm<StockRemovalFormValues>({
    resolver: zodResolver(stockRemovalFormSchema),
    defaultValues: stockRemovalFormDefaults,
  });

  const { data: products = [] } = useQuery({
    queryKey: productsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/products`, {
        params: { limit: 100 },
      });
      return (res.data.data as Product[]).filter((row) => row.isActive);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset({
      ...stockRemovalFormDefaults,
      locationId: locationId ?? locations[0]?.id ?? "",
    });
  }, [form, isOpen, locationId, locations]);

  const close = () => {
    form.reset(stockRemovalFormDefaults);
    onClose();
  };

  const onSubmit = async (values: StockRemovalFormValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/inventory/adjust`,
        toStockRemovalPayload(values),
      );
      toast.success("Stock removed");
      await qc.invalidateQueries({ queryKey: ["stock-removals"] });
      await qc.invalidateQueries({ queryKey: ["inventory-balances"] });
      await qc.invalidateQueries({ queryKey: ["inventory-movements"] });
      close();
    } catch (err) {
      toast.error(readInventoryApiError(err, "Failed to remove stock"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Remove stock"
      resizeOptions={STOCK_REMOVAL_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Remove stock</h2>
        <p className="mt-1 text-sm text-tertiary">
          Take damaged, expired, or excess items out of a store.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <StockRemovalFormFields
            form={form}
            locations={locations}
            products={products}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Remove stock
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
