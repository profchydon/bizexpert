import React, { FC } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SingleInstanceProps {
  setStorageDuration: (value: string) => void;
  defaultValue?: string;
  showLabel?: boolean;
  durationOptions?: string[];
}

const SingleInstance: FC<SingleInstanceProps> = ({
  setStorageDuration,
  defaultValue,
  showLabel = true,
  durationOptions = ["1", "3", "6", "12"],
}) => {
  return (
    <div className="space-y-5 mt-4 px-0">
      <div className="flex flex-col gap-2">
        {showLabel && <Label>Storage duration</Label>}
        <Select
          onValueChange={(value) => setStorageDuration(value)}
          defaultValue={defaultValue}
          data-testid="singleinstance-select"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the storage duration" />
          </SelectTrigger>

          <SelectContent className="z-[210]">
            {durationOptions.map((value) => (
              <SelectItem value={value} key={value}>
                {`${value} months`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SingleInstance;
