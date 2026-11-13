"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { InventoryTableShell } from "../Inventory/InventoryTableShell";

type Props<T> = {
  title: string;
  count?: number;
  isLoading: boolean;
  isError: boolean;
  rows: T[];
  columns: ColumnDef<T>[];
  emptyTitle: string;
  emptyDescription: string;
  getRowId?: (row: T) => string;
};

export function InventoryOverviewTableCard<T>({
  title,
  count,
  isLoading,
  isError,
  rows,
  columns,
  emptyTitle,
  emptyDescription,
  getRowId,
}: Props<T>) {
  return (
    <InventoryTableShell title={title} count={count}>
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={rows}
          columns={columns}
          getRowId={getRowId}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title={emptyTitle}
            description={emptyDescription}
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
