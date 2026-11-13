import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface DynamicFilterOptionsProps {
  options: string[];
  selectedValues: string[];
  setSelectedValues: (value: string[]) => void;
  testId?: string;
}

const DynamicFilterOptions: React.FC<DynamicFilterOptionsProps> = ({
  options,
  selectedValues,
  setSelectedValues,
  testId,
}) => {
  const handleToggle = (checked: boolean, value: string) => {
    if (checked) {
      setSelectedValues([...selectedValues, value]);
      return;
    }

    setSelectedValues(selectedValues.filter((item) => item !== value));
  };

  return (
    <>
      {options.map((option) => (
        <FormField
          key={option}
          name="type"
          render={() => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) =>
                    handleToggle(Boolean(checked), option)
                  }
                  data-testid="dynamicfilteroptions-checkbox"
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-gray-700">
                {option}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export default DynamicFilterOptions;
