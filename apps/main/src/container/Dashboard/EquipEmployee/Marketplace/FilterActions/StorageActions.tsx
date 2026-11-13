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
  options?: string[];
}

const fallbackItems = [
  {
    id: "256GB",
    label: "256GB",
  },
  {
    id: "512GB",
    label: "512GB",
  },
  {
    id: "1024GB",
    label: "1024GB",
  },
] as const;

const StorageActions: FC<StorageActionsProp> = ({
  selectedStorage,
  setSelectedStorage,
  options,
}) => {
  const items =
    options === undefined
      ? fallbackItems
      : options.map((item) => ({ id: item, label: item }));

  const handleToggle = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedStorage([...selectedStorage, id]);

      return;
    }

    setSelectedStorage(selectedStorage.filter((value) => value !== id));
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
                    checked={selectedStorage.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleToggle(Boolean(checked), item.id)
                    }
                    data-testid="storageactions-checkbox"
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

export default StorageActions;
