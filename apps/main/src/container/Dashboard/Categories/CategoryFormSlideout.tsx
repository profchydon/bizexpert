"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Category } from "@/types/bizexpert";
import { CategoryFormFields } from "./CategoryFormFields";
import { readCategoryApiError } from "./categoryApiError";
import { CATEGORY_FORM_SLIDEOUT_RESIZE } from "./categoriesPageClasses";
import { categoriesQueryKeys } from "./categoriesQueryKeys";
import { isMainCategory } from "./categoryHierarchyDisplay";
import {
  categoryFormDefaults,
  categoryFormSchema,
  toCategoryPayload,
  valuesFromCategory,
  type CategoryFormValues,
} from "./categorySchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  parentCategory?: Category | null;
};

function defaultsForOpen(
  category: Category | null | undefined,
  parentCategory: Category | null | undefined,
): CategoryFormValues {
  if (category) return valuesFromCategory(category);
  if (parentCategory) {
    return { ...categoryFormDefaults, parentId: parentCategory.id };
  }
  return categoryFormDefaults;
}

export function CategoryFormSlideout({
  isOpen,
  onClose,
  category,
  parentCategory,
}: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const isEdit = Boolean(category);

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

  const resolvedParent =
    parentCategory ??
    (category?.parentId
      ? categories?.find((row) => row.id === category.parentId)
      : null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultsForOpen(category, parentCategory),
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(defaultsForOpen(category, parentCategory));
  }, [form, isOpen, category, parentCategory]);

  const close = () => {
    form.reset(categoryFormDefaults);
    onClose();
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!businessId) return;
    if (!isEdit && values.parentId && !values.parentId.trim()) {
      toast.error("Select a main category for this sub-category");
      return;
    }
    try {
      if (category) {
        await bizexpertApi.put(
          `/businesses/${businessId}/categories/${category.id}`,
          { name: values.name.trim() },
        );
        toast.success("Category updated");
      } else {
        await bizexpertApi.post(
          `/businesses/${businessId}/categories`,
          toCategoryPayload(values),
        );
        toast.success(
          values.parentId ? "Sub-category added" : "Category added",
        );
      }
      await qc.invalidateQueries({
        queryKey: categoriesQueryKeys.list(businessId),
      });
      await qc.invalidateQueries({ queryKey: ["products"] });
      close();
    } catch (err) {
      toast.error(
        readCategoryApiError(
          err,
          category ? "Failed to update category" : "Failed to add category",
        ),
      );
    }
  };

  const addingSub = Boolean(parentCategory) || Boolean(form.watch("parentId"));
  const title = isEdit
    ? category && !isMainCategory(category)
      ? "Edit sub-category"
      : "Edit category"
    : addingSub
      ? "Add sub-category"
      : "Add category";

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel={title}
      resizeOptions={CATEGORY_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="mt-1 text-sm text-tertiary">
          {isEdit
            ? "Rename this category. Linked products will be updated."
            : addingSub
              ? "Create a sub-category under a main category, like Lumi inventory."
              : "Create a main product category for catalog and reports."}
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <CategoryFormFields
            form={form}
            mainCategories={categories ?? []}
            fixedParent={resolvedParent ?? null}
            isEdit={isEdit}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            {isEdit
              ? "Save changes"
              : addingSub
                ? "Add sub-category"
                : "Add category"}
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
