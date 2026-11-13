import type { CSSObjectWithLabel } from "react-select";

export type AutocompleteSize = "default" | "sm" | "md";

export const resolveAutocompleteControlLayout = (
  isMulti: boolean,
  size: AutocompleteSize,
  provided: CSSObjectWithLabel,
): CSSObjectWithLabel => ({
  ...provided,
  minHeight: isMulti
    ? "44px"
    : size === "sm"
      ? "36px"
      : size === "md"
        ? "44px"
        : provided.minHeight,
  height: isMulti
    ? "auto"
    : size === "sm"
      ? "36px"
      : size === "md"
        ? "44px"
        : undefined,
  ...(isMulti
    ? {
        maxHeight: "120px",
        overflowY: "auto",
      }
    : {}),
});

export const resolveAutocompleteValueContainerLayout = (
  isMulti: boolean,
  provided: CSSObjectWithLabel,
): CSSObjectWithLabel => ({
  ...provided,
  flexWrap: isMulti ? "wrap" : "nowrap",
  overflow: isMulti ? "visible" : "hidden",
  alignItems: isMulti ? "center" : provided.alignItems,
  ...(isMulti
    ? {
        gap: "4px",
        padding: "2px 8px",
      }
    : {}),
});

export const resolveAutocompleteMultiValueLayout = (
  provided: CSSObjectWithLabel,
): CSSObjectWithLabel => ({
  ...provided,
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  flexWrap: "nowrap",
  margin: "2px 0",
  maxWidth: "100%",
});

export const resolveAutocompleteMultiValueLabelLayout = (
  provided: CSSObjectWithLabel,
): CSSObjectWithLabel => ({
  ...provided,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "180px",
  flexShrink: 0,
  paddingLeft: "6px",
  paddingRight: "2px",
});

export const resolveAutocompleteMultiValueRemoveLayout = (
  provided: CSSObjectWithLabel,
): CSSObjectWithLabel => ({
  ...provided,
  flexShrink: 0,
  paddingLeft: "4px",
  paddingRight: "4px",
});
