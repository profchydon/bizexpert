"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import SearchWithIcon from "@/components/SearchWithIcon";
import type { InventoryBalance } from "@/types/bizexpert";
import { inventoryBalanceColumns } from "./balanceColumns";
import { filterBalancesBySearch } from "./filterInventoryBySearch";
import { InventoryTableShell } from "./InventoryTableShell";

type Props = {
  rows: InventoryBalance[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearch: (value: string) => void;
  onReceive: () => void;
};

export function BalancesTable({
  rows,
  isLoading,
  isError,
  search,
  onSearch,
  onReceive,
}: Props) {
  const filtered = useMemo(
    () => filterBalancesBySearch(rows ?? [], search),
    [rows, search],
  );
  const columns = useMemo(() => inventoryBalanceColumns(), []);

  return (
    <InventoryTableShell
      title="Balances"
      count={!isLoading ? filtered.length : undefined}
      toolbar={
        <SearchWithIcon
          className="w-[310px]"
          placeholder="Search by product or location"
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
            title="No inventory balances"
            description="Receive stock or set opening quantities to populate balances."
            buttonText="Receive stock"
            onButtonClick={onReceive}
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
