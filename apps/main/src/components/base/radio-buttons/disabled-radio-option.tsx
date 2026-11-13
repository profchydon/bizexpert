"use client";

import type { ReactNode } from "react";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { RadioButtonBase } from "./radio-buttons";

interface DisabledRadioOptionProps {
  tooltip: string;
  label: ReactNode;
  hint?: ReactNode;
  size?: "sm" | "md";
}

export function DisabledRadioOption({
  tooltip,
  label,
  hint,
  size = "sm",
}: DisabledRadioOptionProps) {
  const sizes = {
    sm: {
      root: "gap-2",
      textWrapper: "",
      label: "text-sm font-medium",
      hint: "text-sm",
    },
    md: {
      root: "gap-3",
      textWrapper: "gap-0.5",
      label: "text-md font-medium",
      hint: "text-md",
    },
  };

  return (
    <Tooltip title={tooltip}>
      <TooltipTrigger
        className={`flex w-full items-start border-0 bg-transparent p-0 text-left outline-hidden ${sizes[size].root} cursor-not-allowed`}
        onPress={() => undefined}
      >
        <RadioButtonBase
          size={size}
          isDisabled
          isSelected={false}
          className={label || hint ? "mt-0.5" : ""}
        />
        {(label || hint) && (
          <div className={`inline-flex flex-col ${sizes[size].textWrapper}`}>
            {label ? (
              <p className={`select-none text-secondary ${sizes[size].label}`}>
                {label}
              </p>
            ) : null}
            {hint ? (
              <span className={`text-tertiary ${sizes[size].hint}`}>
                {hint}
              </span>
            ) : null}
          </div>
        )}
      </TooltipTrigger>
    </Tooltip>
  );
}
