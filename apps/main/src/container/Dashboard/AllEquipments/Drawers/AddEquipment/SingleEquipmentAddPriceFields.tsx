"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { InputBase } from "@/components/base/input/input";
import { InputGroup } from "@/components/base/input/input-group";
import { NativeSelect } from "@/components/base/select/select-native";
import type { SelectItemType } from "@/components/base/select/select";
import type { addSingleEquipmentSchema } from "./SingleEquipment/validation";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  currencyItems: SelectItemType[];
  isCurrencyLocked?: boolean;
  currencyHint?: string;
};

export const SingleEquipmentAddPriceFields = ({
  form,
  currencyItems,
  isCurrencyLocked,
  currencyHint,
}: Props) => {
  const currencyOptions = currencyItems.map((item) => ({
    value: String(item.id),
    label: String(item.label ?? ""),
  }));

  return (
    <Controller
      control={form.control}
      name="purchase_price"
      render={({ field, fieldState }) => (
        <InputGroup
          size="md"
          label="Purchase price"
          value={String(field.value ?? "")}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={Boolean(fieldState.error)}
          hint={fieldState.error?.message ?? currencyHint}
          trailingAddon={
            <Controller
              control={form.control}
              name="currency_id"
              render={({ field: currencyField }) => (
                <NativeSelect
                  aria-label="Currency"
                  disabled={isCurrencyLocked}
                  value={String(currencyField.value ?? "")}
                  onChange={(event) =>
                    currencyField.onChange(event.target.value)
                  }
                  options={currencyOptions}
                  data-testid="singleequipmentaddpricefields-select"
                />
              )}
            />
          }
        >
          <InputBase
            type="tel"
            inputMode="decimal"
            placeholder="1,000.00"
            data-testid="singleequipmentaddpricefields-input"
          />
        </InputGroup>
      )}
    />
  );
};
