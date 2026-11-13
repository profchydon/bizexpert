"use client";

import type { UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/ui/button";
import type { ProductCreateValues } from "./productCreateSchema";

type Props = {
  form: UseFormReturn<ProductCreateValues>;
  showStock: boolean;
  defaultLocationId?: string;
};

export function ProductVariantEditor({
  form,
  showStock,
  defaultLocationId,
}: Props) {
  const variants = form.watch("variants") ?? [];

  const updateVariant = (
    index: number,
    patch: Partial<NonNullable<ProductCreateValues["variants"]>[number]>,
  ) => {
    const next = variants.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    form.setValue("variants", next, { shouldValidate: true });
  };

  const addVariant = () => {
    form.setValue("variants", [
      ...variants,
      { name: "", sellingPrice: 0, purchaseCost: 0, openingStock: [] },
    ]);
  };

  const removeVariant = (index: number) => {
    form.setValue(
      "variants",
      variants.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-4">
      {variants.map((variant, index) => (
        <div
          key={`variant-${index}`}
          className="space-y-3 rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">
              Variant {index + 1}
            </p>
            {variants.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeVariant(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
          <Input
            label="Variant name"
            value={variant.name}
            onChange={(value) => updateVariant(index, { name: value })}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Selling price"
              type="number"
              value={String(variant.sellingPrice || "")}
              onChange={(value) =>
                updateVariant(index, { sellingPrice: Number(value) })
              }
            />
            <Input
              label="Cost price"
              type="number"
              value={String(variant.purchaseCost || "")}
              onChange={(value) =>
                updateVariant(index, { purchaseCost: Number(value) })
              }
            />
          </div>
          {showStock && defaultLocationId ? (
            <Input
              label="Opening quantity"
              type="number"
              value={String(variant.openingStock?.[0]?.quantity ?? "")}
              onChange={(value) =>
                updateVariant(index, {
                  openingStock: [
                    {
                      locationId: defaultLocationId,
                      quantity: Number(value) || 0,
                    },
                  ],
                })
              }
            />
          ) : null}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addVariant}>
        <Plus className="mr-2 size-4" />
        Add another variant
      </Button>
    </div>
  );
}
