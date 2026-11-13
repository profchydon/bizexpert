import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const AcquisitionActions: FC<FormFieldProps> = ({ form }) => {
  const equipments = [
    {
      id: "rayda",
      label: "Rayda brought",
    },
    {
      id: "external",
      label: "External",
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
                      data-testid="acquisitionactions-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel className="font-medium text-sm">
                  {equipment.label}
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default AcquisitionActions;
