"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Input } from "@/components/base/input/input";
import { Select, type SelectItemType } from "@/components/base/select/select";
import {
  EQUIPMENT_STATE_ITEMS,
  withCurrentSelectOption,
} from "./buildEquipmentSelectItems";
import { SingleEquipmentCountryField } from "./SingleEquipmentCountryField";
import { useEquipmentTypeSelectItems } from "./useEquipmentTypeSelectItems";
import type { addSingleEquipmentSchema } from "./AddEquipment/SingleEquipment/validation";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  countryItems: SelectItemType[];
  watchedType: string;
  watchedState: string;
  countrySpan?: "full" | "half";
  maxPurchaseDate?: string;
};

export const SingleEquipmentEditCoreFields = ({
  form,
  countryItems,
  watchedType,
  watchedState,
  countrySpan = "full",
  maxPurchaseDate,
}: Props) => {
  const typeItems = useEquipmentTypeSelectItems(watchedType, (value) =>
    form.setValue("type", value),
  );

  return (
    <>
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Input
            size="md"
            label="Asset title"
            isRequired
            placeholder="Add asset title"
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={Boolean(fieldState.error)}
            hint={fieldState.error?.message}
            data-testid="singleequipmenteditcorefields-input"
          />
        )}
      />
      <Controller
        control={form.control}
        name="serial_number"
        render={({ field }) => (
          <Input
            size="md"
            label="Serial number"
            placeholder="Add serial number"
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            data-testid="singleequipmenteditcorefields-input-2"
          />
        )}
      />
      <Controller
        control={form.control}
        name="make"
        render={({ field }) => (
          <Input
            size="md"
            label="Make"
            placeholder="Add make"
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            data-testid="singleequipmenteditcorefields-input-3"
          />
        )}
      />
      <Controller
        control={form.control}
        name="model"
        render={({ field }) => (
          <Input
            size="md"
            label="Model"
            placeholder="Add model"
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            data-testid="singleequipmenteditcorefields-input-4"
          />
        )}
      />
      <Controller
        control={form.control}
        name="year"
        render={({ field }) => (
          <Input
            size="md"
            label="Year"
            type="number"
            placeholder="Add year"
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            data-testid="singleequipmenteditcorefields-input-5"
          />
        )}
      />
      <Controller
        control={form.control}
        name="type"
        render={({ field, fieldState }) => (
          <Select
            label="Asset type"
            size="md"
            isRequired
            placeholder="Select asset type"
            selectedKey={field.value || null}
            onSelectionChange={(key) => field.onChange(String(key ?? ""))}
            items={withCurrentSelectOption(typeItems, watchedType)}
            isInvalid={Boolean(fieldState.error)}
            hint={fieldState.error?.message}
            data-testid="singleequipmenteditcorefields-select"
          >
            {(item) => <Select.Item {...item} />}
          </Select>
        )}
      />
      <Controller
        control={form.control}
        name="state"
        render={({ field, fieldState }) => (
          <Select
            label="Asset state"
            size="md"
            isRequired
            placeholder="Select state"
            selectedKey={field.value || null}
            onSelectionChange={(key) => field.onChange(String(key ?? ""))}
            items={withCurrentSelectOption(EQUIPMENT_STATE_ITEMS, watchedState)}
            isInvalid={Boolean(fieldState.error)}
            hint={fieldState.error?.message}
            data-testid="singleequipmenteditcorefields-select-2"
          >
            {(item) => <Select.Item {...item} />}
          </Select>
        )}
      />
      <Controller
        control={form.control}
        name="purchase_date"
        render={({ field }) => (
          <Input
            size="md"
            label="Purchase date"
            type="date"
            max={maxPurchaseDate}
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            data-testid="singleequipmenteditcorefields-input-6"
          />
        )}
      />
      <SingleEquipmentCountryField
        form={form}
        countryItems={countryItems}
        countrySpan={countrySpan}
      />
    </>
  );
};
