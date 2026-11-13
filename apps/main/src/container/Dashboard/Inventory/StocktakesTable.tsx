"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import type { Stocktake } from "@/types/bizexpert";
import { filterStocktakesBySearch } from "./filterInventoryBySearch";
import { InventoryTableShell } from "./InventoryTableShell";
import { inventoryStocktakeColumns } from "./stocktakeColumns";

type Props = {
  rows: Stocktake[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearch: (value: string) => void;
  onStart: () => void;
  startLoading: boolean;
  canStart: boolean;
};

export function StocktakesTable({
  rows,
  isLoading,
  isError,
  search,
  onSearch,
  onStart,
  startLoading,
  canStart,
}: Props) {
  const { push, isPending } = useTransitionRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const filtered = useMemo(
    () => filterStocktakesBySearch(rows ?? [], search),
    [rows, search],
  );
  const columns = useMemo(
    () =>
      inventoryStocktakeColumns({
        renderActions: (item) => (
          <Button
            variant="outline"
            size="sm"
            isLoading={isPending && activeId === item.id}
            onClick={() => {
              setActiveId(item.id);
              push(`/dashboard/inventory/stocktake/${item.id}`);
            }}
          >
            Open
          </Button>
        ),
      }),
    [activeId, isPending, push],
  );

  return (
    <InventoryTableShell
      title="Stocktakes"
      count={!isLoading ? filtered.length : undefined}
      toolbar={
        <>
          <SearchWithIcon
            className="w-[310px]"
            placeholder="Search by number or location"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          <Button
            variant="primary"
            size="md"
            isLoading={startLoading}
            disabled={!canStart}
            onClick={onStart}
          >
            Start count
          </Button>
        </>
      }
    >
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={filtered}
          columns={columns}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title="No stocktakes yet"
            description="Start a guided count to compare physical stock with the system."
            buttonText="Start count"
            onButtonClick={onStart}
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
