import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface TypeActionsProp {
  setSelectedTypes: (value: string[]) => void;
  selectedTypes: string[];
}
const TypeActions: FC<TypeActionsProp> = ({
  selectedTypes,
  setSelectedTypes,
}) => {
  const items = [
    {
      id: "sale",
      label: "Sale",
    },
    {
      id: "rent",
      label: "Rent",
    },
  ] as const;

  return (
    <>
      {items.map((item) => (
        <FormField
          key={item.id}
          name={"type"}
          render={() => {
            return (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={selectedTypes.includes(item.label)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedTypes([...selectedTypes, item?.label])
                        : setSelectedTypes(
                            selectedTypes.filter(
                              (value) => value !== item?.label,
                            ),
                          );
                    }}
                    data-testid="typeactions-checkbox"
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

export default TypeActions;
