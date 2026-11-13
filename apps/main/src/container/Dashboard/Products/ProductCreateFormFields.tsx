"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import type { Location } from "@/types/bizexpert";
import {
  PRODUCT_KIND_OPTIONS,
  PRODUCT_UNIT_OPTIONS,
} from "./productKindOptions";
import type { ProductCreateValues } from "./productCreateSchema";

type Props = {
  form: UseFormReturn<ProductCreateValues>;
  categoryOptions: { value: string; label: string }[];
  subCategoryOptions: { value: string; label: string }[];
  locations: Location[];
};

export function ProductCreateFormFields({
  form,
  categoryOptions,
  subCategoryOptions,
  locations,
}: Props) {
  const errors = form.formState.errors;
  const kind = form.watch("kind");
  const hasVariants = form.watch("hasVariants");
  const selected = form.watch("locationIds");

  const toggleLocation = (locationId: string, checked: boolean) => {
    const next = checked
      ? [...selected, locationId]
      : selected.filter((id) => id !== locationId);
    form.setValue("locationIds", next, { shouldValidate: true });
  };

  return (
    <>
      <NativeSelect
        label="Type"
        value={form.watch("kind")}
        onChange={(event) =>
          form.setValue(
            "kind",
            event.target.value as ProductCreateValues["kind"],
          )
        }
        options={PRODUCT_KIND_OPTIONS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <Input
        label="Product name"
        value={form.watch("name")}
        onChange={(value) =>
          form.setValue("name", value, { shouldValidate: true })
        }
        isInvalid={Boolean(errors.name)}
        hint={errors.name?.message}
      />
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
      {!hasVariants ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="SKU"
            value={form.watch("sku") ?? ""}
            onChange={(value) => form.setValue("sku", value)}
          />
          <Input
            label="Barcode"
            value={form.watch("barcode") ?? ""}
            onChange={(value) => form.setValue("barcode", value)}
          />
        </div>
      ) : null}
      <NativeSelect
        label="Unit"
        value={form.watch("baseUnit")}
        onChange={(event) => form.setValue("baseUnit", event.target.value)}
        options={PRODUCT_UNIT_OPTIONS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <Input
        label="Image URL"
        placeholder="Optional"
        value={form.watch("imageUrl") ?? ""}
        onChange={(value) => form.setValue("imageUrl", value)}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Stores</p>
        {locations.map((location) => (
          <Checkbox
            key={location.id}
            label={location.name}
            isSelected={selected.includes(location.id)}
            onChange={(checked) => toggleLocation(location.id, checked)}
          />
        ))}
        {errors.locationIds?.message ? (
          <p className="text-sm text-error-600">{errors.locationIds.message}</p>
        ) : null}
      </div>
      <Checkbox
        label="This product has variants"
        isSelected={hasVariants}
        onChange={(checked) => form.setValue("hasVariants", checked)}
      />
      {!hasVariants && kind === "product" ? (
        <Input
          label="Opening quantity (first selected store)"
          type="number"
          value={String(form.watch("openingStock")?.[0]?.quantity ?? "")}
          onChange={(value) => {
            const locationId = selected[0];
            if (!locationId) return;
            form.setValue("openingStock", [
              { locationId, quantity: Number(value) || 0 },
            ]);
          }}
        />
      ) : null}
    </>
  );
}
