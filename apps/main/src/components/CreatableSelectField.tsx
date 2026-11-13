import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, OnChangeValue, StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: Option[];
  onChange: (
    newValue: OnChangeValue<Option, false>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  onCreateOption: (inputValue: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  defaultValue?: Option;
  isDisabled?: boolean;
}

const customStyles: StylesConfig<Option, false> = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
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
  menu: (provided) => ({
    ...provided,
    borderRadius: "4px",
  }),
};

const CreatableSelectField: React.FC<SelectFieldProps> = ({
  options,
  onChange,
  onCreateOption,
  placeholder,
  isLoading,
  defaultValue,
  isDisabled = false,
}) => {
  return (
    <CreatableSelect
      isClearable
      styles={customStyles}
      options={options}
      isLoading={isLoading}
      value={defaultValue}
      onChange={onChange}
      onCreateOption={onCreateOption}
      placeholder={placeholder || "Select or create an option"}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
    />
  );
};

export default CreatableSelectField;
