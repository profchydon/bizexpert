import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import React, { FC } from "react";

export interface OsActionsProp {
  selectedOs: string[];
  setSelectedOs: (value: string[]) => void;
  options?: string[];
}

const fallbackItems = [
  {
    id: "Windows Home",
    label: "Windows Home",
  },
  {
    id: "Windows Pro",
    label: "Windows Pro",
  },
  {
    id: "MAC OS",
    label: "MAC OS",
  },
] as const;

const OsActions: FC<OsActionsProp> = ({
  selectedOs,
  setSelectedOs,
  options,
}) => {
  const items =
    options === undefined
      ? fallbackItems
      : options.map((item) => ({ id: item, label: item }));

  const handleToggle = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedOs([...selectedOs, id]);

      return;
    }

    setSelectedOs(selectedOs.filter((value) => value !== id));
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
                    checked={selectedOs.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleToggle(Boolean(checked), item.id)
                    }
                    data-testid="osactions-checkbox"
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

export default OsActions;
