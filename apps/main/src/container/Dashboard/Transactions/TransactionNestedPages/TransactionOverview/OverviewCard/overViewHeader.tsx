import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Props {
  selectedValue: string;
  onHandleChange: (value: string) => void;
}

const OverViewHeader: React.FC<Props> = ({ selectedValue, onHandleChange }) => {
  return (
    <>
      <div className="flex flex-col">
        <p className="text-gray-900 text-lg font-semibold">Payment overview</p>
        <p className="text-sm text-gray-600">
          View your payments by credit, cash or both.
        </p>
      </div>
      <ToggleGroup
        type="single"
        defaultValue={selectedValue}
        value={selectedValue}
        onValueChange={onHandleChange}
        className="w-fit h-auto rounded-lg border-[1px] border-gray-300 flex flex-row gap-0"
      >
        {["12", "30", "7"].map((item, index) => (
          <>
            <ToggleGroupItem
              value={item}
              key={index}
              className={`relative ${selectedValue === item ? "bg-gray-50" : "bg-white"} ${
                index !== 0
                  ? "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:border-l before:border-gray-300"
                  : ""
              }`}
            >
              <p className="text-gray-700 font-semibold">
                {item} {item !== "12" ? "Days" : "Mouths"}
              </p>
            </ToggleGroupItem>
          </>
        ))}
      </ToggleGroup>
    </>
  );
};

export default OverViewHeader;
