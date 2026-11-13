import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const CatalogType: FC<FormFieldProps> = ({ form }) => {
  const types = [
    {
      id: "active",
      label: "Active",
    },
    {
      id: "Expired",
      label: "Expired",
    },
  ] as const;

  return (
    <>
      {types.map((type) => (
        <FormField
          key={type.id}
          control={form.control}
          name={"type"}
          render={({ field }: { field: any }) => {
            return (
              <FormItem
                key={type.id}
                className="flex flex-row items-center space-x-2 space-y-0 pl-3"
              >
                <FormControl>
                  <div className="pt-1">
                    <Checkbox
                      checked={field.value?.includes(type.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field?.value || []), type.id])
                          : field.onChange(
                              field?.value?.filter(
                                (value: any) => value !== type.id,
                              ),
                            );
                      }}
                      data-testid="catalogtype-checkbox"
                    />
                  </div>
                </FormControl>
                {type.label === "Active" ? (
                  <div className="w-fit">
                    <Badge className="w-fit text-success-700" variant="success">
                      Active
                    </Badge>
                  </div>
                ) : type.label === "Expired" ? (
                  <div className="w-fit">
                    <Badge className="w-fit bg-gray-200 text-gray-700">
                      Expired
                    </Badge>
                  </div>
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default CatalogType;
