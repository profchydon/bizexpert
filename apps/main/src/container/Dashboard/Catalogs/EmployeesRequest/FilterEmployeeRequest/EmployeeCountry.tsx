import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const EmployeesCountry: FC<FormFieldProps> = ({ form }) => {
  const countries = [
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
  ] as const;

  return (
    <>
      {countries.map((country) => (
        <FormField
          key={country.id}
          control={form.control}
          name={"department"}
          render={({ field }: { field: any }) => {
            return (
              <FormItem
                key={country.id}
                className="flex flex-row items-center space-x-2 space-y-0 pl-3"
              >
                <FormControl>
                  <div className="pt-1">
                    <Checkbox
                      checked={field.value?.includes(country.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([
                              ...(field?.value || []),
                              country.id,
                            ])
                          : field.onChange(
                              field?.value?.filter(
                                (value: any) => value !== country.id,
                              ),
                            );
                      }}
                      data-testid="employeecountry-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel className="font-normal">{country.label}</FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default EmployeesCountry;
