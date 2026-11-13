import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DISPOSITION_OPTIONS, type Disposition } from "./offboardPricing";
import CustomTooltip from "@/components/CustomTooltip";

interface Props {
  value: Disposition;
  onChange: (value: Disposition) => void;
}

const DispositionToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as Disposition);
      }}
      className="h-auto w-fit gap-0 rounded-lg border border-gray-300"
    >
      {DISPOSITION_OPTIONS.map((option, index) => {
        const item = (
          <ToggleGroupItem
            value={option.value}
            disabled={option.disabled}
            className={`relative px-3 py-1.5 text-sm font-semibold text-gray-700 data-[state=on]:bg-gray-100 ${
              index === 0
                ? ""
                : "before:absolute before:inset-y-0 before:left-0 before:border-l before:border-gray-300 before:content-['']"
            } ${option.disabled ? "pointer-events-none" : ""}`}
          >
            {option.label}
          </ToggleGroupItem>
        );

        if (option.disabled) {
          return (
            <CustomTooltip key={option.value} content="Coming soon">
              <div className="cursor-not-allowed">{item}</div>
            </CustomTooltip>
          );
        }

        return <React.Fragment key={option.value}>{item}</React.Fragment>;
      })}
    </ToggleGroup>
  );
};

export default DispositionToggle;
