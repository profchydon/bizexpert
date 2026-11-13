"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Customer, Location, Product } from "@/types/bizexpert";
import { SaleLineItems } from "./SaleLineItems";
import { PAYMENT_METHODS, type SaleFormValues } from "./saleSchema";

type Props = {
  form: UseFormReturn<SaleFormValues>;
  locations: Location[];
  customers: Customer[];
  products: Product[];
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onBarcodeLookup: () => void;
};

export function SaleFormFields({
  form,
  locations,
  customers,
  products,
  barcode,
  onBarcodeChange,
  onBarcodeLookup,
}: Props) {
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
      <NativeSelect
        label="Customer"
        value={form.watch("customerId") ?? ""}
        onChange={(event) => form.setValue("customerId", event.target.value)}
        options={[
          { value: "", label: "Walk-in / named customer" },
          ...customers.map((row) => ({ value: row.id, label: row.name })),
        ]}
      />
      {!form.watch("customerId") ? (
        <Input
          label="Customer name"
          placeholder="Optional walk-in name"
          value={form.watch("customerName") ?? ""}
          onChange={(value) => form.setValue("customerName", value)}
        />
      ) : null}
      <Input
        label="Scan barcode"
        placeholder="Scan or type, then press Enter"
        value={barcode}
        onChange={onBarcodeChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onBarcodeLookup();
          }
        }}
      />
      <SaleLineItems form={form} products={products} />
      <NativeSelect
        label="Payment method"
        value={form.watch("paymentMethod") ?? "cash"}
        onChange={(event) =>
          form.setValue(
            "paymentMethod",
            event.target.value as SaleFormValues["paymentMethod"],
          )
        }
        options={PAYMENT_METHODS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <Input
        label="Payment reference"
        placeholder="Optional bank or POS reference"
        value={form.watch("paymentReference") ?? ""}
        onChange={(value) => form.setValue("paymentReference", value)}
      />
      <Input
        label="Sale discount (NGN)"
        type="number"
        value={String(form.watch("discountAmount") ?? "")}
        onChange={(value) =>
          form.setValue("discountAmount", Number(value) || 0)
        }
      />
      <Input
        label="Notes"
        placeholder="Optional"
        value={form.watch("notes") ?? ""}
        onChange={(value) => form.setValue("notes", value)}
      />
    </>
  );
}
