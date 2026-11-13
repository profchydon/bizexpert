"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import SearchWithIcon from "@/components/SearchWithIcon";
import type { StockTransfer } from "@/types/bizexpert";
import { filterTransfersBySearch } from "./filterInventoryBySearch";
import { InventoryTableShell } from "./InventoryTableShell";
import { inventoryTransferColumns } from "./transferColumns";
import { TransferRowActions } from "./TransferRowActions";

type Props = {
  rows: StockTransfer[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearch: (value: string) => void;
  onTransfer: () => void;
  onReceive: (id: string) => void;
  onCancel: (item: StockTransfer) => void;
};

export function TransfersTable({
  rows,
  isLoading,
  isError,
  search,
  onSearch,
  onTransfer,
  onReceive,
  onCancel,
}: Props) {
  const filtered = useMemo(
    () => filterTransfersBySearch(rows ?? [], search),
    [rows, search],
  );
  const columns = useMemo(
    () =>
      inventoryTransferColumns({
        renderActions: (item) => (
          <TransferRowActions
            item={item}
            onReceive={() => onReceive(item.id)}
            onCancel={() => onCancel(item)}
          />
        ),
      }),
    [onCancel, onReceive],
  );

  return (
    <InventoryTableShell
      title="Transfers"
      count={!isLoading ? filtered.length : undefined}
      toolbar={
        <SearchWithIcon
          className="w-[310px]"
          placeholder="Search by number or location"
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
            title="No transfers yet"
            description="Dispatch stock between locations to see it here."
            buttonText="Dispatch transfer"
            onButtonClick={onTransfer}
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
