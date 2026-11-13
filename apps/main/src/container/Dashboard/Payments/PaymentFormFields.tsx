"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { formatNgn } from "@/lib/bizexpert/format";
import type { Sale } from "@/types/bizexpert";
import { saleOutstanding } from "../Sales/saleTotals";
import {
  CREATE_PAYMENT_METHODS,
  unpaidSaleLabel,
  type CreatePaymentValues,
} from "./paymentSchema";

type Props = {
  form: UseFormReturn<CreatePaymentValues>;
  sales: Sale[];
};

export function PaymentFormFields({ form, sales }: Props) {
  const errors = form.formState.errors;
  const saleId = form.watch("saleId");
  const selected = sales.find((row) => row.id === saleId);
  const outstanding = selected ? saleOutstanding(selected) : 0;

  return (
    <>
      <NativeSelect
        label="Sale"
        value={saleId}
        onChange={(event) =>
          form.setValue("saleId", event.target.value, { shouldValidate: true })
        }
        options={[
          { value: "", label: "Select an unpaid sale" },
          ...sales.map((row) => ({
            value: row.id,
            label: unpaidSaleLabel(row),
          })),
        ]}
        hint={errors.saleId?.message}
      />
      {sales.length === 0 ? (
        <p className="text-sm text-gray-600">
          No unpaid sales. Record a credit or partial sale first.
        </p>
      ) : null}
      {selected ? (
        <p className="text-sm text-gray-600">
          Outstanding: {formatNgn(outstanding)}
        </p>
      ) : null}
      <Input
        label="Amount (NGN)"
        type="number"
        value={String(form.watch("amount") ?? "")}
        onChange={(value) =>
          form.setValue("amount", Number(value), { shouldValidate: true })
        }
        isInvalid={Boolean(errors.amount)}
        hint={errors.amount?.message}
      />
      <NativeSelect
        label="Method"
        value={form.watch("method")}
        onChange={(event) =>
          form.setValue(
            "method",
            event.target.value as CreatePaymentValues["method"],
          )
        }
        options={CREATE_PAYMENT_METHODS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <Input
        label="Reference"
        placeholder="Optional"
        value={form.watch("reference") ?? ""}
        onChange={(value) => form.setValue("reference", value)}
      />
    </>
  );
}
