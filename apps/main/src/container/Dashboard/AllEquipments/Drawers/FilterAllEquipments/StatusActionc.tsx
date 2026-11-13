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

const StatusActions: FC<FormFieldProps> = ({ form }) => {
  const equipments = [
    {
      id: "active",
      label: "Active",
    },
    {
      id: "leased",
      label: "Leased",
    },
    {
      id: "in transit",
      label: "In transit",
    },
    {
      id: "on hold",
      label: "On hold",
    },
  ] as const;

  return (
    <>
      {equipments.map((equipment) => (
        <FormField
          key={equipment.id}
          control={form.control}
          name={"status"}
          render={({ field }: { field: any }) => {
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
                        return checked
                          ? field.onChange([...field?.value, equipment.id])
                          : field.onChange(
                              field?.value?.filter(
                                (value: any) => value !== equipment.id,
                              ),
                            );
                      }}
                      data-testid="statusactionc-checkbox"
                    />
                  </div>
                </FormControl>
                {equipment.label === "Active" ? (
                  <div className="w-fit">
                    <Badge className="w-fit text-success-700" variant="success">
                      Active
                    </Badge>
                  </div>
                ) : equipment.label === "Leased" ? (
                  <div className="w-fit">
                    <Badge className="w-fit bg-primary-50 text-primary-700">
                      Leased
                    </Badge>
                  </div>
                ) : equipment.label === "In transit" ? (
                  <div className="w-fit">
                    <Badge className="w-fit bg-purple-50 text-purple-700">
                      In transit
                    </Badge>
                  </div>
                ) : equipment.label === "On hold" ? (
                  <div className="w-fit">
                    <Badge className="w-fit bg-warning-50 text-warning-700">
                      On hold
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

export default StatusActions;
