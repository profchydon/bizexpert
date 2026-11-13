import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface MemoryActionsProp {
  setSelectedMemory: (value: string[]) => void;
  selectedMemory: string[];
  options?: string[];
}

const fallbackItems = [
  {
    id: "8GB",
    label: "8GB",
  },
  {
    id: "16GB",
    label: "16GB",
  },
] as const;

const MemoryActions: FC<MemoryActionsProp> = ({
  selectedMemory,
  setSelectedMemory,
  options,
}) => {
  const items =
    options === undefined
      ? fallbackItems
      : options.map((item) => ({ id: item, label: item }));

  const handleToggle = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedMemory([...selectedMemory, id]);

      return;
    }

    setSelectedMemory(selectedMemory.filter((value) => value !== id));
  };

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
                    checked={selectedMemory.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleToggle(Boolean(checked), item.id)
                    }
                    data-testid="memoryactions-checkbox"
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium text-gray-700">
                  {item.label}
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default MemoryActions;
