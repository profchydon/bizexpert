import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const EquipmentsActions: FC<FormFieldProps> = ({ form }) => {
  const equipments = [
    {
      id: "computer",
      label: "Computer",
    },
    {
      id: "phone",
      label: "Phone",
    },
    {
      id: "accessories",
      label: "Accessories",
    },
    {
      id: "office",
      label: "Office",
    },
  ] as const;

  return (
    <>
      {equipments.map((equipment) => (
        <FormField
          key={equipment.id}
          control={form.control}
          name={"equipment"}
          render={({ field }) => {
            return (
              <FormItem
                key={equipment.id}
                className="flex flex-row items-center space-x-2 space-y-0 pl-3"
              >
                <FormControl>
                  <div className="pt-1">
                    <Checkbox
                      checked={field.value?.includes(equipment.id)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || [];
                        return checked
                          ? field.onChange([...currentValue, equipment.id])
                          : field.onChange(
                              currentValue.filter(
                                (value: any) => value !== equipment.id,
                              ),
                            );
                      }}
                      data-testid="equipmentactions-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel className="font-normal">{equipment.label}</FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default EquipmentsActions;
