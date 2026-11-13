import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./type";
import { Checkbox } from "@/components/ui/checkbox";

const AssetStateActions: FC<FormFieldProps> = ({ form }) => {
  const items = [
    {
      id: "new",
      label: "Brand Name",
    },
    {
      id: "refurbished",
      label: "Refurbished",
    },
    {
      id: "used",
      label: "Used",
    },
  ] as const;

  return (
    <>
      {items.map((item) => (
        <FormField
          key={item.id}
          control={form.control}
          name={"assets"}
          render={({ field }) => {
            return (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field?.value, item.id])
                        : field.onChange(
                            field?.value?.filter(
                              (value: any) => value !== item.id,
                            ),
                          );
                    }}
                    data-testid="assetstateactions-checkbox"
                  />
                </FormControl>
                <FormLabel className="font-normal">{item.label}</FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default AssetStateActions;
