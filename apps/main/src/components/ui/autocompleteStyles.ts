import { StylesConfig } from "react-select";

import {
  resolveAutocompleteControlLayout,
  resolveAutocompleteMultiValueLabelLayout,
  resolveAutocompleteMultiValueLayout,
  resolveAutocompleteMultiValueRemoveLayout,
  resolveAutocompleteValueContainerLayout,
  AutocompleteSize,
} from "./autocompleteLayoutStyles";

export const createAutocompleteStyles = ({
  isMulti,
  isMenuOpen,
  size,
}: {
  isMulti: boolean;
  isMenuOpen: boolean;
  size: AutocompleteSize;
}): StylesConfig => ({
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  control: (provided) => ({
    ...resolveAutocompleteControlLayout(isMulti, size, provided),
    borderColor: "#EAECF0",
    borderRadius: "6px",
    paddingTop: size === "sm" || size === "md" ? 0 : "4px",
    paddingBottom: size === "sm" || size === "md" ? 0 : "4px",
    fontSize: "15px",
    color: "#475467",
    "&:hover": {
      borderColor: "#EAECF0",
    },
  }),
  valueContainer: (provided) =>
    resolveAutocompleteValueContainerLayout(isMulti, provided),
  singleValue: (provided) => ({
    ...provided,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
    ...(!isMulti && !isMenuOpen
      ? {
          opacity: 0,
          width: 0,
          minWidth: 0,
        }
      : {}),
  }),
  multiValue: (provided) => ({
    ...resolveAutocompleteMultiValueLayout(provided),
    backgroundColor: "white",
    border: "1px solid #D0D5DD",
    borderRadius: "6px",
    color: "#344054",
    fontSize: "14px",
    fontWeight: "500",
  }),
  multiValueLabel: (provided) => ({
    ...resolveAutocompleteMultiValueLabelLayout(provided),
    color: "#344054",
  }),
  multiValueRemove: (provided) => ({
    ...resolveAutocompleteMultiValueRemoveLayout(provided),
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
  menu: (provided) => ({
    ...provided,
    zIndex: 1100,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 1100,
  }),
});
