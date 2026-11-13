"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import type { ProductFormValues } from "./productSchema";

type Props = {
  form: UseFormReturn<ProductFormValues>;
  categoryOptions: { value: string; label: string }[];
  subCategoryOptions: { value: string; label: string }[];
};

export function ProductFormFields({
  form,
  categoryOptions,
  subCategoryOptions,
}: Props) {
  const errors = form.formState.errors;
  return (
    <>
      <Input
        label="Product name"
        placeholder="Indomie Noodles 70g"
        value={form.watch("name")}
        onChange={(value) =>
          form.setValue("name", value, { shouldValidate: true })
        }
        isInvalid={Boolean(errors.name)}
        hint={errors.name?.message}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="SKU"
          placeholder="Optional"
          value={form.watch("sku") ?? ""}
          onChange={(value) => form.setValue("sku", value)}
        />
        <Input
          label="Barcode"
          placeholder="Optional"
          value={form.watch("barcode") ?? ""}
          onChange={(value) => form.setValue("barcode", value)}
        />
      </div>
      <NativeSelect
        label="Main category"
        value={form.watch("category") ?? ""}
        onChange={(event) => {
          form.setValue("category", event.target.value);
          form.setValue("subCategory", "");
        }}
        options={categoryOptions}
      />
      <NativeSelect
        label="Sub-category"
        value={form.watch("subCategory") ?? ""}
        onChange={(event) => form.setValue("subCategory", event.target.value)}
        options={subCategoryOptions}
      />
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
          isInvalid={Boolean(errors.sellingPrice)}
          hint={errors.sellingPrice?.message}
        />
        <Input
          label="Purchase cost"
          type="number"
          value={String(form.watch("purchaseCost") || "")}
          onChange={(value) =>
            form.setValue("purchaseCost", Number(value), {
              shouldValidate: true,
            })
          }
          isInvalid={Boolean(errors.purchaseCost)}
          hint={errors.purchaseCost?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Base unit"
          value={form.watch("baseUnit")}
          onChange={(value) =>
            form.setValue("baseUnit", value, { shouldValidate: true })
          }
          isInvalid={Boolean(errors.baseUnit)}
          hint={errors.baseUnit?.message}
        />
        <Input
          label="Low stock threshold"
          type="number"
          value={String(form.watch("lowStockThreshold") ?? "")}
          onChange={(value) =>
            form.setValue("lowStockThreshold", Number(value), {
              shouldValidate: true,
            })
          }
          isInvalid={Boolean(errors.lowStockThreshold)}
          hint={errors.lowStockThreshold?.message}
        />
      </div>
    </>
  );
}
