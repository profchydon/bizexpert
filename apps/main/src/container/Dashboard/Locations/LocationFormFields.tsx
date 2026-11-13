"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { type CreateLocationValues } from "./createLocationSchema";
import { LocationStoreTypeFields } from "./LocationStoreTypeFields";
import { STORE_BUSINESS_TYPE_OPTIONS } from "./storeBusinessTypes";

type Props = {
  form: UseFormReturn<CreateLocationValues>;
  showDefault: boolean;
  isEdit: boolean;
};

export function LocationFormFields({ form, showDefault, isEdit }: Props) {
  return (
    <>
      <Input
        label="Store name"
        placeholder="Main store"
        value={form.watch("name")}
        onChange={(value) =>
          form.setValue("name", value, { shouldValidate: true })
        }
        isInvalid={Boolean(form.formState.errors.name)}
        hint={form.formState.errors.name?.message}
      />
      <Input
        label="Address"
        placeholder="Street, city"
        value={form.watch("address")}
        onChange={(value) =>
          form.setValue("address", value, { shouldValidate: true })
        }
        isInvalid={Boolean(form.formState.errors.address)}
        hint={form.formState.errors.address?.message}
      />
      <NativeSelect
        label="Business type"
        value={form.watch("businessType")}
        onChange={(event) =>
          form.setValue(
            "businessType",
            event.target.value as CreateLocationValues["businessType"],
            { shouldValidate: true },
          )
        }
        options={STORE_BUSINESS_TYPE_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      />
      <Input
        label="VAT rate (%)"
        placeholder="0"
        type="number"
        value={String(form.watch("vatRate"))}
        onChange={(value) =>
          form.setValue("vatRate", Number(value) || 0, { shouldValidate: true })
        }
        isInvalid={Boolean(form.formState.errors.vatRate)}
        hint={form.formState.errors.vatRate?.message}
      />
      <LocationStoreTypeFields form={form} isEdit={isEdit} />
      <Input
        label="Phone"
        placeholder="Optional"
        value={form.watch("phone") ?? ""}
        onChange={(value) => form.setValue("phone", value)}
      />
      {showDefault ? (
        <Checkbox
          label="Set as default store"
          isSelected={form.watch("isDefault")}
          onChange={(selected) => form.setValue("isDefault", selected)}
        />
      ) : null}
    </>
  );
}
