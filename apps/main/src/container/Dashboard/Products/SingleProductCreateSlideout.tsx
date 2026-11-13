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
import type { Category, Location } from "@/types/bizexpert";
import { categoriesQueryKeys } from "../Categories/categoriesQueryKeys";
import {
  mainCategorySelectOptions,
  subCategorySelectOptions,
} from "../Categories/categorySelectOptions";
import { locationsQueryKeys } from "../Locations/locationsQueryKeys";
import { Input } from "@/components/base/input/input";
import { ProductCreateFormFields } from "./ProductCreateFormFields";
import { ProductVariantEditor } from "./ProductVariantEditor";
import { readProductsApiError } from "./productsApiError";
import { PRODUCT_FORM_SLIDEOUT_RESIZE } from "./productsPageClasses";
import {
  productCreateDefaults,
  productCreateSchema,
  toProductCreatePayload,
  type ProductCreateValues,
} from "./productCreateSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SingleProductCreateSlideout({ isOpen, onClose }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const form = useForm<ProductCreateValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: productCreateDefaults,
  });

  const { data: categories } = useQuery({
    queryKey: categoriesQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/categories`,
      );
      return res.data as Category[];
    },
  });

  const { data: locations } = useQuery({
    queryKey: locationsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/locations`);
      return res.data as Location[];
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(productCreateDefaults);
  }, [form, isOpen]);

  const close = () => {
    form.reset(productCreateDefaults);
    onClose();
  };

  const onSubmit = async (values: ProductCreateValues) => {
    if (!businessId) return;
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/products/full`,
        toProductCreatePayload(values),
      );
      toast.success("Product created");
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["inventory-products"] });
      close();
    } catch (err) {
      toast.error(readProductsApiError(err, "Failed to create product"));
    }
  };

  const mainCategory = form.watch("category") ?? "";
  const categoryOptions = mainCategorySelectOptions(
    categories ?? [],
    mainCategory,
  );
  const subCategoryOptions = subCategorySelectOptions(
    categories ?? [],
    mainCategory,
    form.watch("subCategory"),
  );
  const hasVariants = form.watch("hasVariants");
  const kind = form.watch("kind");
  const locationIds = form.watch("locationIds");

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Add single product"
      resizeOptions={PRODUCT_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Single product</h2>
        <p className="mt-1 text-sm text-tertiary">
          Match Lumi-style setup: type, stores, variants, and opening stock.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content className="space-y-4">
          <ProductCreateFormFields
            form={form}
            categoryOptions={categoryOptions}
            subCategoryOptions={subCategoryOptions}
            locations={locations ?? []}
          />
          {!hasVariants ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Selling price"
                type="number"
                value={String(form.watch("sellingPrice") || "")}
                onChange={(value) =>
                  form.setValue("sellingPrice", Number(value), {
                    shouldValidate: true,
                  })
                }
                isInvalid={Boolean(form.formState.errors.sellingPrice)}
                hint={form.formState.errors.sellingPrice?.message}
              />
              <Input
                label="Cost price"
                type="number"
                value={String(form.watch("purchaseCost") || "")}
                onChange={(value) =>
                  form.setValue("purchaseCost", Number(value), {
                    shouldValidate: true,
                  })
                }
                isInvalid={Boolean(form.formState.errors.purchaseCost)}
                hint={form.formState.errors.purchaseCost?.message}
              />
            </div>
          ) : (
            <ProductVariantEditor
              form={form}
              showStock={kind === "product"}
              defaultLocationId={locationIds[0]}
            />
          )}
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Create product
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
