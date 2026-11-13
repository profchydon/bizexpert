import type { TabRenderProps as AriaTabRenderProps } from "react-aria-components";
import { cx } from "@/utils/cx";

export type HorizontalTabType =
  | "button-brand"
  | "button-gray"
  | "button-border"
  | "button-minimal"
  | "underline";

export type VerticalTabType =
  | "button-brand"
  | "button-gray"
  | "button-border"
  | "button-minimal"
  | "line";

export type TabVisualType = HorizontalTabType | VerticalTabType;

export const tabSizes = {
  sm: {
    "button-brand": "text-sm font-semibold py-2 px-3",
    "button-gray": "text-sm font-semibold py-2 px-3",
    "button-border": "text-sm font-semibold py-2 px-3",
    "button-minimal": "text-sm font-semibold py-2 px-3",
    underline: "text-sm font-semibold px-1 pb-2.5 pt-0",
    line: "text-sm font-semibold pl-2.5 pr-3 py-0.5",
  },
  md: {
    "button-brand": "text-md font-semibold py-2.5 px-3",
    "button-gray": "text-md font-semibold py-2.5 px-3",
    "button-border": "text-md font-semibold py-2.5 px-3",
    "button-minimal": "text-md font-semibold py-2.5 px-3",
    underline: "text-md font-semibold px-1 pb-2.5 pt-0",
    line: "text-md font-semibold pr-3.5 pl-3 py-1",
  },
} as const;

export const getTabStyles = ({
  isFocusVisible,
  isSelected,
  isHovered,
}: AriaTabRenderProps) => ({
  "button-brand": cx(
    "outline-focus-ring",
    isFocusVisible && "outline-2 -outline-offset-2",
    (isSelected || isHovered) && "bg-brand-primary_alt text-brand-secondary",
  ),
  "button-gray": cx(
    "outline-focus-ring",
    isHovered && "bg-primary_hover text-secondary",
    isFocusVisible && "outline-2 -outline-offset-2",
    isSelected && "bg-primary_hover text-secondary",
  ),
  "button-border": cx(
    "outline-focus-ring",
    (isSelected || isHovered) && "bg-primary_alt text-secondary shadow-sm",
    isFocusVisible && "outline-2 -outline-offset-2",
  ),
  "button-minimal": cx(
    "rounded-lg outline-focus-ring",
    isHovered && "text-secondary",
    isFocusVisible && "outline-2 -outline-offset-2",
    isSelected &&
      "bg-primary_alt text-secondary shadow-xs ring-1 ring-primary ring-inset",
  ),
  underline: cx(
    "rounded-none border-b-2 border-transparent outline-focus-ring",
    (isSelected || isHovered) &&
      "border-fg-brand-primary_alt text-brand-secondary",
    isFocusVisible && "outline-2 -outline-offset-2",
  ),
  line: cx(
    "rounded-none border-l-2 border-transparent outline-focus-ring",
    (isSelected || isHovered) &&
      "border-fg-brand-primary_alt text-brand-secondary",
    isFocusVisible && "outline-2 -outline-offset-2",
  ),
});

export const getHorizontalStyles = ({
  size,
  fullWidth,
}: {
  size?: keyof typeof tabSizes;
  fullWidth?: boolean;
}) => ({
  "button-brand": "gap-1",
  "button-gray": "gap-1",
  "button-border": cx(
    "gap-1 rounded-[10px] bg-secondary_alt p-1 ring-1 ring-secondary ring-inset",
    size === "md" && "rounded-xl p-1.5",
  ),
  "button-minimal":
    "gap-0.5 rounded-lg bg-secondary_alt ring-1 ring-inset ring-secondary",
  underline: cx("gap-3", fullWidth && "w-full gap-4"),
  line: "gap-2",
});

export const getTabBadgeColor = (
  { isSelected, isHovered }: Partial<AriaTabRenderProps>,
  type: TabVisualType,
) => {
  if (type === "button-brand") {
    return isSelected || isHovered ? "brand" : "gray";
  }
  if (type === "button-border") {
    return isSelected ? "brand" : "gray";
  }
  if (type === "underline" || type === "line") {
    return isSelected || isHovered ? "brand" : "gray";
  }
  return "gray";
};
