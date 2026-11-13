import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const CatalogLevel: FC<FormFieldProps> = ({ form }) => {
  const levels = [
    {
      id: "junior",
      label: "Junior",
    },
    {
      id: "lead",
      label: "Lead",
    },
    {
      id: "manager",
      label: "Manager",
    },
    {
      id: "mid-level",
      label: "Mid-Level",
    },
    {
      id: "staff",
      label: "Staff",
    },
  ] as const;

  return (
    <>
      {levels.map((level) => (
        <FormField
          key={level.id}
          control={form.control}
          name={"level"}
          render={({ field }: { field: any }) => {
            return (
              <FormItem
                key={level.id}
                className="flex flex-row items-center space-x-2 space-y-0 pl-3"
              >
                <FormControl>
                  <div className="pt-1">
                    <Checkbox
                      checked={field.value?.includes(level.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field?.value || []), level.id])
                          : field.onChange(
                              field?.value?.filter(
                                (value: any) => value !== level.id,
                              ),
                            );
                      }}
                      data-testid="cataloglevel-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel className="font-normal">{level.label}</FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default CatalogLevel;
