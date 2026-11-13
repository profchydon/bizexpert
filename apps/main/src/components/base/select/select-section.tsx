"use client";

import type { ReactNode } from "react";
import type { ListBoxSectionProps as AriaListBoxSectionProps } from "react-aria-components";
import {
  Header as AriaHeader,
  ListBoxSection as AriaListBoxSection,
} from "react-aria-components";
import type { SelectItemType } from "./select";

interface SelectSectionProps extends Omit<
  AriaListBoxSectionProps<SelectItemType>,
  "children"
> {
  header?: string;
  children: ReactNode;
}

export const SelectSection = ({
  header,
  children,
  className,
  ...props
}: SelectSectionProps) => {
  return (
    <AriaListBoxSection
      {...props}
      className={className ?? "border-t border-secondary py-1 first:border-t-0"}
    >
      {header && (
        <AriaHeader className="px-4 py-1 text-xs font-semibold text-brand-700">
          {header}
        </AriaHeader>
      )}
      {children}
    </AriaListBoxSection>
  );
};
