"use client";

import { Copy01, Edit01, Trash01 } from "@untitledui/icons";
import type { ComponentPropsWithRef } from "react";
import type { TableProps as AriaTableProps } from "react-aria-components";
import { TableBody as AriaTableBody } from "react-aria-components";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { TableCard } from "./table-card";
import { TableHead, TableHeader } from "./table-head";
import { TableCell, TableRoot, TableRow } from "./table-row";

export type TableRootProps = AriaTableProps &
  Omit<ComponentPropsWithRef<"table">, "className" | "slot" | "style"> & {
    size?: "sm" | "md";
  };

const Table = TableRoot as typeof TableRoot & {
  Body: typeof AriaTableBody;
  Cell: typeof TableCell;
  Head: typeof TableHead;
  Header: typeof TableHeader;
  Row: typeof TableRow;
};

Table.Body = AriaTableBody;
Table.Cell = TableCell;
Table.Head = TableHead;
Table.Header = TableHeader;
Table.Row = TableRow;

export const TableRowActionsDropdown = () => (
  <Dropdown.Root>
    <Dropdown.DotsButton />
    <Dropdown.Popover className="w-min">
      <Dropdown.Menu>
        <Dropdown.Item icon={Edit01}>
          <span className="pr-4">Edit</span>
        </Dropdown.Item>
        <Dropdown.Item icon={Copy01}>
          <span className="pr-4">Copy link</span>
        </Dropdown.Item>
        <Dropdown.Item icon={Trash01}>
          <span className="pr-4">Delete</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown.Root>
);

export { Table, TableCard };
export {
  referenceDataTableProps,
  referenceNativeBodyCellClass,
  referenceNativeBodyRowClass,
  referenceNativeHeadCellClass,
  referenceNativeHeadRowClass,
  referenceNativeTableClass,
  referenceTableHeaderClass,
  referenceTableCardHeaderDividerClass,
  referenceTablePaginationClass,
  referenceTableRowClass,
  referenceTableShellClass,
} from "./reference-table-classes";
