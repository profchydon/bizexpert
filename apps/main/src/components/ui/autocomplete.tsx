import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Select, { MultiValue, SingleValue } from "react-select";

import {
  AutocompleteOption,
  AutocompleteSingleValue,
  createAutocompletePlaceholder,
} from "./autocompleteComponents";
import { normalizeMultiSelectValue } from "./autocompleteMultiValue";
import { createAutocompleteStyles } from "./autocompleteStyles";

const ReactSelect = Select;

export type MultiSelectValue = MultiValue<{
  value: string;
  label: string;
  icon?: React.ReactNode;
}>;

export type SingleSelectValue = SingleValue<{
  value: string;
  label: string;
  icon?: React.ReactNode;
}>;

interface Props {
  setSelectedOption: (data: MultiSelectValue | SingleSelectValue) => void;
  selectedOption: MultiSelectValue | SingleSelectValue;
  options: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
  className?: string;
  externalKey?: string;
  portalInBody?: boolean;
  isDisabled?: boolean;
  size?: "default" | "sm" | "md";
  "data-testid"?: string;
}

const Autocomplete: React.FC<Props> = ({
  selectedOption,
  setSelectedOption,
  options,
  isMulti = false,
  isSearchable,
  isClearable,
  placeholder,
  placeholderIcon,
  className,
  externalKey,
  portalInBody = true,
  isDisabled,
  size = "default",
  ...restProps
}) => {
  const [internalKey, setInternalKey] = useState<string>(
    externalKey || "default",
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (externalKey) {
      setInternalKey(externalKey);
    }
  }, [externalKey]);

  const customStyles = useMemo(
    () => createAutocompleteStyles({ isMulti, isMenuOpen, size }),
    [isMulti, isMenuOpen, size],
  );

  const normalizedValue = useMemo(() => {
    if (!isMulti) {
      return selectedOption;
    }

    return normalizeMultiSelectValue(
      (selectedOption as MultiSelectValue) ?? [],
      options,
    );
  }, [isMulti, options, selectedOption]);

  const CustomPlaceholder = useCallback(
    createAutocompletePlaceholder({
      placeholder,
      placeholderIcon,
      isMenuOpen,
    }),
    [placeholder, placeholderIcon, isMenuOpen],
  );

  return (
    <div data-testid={restProps["data-testid"]}>
      <ReactSelect
        ref={selectRef}
        key={internalKey}
        className={className}
        closeMenuOnSelect={!isMulti}
        value={normalizedValue}
        onChange={(value) => {
          if (isMulti) {
            setSelectedOption(
              normalizeMultiSelectValue(value as MultiSelectValue, options),
            );
            setInputValue("");
            return;
          }

          setSelectedOption(value as SingleSelectValue);
          setInputValue("");
        }}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => {
          setIsMenuOpen(false);
          setInputValue("");
        }}
        onInputChange={(value, { action }) => {
          if (action === "input-change") {
            setInputValue(value);
            return;
          }

          if (action === "set-value" || action === "menu-close") {
            setInputValue("");
          }
        }}
        components={{
          Option: AutocompleteOption,
          SingleValue: (props) => (
            <AutocompleteSingleValue
              {...props}
              isMulti={isMulti}
              isMenuOpen={isMenuOpen}
              selectProps={{ ...props.selectProps, inputValue }}
            />
          ),
          Placeholder: CustomPlaceholder,
        }}
        defaultValue={null}
        isMulti={isMulti}
        inputValue={!isMulti && !isMenuOpen ? "" : inputValue}
        options={options}
        styles={customStyles}
        menuPosition={portalInBody ? "fixed" : "absolute"}
        menuPortalTarget={portalInBody ? globalThis.document?.body : undefined}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={isDisabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Autocomplete;
