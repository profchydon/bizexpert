"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Input } from "@/components/base/input/input";
import { Select, type SelectItemType } from "@/components/base/select/select";
import type { editImportedEquipmentSchema } from "./validation";

type FormValues = z.infer<typeof editImportedEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  currencyItems: SelectItemType[];
};

const EditImportedEquipmentPriceFields = ({ form, currencyItems }: Props) => (
  <>
    <Controller
      control={form.control}
      name="purchase_price"
      render={({ field, fieldState }) => (
        <Input
          size="md"
          label="Purchase price"
          type="number"
          placeholder="Add purchase price"
          value={String(field.value ?? "")}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={Boolean(fieldState.error)}
          hint={fieldState.error?.message}
          data-testid="editimportedequipmentpricefields-input"
        />
      )}
    />
    <Controller
      control={form.control}
      name="currency_id"
      render={({ field, fieldState }) => (
        <Select
          label="Currency"
          size="md"
          placeholder="Currency"
          selectedKey={field.value || null}
          onSelectionChange={(key) => field.onChange(String(key ?? ""))}
          items={currencyItems}
          isInvalid={Boolean(fieldState.error)}
          hint={fieldState.error?.message}
          data-testid="editimportedequipmentpricefields-select"
        >
          {(item) => <Select.Item {...item} />}
        </Select>
      )}
    />
  </>
);

export default EditImportedEquipmentPriceFields;
