import { z } from "zod";
import type { Product } from "@/types/bizexpert";

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  sellingPrice: z.coerce
    .number()
    .positive("Selling price must be greater than 0"),
  purchaseCost: z.coerce
    .number()
    .positive("Purchase cost must be greater than 0"),
  baseUnit: z.string().trim().min(1, "Base unit is required"),
  lowStockThreshold: z.coerce.number().min(0, "Threshold cannot be negative"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormDefaults: ProductFormValues = {
  name: "",
  sku: "",
  barcode: "",
  category: "",
  subCategory: "",
  sellingPrice: 0,
  purchaseCost: 0,
  baseUnit: "piece",
  lowStockThreshold: 0,
};

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function valuesFromProduct(product: Product): ProductFormValues {
  return {
    name: product.name,
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    category: product.category ?? "",
    subCategory: product.subCategory ?? "",
    sellingPrice: Number(product.sellingPrice),
    purchaseCost: Number(product.purchaseCost),
    baseUnit: product.baseUnit || "piece",
    lowStockThreshold: Number(product.lowStockThreshold ?? 0),
  };
}

export function toCreateProductPayload(values: ProductFormValues) {
  return {
    name: values.name.trim(),
    sku: optionalText(values.sku),
    barcode: optionalText(values.barcode),
    category: optionalText(values.category),
    subCategory: optionalText(values.subCategory),
    sellingPrice: values.sellingPrice,
    purchaseCost: values.purchaseCost,
    baseUnit: values.baseUnit.trim(),
    lowStockThreshold: values.lowStockThreshold,
  };
}

export function toUpdateProductPayload(values: ProductFormValues) {
  return {
    name: values.name.trim(),
    sku: values.sku?.trim() || "",
    barcode: values.barcode?.trim() || "",
    category: values.category?.trim() || "",
    subCategory: values.subCategory?.trim() || "",
    sellingPrice: values.sellingPrice,
    purchaseCost: values.purchaseCost,
    baseUnit: values.baseUnit.trim(),
    lowStockThreshold: values.lowStockThreshold,
  };
}
