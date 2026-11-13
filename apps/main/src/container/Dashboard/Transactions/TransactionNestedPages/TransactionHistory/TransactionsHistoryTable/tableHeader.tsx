import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Separator } from "@/components/ui/separator";

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
}

const TableHeader: React.FC<Props> = ({ selectedValue, onHandleChange }) => {
  return (
    <>
      <div className="flex flex-col p-4">
        <p className="text-gray-900 text-lg font-semibold">
          Transaction history
        </p>
        <p className="text-sm text-gray-600">View your transation history.</p>
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-between p-4">
        <ToggleGroup
          type="single"
          defaultValue={selectedValue}
          value={selectedValue}
          onValueChange={onHandleChange}
          className="w-fit h-auto rounded-lg border-[1px] border-gray-300 flex flex-row gap-0"
        >
          {["all", "Credit", "Cash"].map((item, index) => (
            <React.Fragment key={item}>
              <ToggleGroupItem
                value={item}
                className={`relative ${selectedValue === item ? "bg-gray-50" : "bg-white"} ${
                  index !== 0
                    ? "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:border-l before:border-gray-300"
                    : ""
                }`}
              >
                <p className="text-gray-700 font-semibold">
                  {capitalizeFirstLetter(item)}
                </p>
              </ToggleGroupItem>
              {/* <Separator orientation="vertical" /> */}
            </React.Fragment>
          ))}
        </ToggleGroup>
        <SearchWithIcon />
      </div>
    </>
  );
};

export default TableHeader;
