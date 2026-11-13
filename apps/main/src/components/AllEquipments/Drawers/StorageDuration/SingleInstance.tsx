import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { FC } from "react";

interface Props {
  setStorageDuration: (value: string) => void;
}
const SingleInstance: FC<Props> = ({ setStorageDuration }) => {
  return (
    <div className="space-y-5 mt-5 lg-1:mt-6 px-0">
      <div className="flex flex-col gap-2">
        <Label>Storage duration</Label>
        <Select
          onValueChange={(value) => setStorageDuration(value)}
          data-testid="singleinstance-select"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the storage duration" />
          </SelectTrigger>

          <SelectContent className="z-[210]">
            {["1", "3", "6", "12"].map((value) => (
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
