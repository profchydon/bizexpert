"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { AddressAutocomplete } from "@/components/base/input/address-autocomplete";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import type { EditEmployeeFormValues } from "./buildEditEmployeeFormData";
import { EditEmployeeLockedField } from "./editEmployeeFormLayout";

type Props = {
  form: UseFormReturn<EditEmployeeFormValues>;
  canEditAddress: boolean;
  freeTextAddress?: boolean;
};

export function EditEmployeeLocationFields({
  form,
  canEditAddress,
  freeTextAddress = false,
}: Props) {
  const { control } = form;

  return (
    <>
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <EditEmployeeLockedField locked={!canEditAddress}>
            {freeTextAddress ? (
              <Input
                size="md"
                label="Address"
                placeholder="123 Main St"
                value={field.value ?? ""}
                onChange={field.onChange}
                isDisabled={!canEditAddress}
                autoComplete="off"
                data-testid="editemployeelocationfields-input"
              />
            ) : (
              <AddressAutocomplete
                size="md"
                label="Address"
                placeholder="123 Main St"
                value={field.value ?? ""}
                onChange={field.onChange}
                isDisabled={!canEditAddress}
              />
            )}
          </EditEmployeeLockedField>
        )}
      />

      <Controller
        control={control}
        name="landmark"
        render={({ field }) => (
          <TextArea
            label="Nearest landmark"
            placeholder="Near the central park..."
            value={field.value ?? ""}
            onChange={field.onChange}
            rows={3}
          />
        )}
      />
    </>
  );
}
