import React from "react";
import CreatableSelect from "react-select/creatable";
import {
  ActionMeta,
  OnChangeValue,
  StylesConfig,
  components,
  MultiValue,
  SingleValue,
} from "react-select";
import { OptionProps } from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: Option[];
  onChange: (
    newValue: OnChangeValue<Option, boolean>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  onCreateOption: (inputValue: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  defaultValue?: Option | Option[];
  value?: Option | Option[];
  isDisabled?: boolean;
  isMulti?: boolean;
  loadOptions?: () => Promise<Option[]>;
}

const customStyles: StylesConfig<Option, boolean> = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    color: state.isSelected ? "#fff" : "#000",
    backgroundColor: state.isSelected ? "#4f46e5" : "#fff",
    padding: "10px 15px",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#EAECF0" : "#EAECF0",
    borderRadius: "6px",
    paddingTop: "4px",
    paddingBottom: "4px",
    fontSize: "15px",
    color: "#475467",
    "&:hover": {
      borderColor: "#EAECF0",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "white",
    border: "1px solid #D0D5DD",
    borderRadius: "6px",
    color: "#344054",
    fontSize: "14px",
    fontWeight: "500",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#344054",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "black",
    ":hover": {
      backgroundColor: "white",
      color: "black",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "15px",
    color: "#9CA3AF",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "4px",
  }),
};

const CustomOption = (props: OptionProps<Option, boolean>) => {
  return (
    <components.Option {...props}>
      <div className="flex flex-col">
        <span className="font-semibold">{props.data.label}</span>
        <span className="text-xs text-muted-foreground">
          {props.data.value}
        </span>
      </div>
    </components.Option>
  );
};

const CustomCreatableSelectField: React.FC<SelectFieldProps> = ({
  options,
  onChange,
  onCreateOption,
  placeholder,
  isLoading,
  defaultValue,
  value,
  isDisabled = false,
  isMulti = false,
  loadOptions,
}) => {
  const [internalOptions, setInternalOptions] =
    React.useState<Option[]>(options);

  React.useEffect(() => {
    if (loadOptions) {
      loadOptions().then(setInternalOptions);
    } else {
      setInternalOptions(options);
    }
  }, [loadOptions, options]);

  return (
    <CreatableSelect
      isClearable
      isMulti={isMulti}
      styles={customStyles}
      options={internalOptions}
      isLoading={isLoading}
      value={value || defaultValue}
      onChange={onChange}
      onCreateOption={onCreateOption}
      placeholder={placeholder || "Select or create an option"}
      isDisabled={isDisabled}
      components={{ Option: CustomOption }}
    />
  );
};

export default CustomCreatableSelectField;
