"use client";

import { Plus, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/bizexpert";
import { saleFormDefaults, type SaleFormValues } from "./saleSchema";

type Props = {
  form: UseFormReturn<SaleFormValues>;
  products: Product[];
};

export function SaleLineItems({ form, products }: Props) {
  const items = form.watch("items");
  const errors = form.formState.errors.items;

  const setItem = (
    index: number,
    patch: Partial<SaleFormValues["items"][number]>,
  ) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );
    form.setValue("items", next, { shouldValidate: true });
  };

  const onProduct = (index: number, productId: string) => {
    const product = products.find((row) => row.id === productId);
    setItem(index, {
      productId,
      unitName: product?.baseUnit ?? "",
      unitPrice: product ? Number(product.sellingPrice) || "" : "",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-primary">Items</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            form.setValue("items", [...items, ...saleFormDefaults.items], {
              shouldValidate: true,
            })
          }
        >
          <Plus className="size-4" />
          Add item
        </Button>
      </div>
      {typeof errors?.message === "string" ? (
        <p className="text-sm text-error-600">{errors.message}</p>
      ) : null}
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-12"
        >
          <NativeSelect
            label="Product"
            className="sm:col-span-12"
            value={item.productId}
            onChange={(event) => onProduct(index, event.target.value)}
            options={[
              { value: "", label: "Select a product" },
              ...products.map((row) => ({ value: row.id, label: row.name })),
            ]}
          />
          <Input
            label="Qty"
            type="number"
            className="sm:col-span-3"
            value={String(item.quantity ?? "")}
            onChange={(value) => setItem(index, { quantity: Number(value) })}
          />
          <Input
            label="Unit"
            className="sm:col-span-3"
            value={item.unitName ?? ""}
            onChange={(value) => setItem(index, { unitName: value })}
          />
          <Input
            label="Price"
            type="number"
            className="sm:col-span-3"
            value={String(item.unitPrice ?? "")}
            onChange={(value) =>
              setItem(index, { unitPrice: value === "" ? "" : Number(value) })
            }
          />
          <div className="flex items-end sm:col-span-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={items.length === 1}
              onClick={() =>
                form.setValue(
                  "items",
                  items.filter((_, i) => i !== index),
                  { shouldValidate: true },
                )
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
