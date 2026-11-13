import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const CatalogDepartment: FC<FormFieldProps> = ({ form }) => {
  const departments = [
    {
      id: "design department",
      label: "Design Department",
    },
    {
      id: "hr department",
      label: "Hr Department",
    },
    {
      id: "operations department",
      label: "Operations Department",
    },
    {
      id: "market department",
      label: "Market Department",
    },
    {
      id: "sales department",
      label: "Sales Department",
    },
  ] as const;

  return (
    <>
      {departments.map((department) => (
        <FormField
          key={department.id}
          control={form.control}
          name={"department"}
          render={({ field }: { field: any }) => {
            return (
              <FormItem
                key={department.id}
                className="flex flex-row items-center space-x-2 space-y-0 pl-3"
              >
                <FormControl>
                  <div className="pt-1">
                    <Checkbox
                      checked={field.value?.includes(department.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([
                              ...(field?.value || []),
                              department.id,
                            ])
                          : field.onChange(
                              field?.value?.filter(
                                (value: any) => value !== department.id,
                              ),
                            );
                      }}
                      data-testid="catalogdepartment-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel className="font-normal">
                  {department.label}
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default CatalogDepartment;
