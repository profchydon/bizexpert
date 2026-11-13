import { z } from "zod";
import type { Category } from "@/types/bizexpert";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be 100 characters or fewer"),
  parentId: z.string().uuid().optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormDefaults: CategoryFormValues = {
  name: "",
  parentId: "",
};

export function valuesFromCategory(category: Category): CategoryFormValues {
  return {
    name: category.name,
    parentId: category.parentId ?? "",
  };
}

export function toCategoryPayload(values: CategoryFormValues) {
  const parentId = values.parentId?.trim();
  return {
    name: values.name.trim(),
    ...(parentId ? { parentId } : {}),
  };
}
