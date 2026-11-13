"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import SearchWithIcon from "@/components/SearchWithIcon";
import type { StockMovement } from "@/types/bizexpert";
import { filterMovementsBySearch } from "./filterInventoryBySearch";
import { InventoryTableShell } from "./InventoryTableShell";
import { inventoryMovementColumns } from "./movementColumns";

type Props = {
  rows: StockMovement[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearch: (value: string) => void;
};

export function MovementsTable({
  rows,
  isLoading,
  isError,
  search,
  onSearch,
}: Props) {
  const filtered = useMemo(
    () => filterMovementsBySearch(rows ?? [], search),
    [rows, search],
  );
  const columns = useMemo(() => inventoryMovementColumns(), []);

  return (
    <InventoryTableShell
      title="History"
      count={!isLoading ? filtered.length : undefined}
      toolbar={
        <SearchWithIcon
          className="w-[310px]"
          placeholder="Search by product or type"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      }
    >
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={filtered}
          columns={columns}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title="No movements"
            description="Inventory activity will appear here."
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
