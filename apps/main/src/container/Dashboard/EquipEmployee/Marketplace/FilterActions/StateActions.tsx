import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface StateActionsProp {
  setSelectedState: (value: string[]) => void;
  selectedState: string[];
  options?: string[];
}

const fallbackItems = [
  {
    id: "Brand New",
    label: "Brand New",
  },
  {
    id: "Refurbished",
    label: "Refurbished",
  },
  {
    id: "Used",
    label: "Used",
  },
] as const;

const StateActions: FC<StateActionsProp> = ({
  selectedState,
  setSelectedState,
  options,
}) => {
  const items =
    options === undefined
      ? fallbackItems
      : options.map((item) => ({ id: item, label: item }));

  const handleToggle = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedState([...selectedState, id]);

      return;
    }

    setSelectedState(selectedState.filter((value) => value !== id));
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
                    checked={selectedState.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleToggle(Boolean(checked), item.id)
                    }
                    data-testid="stateactions-checkbox"
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

export default StateActions;
