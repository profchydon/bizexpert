import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface StorageActionsProp {
  setSelectedStorage: (value: string[]) => void;
  selectedStorage: string[];
}

const items = [
  {
    id: "128GB SSD",
    label: "128GB SSD",
  },
  {
    id: "256GB SSD",
    label: "256GB SSD",
  },
  {
    id: "512GB SSD",
    label: "512GB SSD",
  },
  {
    id: "1TB SSD",
    label: "1TB SSD",
  },
] as const;

const StorageActions: FC<StorageActionsProp> = ({
  selectedStorage,
  setSelectedStorage,
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
                    checked={selectedStorage.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedStorage([...selectedStorage, item?.id])
                        : setSelectedStorage(
                            selectedStorage.filter(
                              (value) => value !== item?.id,
                            ),
                          );
                    }}
                    data-testid="storageactions-checkbox"
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

export default StorageActions;
