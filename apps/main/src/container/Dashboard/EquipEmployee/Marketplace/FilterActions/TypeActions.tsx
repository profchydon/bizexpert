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
  options?: Array<{ id: string; name: string }>;
}
const TypeActions: FC<TypeActionsProp> = ({
  selectedTypes,
  setSelectedTypes,
  options,
}) => {
  const handleToggle = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, id]);

      return;
    }

    setSelectedTypes(selectedTypes.filter((value) => value !== id));
  };

  const fallbackItems = [
    { id: "Laptop", name: "Laptop" },
    { id: "Desktop", name: "Desktop" },
    { id: "Smartphone", name: "Smartphone" },
    { id: "Tablet", name: "Tablet" },
    { id: "Display", name: "Display" },
    { id: "Input Device", name: "Input Device" },
    { id: "Audio / Visual", name: "Audio / Visual" },
    { id: "Docking Station", name: "Docking Station" },
    { id: "Network Infrastructure", name: "Network Infrastructure" },
  ] as const;

  const items = options ?? fallbackItems;

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
                className="flex flex-row items-start space-x-3 space-y-0 py-2"
              >
                <FormControl>
                  <Checkbox
                    checked={selectedTypes.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleToggle(Boolean(checked), item.id)
                    }
                    data-testid="typeactions-checkbox"
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium text-gray-700">
                  {item.name}
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default TypeActions;
