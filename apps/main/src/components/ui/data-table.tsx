"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronSelectorVertical } from "@untitledui/icons";
import { ArrowDown } from "@untitledui/icons";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

import Pagination, { PaginationProps } from "../Custom/Pagination";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { cn } from "@/lib/utils";
import { referenceDataTableProps } from "@/components/application/table/reference-table-classes";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationProps;
  children?: React.ReactNode;
  containerClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerCellClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  paginationClassName?: string;
  renderExpandedRowContent?: (row: TData) => React.ReactNode;
  externalRowSelection?: Record<string, boolean>;
  setSeletectedValue?: (row: TData[]) => void;
  getRowId?: (originalRow: TData, index: number) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  containerClassName,
  pagination,
  paginationClassName,
  renderExpandedRowContent,
  externalRowSelection,
  setSeletectedValue,
  getRowId,
  tableClassName,
  headerClassName,
  headerCellClassName,
  rowClassName,
  cellClassName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const toggleRowExpanded = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  React.useEffect(() => {
    const isSelectedValue = table
      .getFilteredSelectedRowModel()
      ?.rows?.map((item) => item.original);
    setSeletectedValue?.(isSelectedValue);
  }, [rowSelection]);

  React.useEffect(() => {
    if (externalRowSelection) {
      setRowSelection(externalRowSelection);
    }
  }, [externalRowSelection]);

  return (
    <div
      className={cn(
        referenceDataTableProps.containerClassName,
        "w-full overflow-x-auto",
        containerClassName,
      )}
    >
      <Table
        className={cn(referenceDataTableProps.tableClassName, tableClassName)}
      >
        {table?.getRowModel()?.rows?.length ? (
          <TableHeader
            className={cn(
              referenceDataTableProps.headerClassName,
              headerClassName,
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-left">
                {headerGroup.headers.map((header, headerIndex) => {
                  return (
                    <TableHead
                      key={`${headerGroup.id}-${header.id}-${headerIndex}`}
                      colSpan={header.colSpan}
                      className={cn(
                        referenceDataTableProps.headerCellClassName,
                        headerCellClassName,
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex cursor-pointer select-none items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {header.column.getCanSort() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ArrowDown className="size-3 stroke-[3px] text-fg-quaternary rotate-180" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="size-3 stroke-[3px] text-fg-quaternary" />
                          ) : (
                            <ChevronSelectorVertical className="size-3 text-fg-quaternary" />
                          )
                        ) : null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        ) : null}

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    referenceDataTableProps.rowClassName,
                    rowClassName,
                  )}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={`${row.id}-${cell.column.id}-${cellIndex}`}
                      className={cn(
                        referenceDataTableProps.cellClassName,
                        cellClassName,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {columns.some((col) => col.meta?.isCollapse) && (
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleRowExpanded(row.id)}
                        className="focus:outline-none"
                      >
                        {expandedRows[row.id] ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
                {expandedRows[row.id] && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>
                      <div className="p-4">
                        {renderExpandedRowContent ? (
                          renderExpandedRowContent(row.original)
                        ) : (
                          <>Expanded content not provided</>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : !children ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      {!table.getRowModel().rows?.length && children && (
        <div className="flex w-full flex-col">{children}</div>
      )}

      {pagination && (
        <div className={cn("px-4", paginationClassName)}>
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={pagination.onPageChange}
            buttonClassName={pagination.buttonClassName}
            className={pagination.className}
            nextLabel={pagination.nextLabel}
            prevLabel={pagination.prevLabel}
          />
        </div>
      )}
    </div>
  );
}
