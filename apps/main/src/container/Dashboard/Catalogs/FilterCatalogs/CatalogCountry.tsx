import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { PT, UK, US, ZA, MY, UY } from "@/assets/icons";
import Image from "next/image";

const CatalogCountry: FC<FormFieldProps> = ({ form }) => {
  const countries = [
    {
      id: "malaysia",
      label: "Malaysia",
      image: MY,
    },

    {
      id: "portugal",
      label: "Portugal",
      image: PT,
    },

    {
      id: "south africa",
      label: "South Africa",
      image: ZA,
    },
    {
      id: "united kingdom of great britain",
      label: "United Kingdom of Great Britain",
      image: UK,
    },
    {
      id: "united states of america",
      label: "United States of America",
      image: US,
    },
    {
      id: "uruguay",
      label: "Uruguay",
      image: UY,
    },
  ] as const;

  return (
    <>
      {countries.map((country) => (
        <FormField
          key={country.id}
          control={form.control}
          name={"country"}
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
                      data-testid="catalogcountry-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel>
                  <div className=" rounded-lg border flex flex-row p-1 gap-x-1.5 font-normal">
                    <Image src={country.image} alt="country-flag" />
                    {country.label}
                  </div>
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default CatalogCountry;
