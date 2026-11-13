"use client";

import type { ComponentPropsWithRef, ThHTMLAttributes } from "react";
import { useContext } from "react";
import {
  ArrowDown,
  ChevronSelectorVertical,
  HelpCircle,
} from "@untitledui/icons";
import type {
  ColumnProps as AriaColumnProps,
  TableHeaderProps as AriaTableHeaderProps,
} from "react-aria-components";
import {
  Collection as AriaCollection,
  Column as AriaColumn,
  Group as AriaGroup,
  TableHeader as AriaTableHeader,
  useTableOptions,
} from "react-aria-components";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { useTableSize } from "./table-context";

export type TableHeadProps = AriaColumnProps &
  Omit<
    ThHTMLAttributes<HTMLTableCellElement>,
    "children" | "className" | "style" | "id"
  > & {
    label?: string;
    tooltip?: string;
    align?: "left" | "right";
  };

export const TableHeader = <T extends object>({
  columns,
  children,
  bordered = true,
  className,
  ...props
}: AriaTableHeaderProps<T> &
  Omit<
    ComponentPropsWithRef<"thead">,
    "children" | "className" | "slot" | "style"
  > & {
    bordered?: boolean;
  }) => {
  const { size } = useTableSize();
  const { selectionBehavior, selectionMode } = useTableOptions();

  return (
    <AriaTableHeader
      {...props}
      className={(state) =>
        cx(
          "relative bg-secondary",
          size === "sm" ? "h-9" : "h-11",
          bordered &&
            "[&>tr>th]:after:pointer-events-none [&>tr>th]:after:absolute [&>tr>th]:after:inset-x-0 [&>tr>th]:after:bottom-0 [&>tr>th]:after:h-px [&>tr>th]:after:bg-border-secondary [&>tr>th]:focus-visible:after:bg-transparent",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {selectionBehavior === "toggle" ? (
        <AriaColumn
          className={cx(
            "relative py-2 pr-0 pl-4",
            size === "sm" ? "w-9 md:pl-5" : "w-11 md:pl-6",
          )}
        >
          {selectionMode === "multiple" ? (
            <div className="flex items-start">
              <Checkbox
                slot="selection"
                size={size}
                data-testid="table-head-checkbox"
              />
            </div>
          ) : null}
        </AriaColumn>
      ) : null}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaTableHeader>
  );
};

export const TableHead = ({
  className,
  tooltip,
  label,
  children,
  align = "left",
  ...props
}: TableHeadProps) => {
  const { selectionBehavior } = useTableOptions();

  return (
    <AriaColumn
      {...props}
      className={(state) =>
        cx(
          "relative p-0 px-6 py-2 outline-hidden focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-bg-primary focus-visible:ring-inset",
          selectionBehavior === "toggle" && "nth-2:pl-3",
          state.allowsSorting && "cursor-pointer",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {(state) => (
        <AriaGroup
          className={cx(
            "flex items-center gap-1",
            align === "right" && "justify-end",
          )}
        >
          <div className="flex items-center gap-1">
            {label ? (
              <span className="text-xs font-semibold whitespace-nowrap text-quaternary">
                {label}
              </span>
            ) : null}
            {typeof children === "function" ? children(state) : children}
          </div>
          {tooltip ? (
            <Tooltip title={tooltip} placement="top">
              <TooltipTrigger className="cursor-pointer text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover">
                <HelpCircle className="size-4" />
              </TooltipTrigger>
            </Tooltip>
          ) : null}
          {state.allowsSorting ? (
            state.sortDirection ? (
              <ArrowDown
                className={cx(
                  "size-3 stroke-[3px] text-fg-quaternary",
                  state.sortDirection === "ascending" && "rotate-180",
                )}
              />
            ) : (
              <ChevronSelectorVertical
                size={12}
                strokeWidth={3}
                className="text-fg-quaternary"
              />
            )
          ) : null}
        </AriaGroup>
      )}
    </AriaColumn>
  );
};
