"use client";

import { NativeSelect } from "@/components/base/select/select-native";
import type { Product } from "@/types/bizexpert";

type Props = {
  products: Product[] | undefined;
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  hint?: string;
};

export function ProductSelectField({
  products,
  value,
  onChange,
  isInvalid,
  hint,
}: Props) {
  return (
    <NativeSelect
      name="productId"
      label="Product"
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-invalid={isInvalid}
      hint={hint}
      options={[
        { value: "", label: "Select product", disabled: true },
        ...(products ?? []).map((product) => ({
          value: product.id,
          label: product.name,
        })),
      ]}
    />
  );
}
