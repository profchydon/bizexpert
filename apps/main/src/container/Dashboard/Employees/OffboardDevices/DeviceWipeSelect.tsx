import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getWipeOptions,
  type Disposition,
  type WipeType,
} from "./offboardPricing";

interface Props {
  value: WipeType;
  disposition: Disposition;
  onChange: (value: WipeType) => void;
}

const DeviceWipeSelect: React.FC<Props> = ({
  value,
  disposition,
  onChange,
}) => {
  const options = getWipeOptions(disposition);

  if (options.length <= 1) {
    return (
      <div
        className="flex h-10 w-[200px] cursor-not-allowed items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700"
        aria-disabled="true"
        data-testid="devicewipeselect-locked"
      >
        <span className="truncate">{options[0]?.label ?? value}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as WipeType)}
      data-testid="devicewipeselect-select"
    >
      <SelectTrigger className="h-10 w-[200px] text-sm font-medium text-gray-700">
        <SelectValue placeholder="Select wipe" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DeviceWipeSelect;
