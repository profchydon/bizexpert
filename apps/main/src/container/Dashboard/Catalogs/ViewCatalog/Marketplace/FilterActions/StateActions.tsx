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
}

const items = [
  {
    id: "New",
    label: "New",
  },
  {
    id: "Used",
    label: "Used",
  },
] as const;

const StateActions: FC<StateActionsProp> = ({
  selectedState,
  setSelectedState,
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
                    checked={selectedState.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedState([...selectedState, item?.id])
                        : setSelectedState(
                            selectedState.filter((value) => value !== item?.id),
                          );
                    }}
                    data-testid="stateactions-checkbox"
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

export default StateActions;
