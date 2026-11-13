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
}

const items = [
  {
    id: "4GB",
    label: "4GB",
  },
  {
    id: "8GB",
    label: "8GB",
  },
  {
    id: "16GB",
    label: "16GB",
  },
  {
    id: "32GB",
    label: "32GB",
  },
] as const;

const MemoryActions: FC<MemoryActionsProp> = ({
  selectedMemory,
  setSelectedMemory,
}) => {
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
                    checked={selectedMemory.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedMemory([...selectedMemory, item?.id])
                        : setSelectedMemory(
                            selectedMemory.filter(
                              (value) => value !== item?.id,
                            ),
                          );
                    }}
                    data-testid="memoryactions-checkbox"
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

export default MemoryActions;
