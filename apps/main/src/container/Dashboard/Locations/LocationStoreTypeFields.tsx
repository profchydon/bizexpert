"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  RadioGroup,
  RadioButton,
} from "@/components/base/radio-buttons/radio-buttons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import type { CreateLocationValues } from "./createLocationSchema";
import { STORE_MODE_OPTIONS } from "./locationStoreMode";

type Props = {
  form: UseFormReturn<CreateLocationValues>;
  isEdit: boolean;
};

export function LocationStoreTypeFields({ form, isEdit }: Props) {
  const storeMode = form.watch("storeMode");

  if (isEdit) {
    return (
      <Checkbox
        label="This store serves as a warehouse"
        isSelected={storeMode === "warehouse"}
        onChange={(selected) =>
          form.setValue("storeMode", selected ? "warehouse" : "regular", {
            shouldValidate: true,
          })
        }
      />
    );
  }

  return (
    <RadioGroup
      label="Store type"
      value={storeMode}
      onChange={(value) =>
        form.setValue("storeMode", value as CreateLocationValues["storeMode"], {
          shouldValidate: true,
        })
      }
    >
      {STORE_MODE_OPTIONS.map((option) => (
        <RadioButton
          key={option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </RadioGroup>
  );
}
