"use client";

import { Building07 } from "@untitledui/icons";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Select, type SelectItemType } from "@/components/base/select/select";
import type { addSingleEquipmentSchema } from "./SingleEquipment/validation";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  officeItems: SelectItemType[];
};

export const SingleEquipmentAddOfficeField = ({ form, officeItems }: Props) => {
  if (officeItems.length === 0) return null;

  const isOnlyOffice = officeItems.length === 1;

  return (
    <Controller
      control={form.control}
      name="office_id"
      render={({ field }) => (
        <Select.ComboBox
          label="Assign to office"
          size="md"
          placeholder="Search office"
          shortcut={false}
          icon={Building07}
          isDisabled={isOnlyOffice}
          hint={isOnlyOffice ? "The only office in this workspace." : undefined}
          selectedKey={field.value ? String(field.value) : null}
          onSelectionChange={(key) => field.onChange(key ? String(key) : "")}
          items={officeItems}
          data-testid="singleequipmentaddofficefield-combobox"
        >
          {(item) => <Select.Item {...item} icon={Building07} />}
        </Select.ComboBox>
      )}
    />
  );
};
