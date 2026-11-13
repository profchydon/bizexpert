"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Product } from "@/types/bizexpert";
import {
  mainCategorySelectOptions,
  subCategorySelectOptions,
} from "../Categories/categorySelectOptions";
import { categoriesQueryKeys } from "../Categories/categoriesQueryKeys";
import { ProductFormFields } from "./ProductFormFields";
import { readProductsApiError } from "./productsApiError";
import { PRODUCT_FORM_SLIDEOUT_RESIZE } from "./productsPageClasses";
import { productsQueryKeys } from "./productsQueryKeys";
import {
  productFormDefaults,
  productFormSchema,
  toCreateProductPayload,
  toUpdateProductPayload,
  valuesFromProduct,
  type ProductFormValues,
} from "./productSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
};

export function ProductFormSlideout({ isOpen, onClose, product }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const isEdit = Boolean(product);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? valuesFromProduct(product) : productFormDefaults,
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

  const mainCategory = form.watch("category") || product?.category || "";
  const categoryOptions = mainCategorySelectOptions(
    categories ?? [],
    mainCategory,
  );
  const subCategoryOptions = subCategorySelectOptions(
    categories ?? [],
    mainCategory,
    form.watch("subCategory") || product?.subCategory,
  );

  useEffect(() => {
    if (!isOpen) return;
    form.reset(product ? valuesFromProduct(product) : productFormDefaults);
  }, [form, isOpen, product]);

  const close = () => {
    form.reset(productFormDefaults);
    onClose();
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!businessId) return;
    try {
      if (product) {
        await bizexpertApi.put(
          `/businesses/${businessId}/products/${product.id}`,
          toUpdateProductPayload(values),
        );
        toast.success("Product updated");
      } else {
        await bizexpertApi.post(
          `/businesses/${businessId}/products`,
          toCreateProductPayload(values),
        );
        toast.success("Product added");
      }
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["inventory-products"] });
      if (product) {
        await qc.invalidateQueries({
          queryKey: productsQueryKeys.detail(businessId, product.id),
        });
      }
      close();
    } catch (err) {
      toast.error(
        readProductsApiError(
          err,
          product ? "Failed to update product" : "Failed to add product",
        ),
      );
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel={isEdit ? "Edit product" : "Add product"}
      resizeOptions={PRODUCT_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          {isEdit ? "Edit product" : "Add product"}
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          {isEdit
            ? "Update catalog details, pricing, and units."
            : "Add an item to your catalog for sales and inventory."}
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <ProductFormFields
            form={form}
            categoryOptions={categoryOptions}
            subCategoryOptions={subCategoryOptions}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            {isEdit ? "Save changes" : "Save product"}
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
