import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { FormFieldProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const EmployeesTeam: FC<FormFieldProps> = ({ form }) => {
  const teams = [
    {
      id: "approved",
      label: "Approved",
    },
    {
      id: "pending",
      label: "Pending",
    },
    {
      id: "rejected",
      label: "Rejected",
    },
  ] as const;

  return (
    <>
      {teams.map((team) => (
        <FormField
          key={team.id}
          control={form.control}
          name={"level"}
          render={({ field }: { field: any }) => {
            return (
              <FormItem
                key={team.id}
                className="flex flex-row items-center space-x-2 space-y-0 pl-3"
              >
                <FormControl>
                  <div className="pt-1">
                    <Checkbox
                      checked={field.value?.includes(team.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field?.value || []), team.id])
                          : field.onChange(
                              field?.value?.filter(
                                (value: any) => value !== team.id,
                              ),
                            );
                      }}
                      data-testid="employeeteams-checkbox"
                    />
                  </div>
                </FormControl>
                <FormLabel
                  className={`font-medium text-sm px-2 py-1  ${
                    team.id === "approved"
                      ? "bg-success-50 text-success-700"
                      : team.id === "pending"
                        ? "bg-warning-50 text-warning-700"
                        : "bg-error-50 text-error-700"
                  }`}
                >
                  {team.label}
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default EmployeesTeam;
