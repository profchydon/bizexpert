"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Location, Product } from "@/types/bizexpert";
import { ProductSelectField } from "../Inventory/ProductSelectField";
import {
  STOCK_REMOVAL_REASONS,
  type StockRemovalFormValues,
} from "./stockRemovalSchema";

type Props = {
  form: UseFormReturn<StockRemovalFormValues>;
  locations: Location[];
  products: Product[];
};

export function StockRemovalFormFields({ form, locations, products }: Props) {
  const errors = form.formState.errors;
  return (
    <>
      <NativeSelect
        label="Store"
        value={form.watch("locationId")}
        onChange={(event) =>
          form.setValue("locationId", event.target.value, {
            shouldValidate: true,
          })
        }
        options={[
          { value: "", label: "Select a store" },
          ...locations.map((row) => ({ value: row.id, label: row.name })),
        ]}
        hint={errors.locationId?.message}
      />
      <ProductSelectField
        products={products}
        value={form.watch("productId")}
        onChange={(value) =>
          form.setValue("productId", value, { shouldValidate: true })
        }
        isInvalid={Boolean(errors.productId)}
        hint={errors.productId?.message}
      />
      <Input
        label="Quantity to remove"
        type="number"
        value={String(form.watch("quantity") ?? "")}
        onChange={(value) =>
          form.setValue("quantity", Number(value), { shouldValidate: true })
        }
        isInvalid={Boolean(errors.quantity)}
        hint={errors.quantity?.message}
      />
      <NativeSelect
        label="Reason"
        value={form.watch("reason")}
        onChange={(event) =>
          form.setValue(
            "reason",
            event.target.value as StockRemovalFormValues["reason"],
            { shouldValidate: true },
          )
        }
        options={STOCK_REMOVAL_REASONS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <Input
        label={form.watch("reason") === "Other" ? "Details" : "Notes"}
        placeholder={
          form.watch("reason") === "Other"
            ? "Why is this stock being removed?"
            : "Optional"
        }
        value={form.watch("notes") ?? ""}
        onChange={(value) =>
          form.setValue("notes", value, { shouldValidate: true })
        }
        isInvalid={Boolean(errors.notes)}
        hint={errors.notes?.message}
      />
    </>
  );
}
