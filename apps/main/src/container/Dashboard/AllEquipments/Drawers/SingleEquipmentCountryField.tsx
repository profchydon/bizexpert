"use client";

import { MarkerPin01 } from "@untitledui/icons";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Select, type SelectItemType } from "@/components/base/select/select";
import type { addSingleEquipmentSchema } from "./AddEquipment/SingleEquipment/validation";
import { withCurrentSelectOption } from "./buildEquipmentSelectItems";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  countryItems: SelectItemType[];
  countrySpan?: "full" | "half";
};

export const SingleEquipmentCountryField = ({
  form,
  countryItems,
  countrySpan = "full",
}: Props) => (
  <Controller
    control={form.control}
    name="country"
    render={({ field }) => {
      const selectedCountry = countryItems.find(
        (item) => item.id === field.value,
      );

      return (
        <div className={countrySpan === "full" ? "col-span-2" : undefined}>
          <Select.ComboBox
            label="Select Country"
            size="md"
            placeholder="Search country"
            shortcut={false}
            icon={selectedCountry?.icon ?? MarkerPin01}
            selectedKey={field.value || null}
            onSelectionChange={(key) => field.onChange(String(key ?? ""))}
            items={withCurrentSelectOption(countryItems, field.value ?? "")}
            data-testid="singleequipment-country"
          >
            {(item) => <Select.Item {...item} />}
          </Select.ComboBox>
        </div>
      );
    }}
  />
);
