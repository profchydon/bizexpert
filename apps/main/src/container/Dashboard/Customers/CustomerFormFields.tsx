"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import type { CustomerFormValues } from "./customerSchema";

type Props = {
  form: UseFormReturn<CustomerFormValues>;
};

export function CustomerFormFields({ form }: Props) {
  const errors = form.formState.errors;
  return (
    <>
      <Input
        label="Customer name"
        placeholder="Adaeze Okonkwo"
        value={form.watch("name")}
        onChange={(value) =>
          form.setValue("name", value, { shouldValidate: true })
        }
        isInvalid={Boolean(errors.name)}
        hint={errors.name?.message}
      />
      <Input
        label="Phone"
        placeholder="0801 111 2222"
        value={form.watch("phone") ?? ""}
        onChange={(value) => form.setValue("phone", value)}
      />
      <Input
        label="Email"
        placeholder="Optional"
        value={form.watch("email") ?? ""}
        onChange={(value) =>
          form.setValue("email", value, { shouldValidate: true })
        }
        isInvalid={Boolean(errors.email)}
        hint={errors.email?.message}
      />
      <Input
        label="Address"
        placeholder="Optional"
        value={form.watch("address") ?? ""}
        onChange={(value) => form.setValue("address", value)}
      />
      <Input
        label="Credit limit (NGN)"
        type="number"
        value={String(form.watch("creditLimit") ?? "")}
        onChange={(value) =>
          form.setValue("creditLimit", Number(value) || 0, {
            shouldValidate: true,
          })
        }
        isInvalid={Boolean(errors.creditLimit)}
        hint={errors.creditLimit?.message}
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
