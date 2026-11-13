"use client";

import type { ComponentPropsWithRef, ReactNode, TdHTMLAttributes } from "react";
import type { Ref } from "react";
import type {
  CellProps as AriaCellProps,
  RowProps as AriaRowProps,
  TableProps as AriaTableProps,
} from "react-aria-components";
import {
  Cell as AriaCell,
  Collection as AriaCollection,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  useTableOptions,
} from "react-aria-components";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { TableContext, useTableSize } from "./table-context";

export type TableRootProps = AriaTableProps &
  Omit<ComponentPropsWithRef<"table">, "className" | "slot" | "style"> & {
    size?: "sm" | "md";
  };

export const TableRoot = ({
  className,
  size = "md",
  ...props
}: TableRootProps) => {
  const context = useTableSize();

  return (
    <TableContext.Provider value={{ size: context?.size ?? size }}>
      <div className="overflow-x-auto">
        <AriaTable
          className={(state) =>
            cx(
              "w-full overflow-x-hidden",
              typeof className === "function" ? className(state) : className,
            )
          }
          {...props}
        />
      </div>
    </TableContext.Provider>
  );
};

export type TableRowProps<T extends object> = AriaRowProps<T> &
  Omit<
    ComponentPropsWithRef<"tr">,
    "children" | "className" | "onClick" | "slot" | "style" | "id"
  > & {
    highlightSelectedRow?: boolean;
    selectionDisabledReason?: string;
  };

export const TableRow = <T extends object>({
  columns,
  children,
  className,
  highlightSelectedRow = true,
  selectionDisabledReason,
  ...props
}: TableRowProps<T>) => {
  const { size } = useTableSize();
  const { selectionBehavior } = useTableOptions();

  return (
    <AriaRow
      {...props}
      className={(state) =>
        cx(
          "relative outline-focus-ring transition-colors after:pointer-events-none hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2",
          size === "sm" ? "h-14" : "h-18",
          highlightSelectedRow && "selected:bg-secondary",
          "[&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-border-secondary last:[&>td]:after:hidden [&>td]:focus-visible:after:opacity-0 focus-visible:[&>td]:after:opacity-0",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {selectionBehavior === "toggle" ? (
        <AriaCell
          className={cx(
            "relative py-2 pr-0 pl-4",
            size === "sm" ? "md:pl-5" : "md:pl-6",
          )}
        >
          <div className="flex items-end">
            {selectionDisabledReason ? (
              <Tooltip title={selectionDisabledReason} placement="top">
                <TooltipTrigger className="inline-flex cursor-not-allowed">
                  <span className="inline-flex">
                    <Checkbox
                      slot="selection"
                      size={size}
                      data-testid="table-row-checkbox"
                    />
                  </span>
                </TooltipTrigger>
              </Tooltip>
            ) : (
              <Checkbox
                slot="selection"
                size={size}
                data-testid="table-row-checkbox-2"
              />
            )}
          </div>
        </AriaCell>
      ) : null}
      {columns ? (
        <AriaCollection items={columns}>{children}</AriaCollection>
      ) : (
        (children as ReactNode)
      )}
    </AriaRow>
  );
};

export type TableCellProps = AriaCellProps &
  Omit<
    TdHTMLAttributes<HTMLTableCellElement>,
    "children" | "className" | "style" | "id"
  > & {
    ref?: Ref<HTMLTableCellElement>;
  };

export const TableCell = ({
  className,
  children,
  ...props
}: TableCellProps) => {
  const { size } = useTableSize();
  const { selectionBehavior } = useTableOptions();

  return (
    <AriaCell
      {...props}
      className={(state) =>
        cx(
          "relative text-sm text-tertiary outline-focus-ring focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2",
          size === "sm" && "px-5 py-3",
          size === "md" && "px-6 py-4",
          selectionBehavior === "toggle" && "nth-2:pl-3",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {children}
    </AriaCell>
  );
};

export { AriaTableBody as TableBody };
