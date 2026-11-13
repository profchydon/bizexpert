import React, { useCallback } from "react";
import { components } from "react-select";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const AutocompleteOption = (props: any) => (
  <components.Option {...props} className="bg-white flex items-center">
    <div className="flex flex-row items-center">
      {props.data.icon && (
        <span className={cn("mr-2", props.isSelected && "text-primary-600")}>
          {props.data.icon}
        </span>
      )}
      <span className="font-medium text-gray-900 text-base">
        {props.children}
      </span>
    </div>
    {props.isSelected && <Check className="text-primary-600" />}
  </components.Option>
);

export const AutocompleteSingleValue = ({
  isMulti,
  isMenuOpen,
  ...props
}: any) => {
  if (!isMulti && isMenuOpen) {
    return null;
  }

  return (
    <components.SingleValue {...props}>
      <span className="flex min-w-0 items-center gap-2">
        {props.data.icon && <span className="shrink-0">{props.data.icon}</span>}
        <span className="truncate">{props.children}</span>
      </span>
    </components.SingleValue>
  );
};

export const createAutocompletePlaceholder = ({
  placeholder,
  placeholderIcon,
  isMenuOpen,
}: {
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
  isMenuOpen: boolean;
}) =>
  function AutocompletePlaceholder(props: any) {
    const selectedValues = props.getValue?.();
    const hasValue = Array.isArray(selectedValues)
      ? selectedValues.length > 0
      : Boolean(selectedValues);

    return !hasValue && !isMenuOpen ? (
      <components.Placeholder {...props}>
        <div className="flex items-center gap-2">
          {placeholderIcon && <span>{placeholderIcon}</span>}
          {placeholder}
        </div>
      </components.Placeholder>
    ) : null;
  };
